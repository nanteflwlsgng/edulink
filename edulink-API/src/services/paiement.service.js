// services/paiement.service.js
import { PrismaClient } from '@prisma/client';
import { 
  StripeService, 
  MobileMoneyService, 
  TrancheManager, 
  ReceiptGenerator 
} from '../utils/paiementUtils.js';

const prisma = new PrismaClient();

export class PaiementService {
  
  // --- C'EST CETTE MÉTHODE QU'ON MODIFIE ---
  // services/paiement.service.js

  // services/paiement.service.js

// services/paiement.service.js

// services/paiement.service.js

async effectuerPaiement(data) {
    const { 
      id_inscription, mode_paiement, methode_paiement, 
      raison_paiement, montant_total, details 
    } = data;
    
    // 1. Récupération de l'Inscription (Indispensable pour savoir à qui envoyer la notif)
    const inscription = await prisma.inscription.findUnique({
        where: { id_inscription: parseInt(id_inscription) },
        include: { 
            formation: { include: { ecole: true } }, 
            etudiant: true // Contient id_utilisateur
        }
    });

    if (!inscription) throw new Error("Inscription introuvable.");

    // 2. Traitement Externe (Simulation Stripe/Mobile Money)
    let resultatPaiement = { success: true, statut: 'PAYE', idTransaction: `TX-${Date.now()}` };
    if (mode_paiement !== 'GRATUIT') {
        resultatPaiement = await this.traiterPaiementExterne(data);
    }

    // 3. PRÉPARATION DES DÉTAILS SÉCURISÉS
    let secureDetails = {};
    if (methode_paiement === 'MOBILE_MONEY') {
        secureDetails = { telephone: details.telephone, operateur: details.operator };
    } else if (methode_paiement === 'CARTE') {
        secureDetails = {
            nom_porteur: details.nomCarte,
            dernier_chiffres: details.numeroCarte ? details.numeroCarte.slice(-4) : "****",
            date_expiration: details.expiration
        };
    }

    // 4. CRÉATION DU PAIEMENT DANS LA BDD
    const paiement = await prisma.paiement.create({
      data: {
        mode_paiement,
        methode_paiement,
        raison_paiement,
        montant_total: parseFloat(montant_total),
        statut: resultatPaiement.statut,
        date_paiement: new Date(),
        id_inscription: parseInt(id_inscription),
        details_paiement: secureDetails 
      }
    });

    // 5. ACTIONS POST-PAIEMENT (Génération de la Notification)
    if (paiement.statut === 'PAYE' && id_inscription) {
        
        // ATTENTION : On n'inscrit plus l'étudiant ici, on attend la validation de l'école.

        const dateStr = new Date().toLocaleDateString('fr-FR');
        
        // ✅ CRÉATION DE LA NOTIFICATION
        await prisma.notification.create({
            data: {
                id_utilisateur: inscription.etudiant.id_utilisateur, // L'ID du compte de l'étudiant
                type: 'SUCCESS',
                titre: 'Paiement Reçu',
                message: `Votre paiement de ${montant_total} Ar a été reçu avec succès. Votre dossier est en attente de validation par ${inscription.formation.ecole.nom}.`,
                donnees: {
                    id_paiement: paiement.id_paiement,
                    recu_url: `/api/paiements/${paiement.id_paiement}/recu` // Permet de télécharger le reçu financier
                },
                lue: false
            }
        });
    }
    
    return { paiement, transaction: resultatPaiement };
}
// services/paiement.service.js

async validerPaiementEcole(idPaiement) {
    // 1. Récupérer le paiement
    const paiement = await prisma.paiement.findUnique({
        where: { id_paiement: parseInt(idPaiement) },
        include: { inscription: true }
    });

    if (!paiement) throw new Error("Paiement introuvable");
    if (paiement.statut === 'VALIDEE') throw new Error("Paiement déjà validé");

    // 2. Transaction atomique : Update Paiement + Update Inscription
    // C'est ICI que l'étudiant devient officiellement inscrit
    const resultat = await prisma.$transaction([
        // A. Mettre le paiement en VALIDEE
        prisma.paiement.update({
            where: { id_paiement: parseInt(idPaiement) },
            data: { statut: 'VALIDEE' }
        }),

        // B. Inscrire l'étudiant (Génération Matricule, Statut Inscrit)
        prisma.inscription.update({
            where: { id_inscription: paiement.id_inscription },
            data: { 
                statut: 'INSCRIT',
                matricule: `ETU-2025-${paiement.id_inscription}` // Votre logique de matricule
            }
        })
    ]);

    // 3. Notifier l'étudiant
    await prisma.notification.create({
        data: {
            id_utilisateur: paiement.inscription.id_etudiant, // Attention à bien récupérer l'ID utilisateur
            type: 'SUCCESS',
            titre: 'Inscription Validée',
            message: 'Votre paiement a été validé par l\'école. Vous pouvez maintenant télécharger votre carte étudiant.',
            lue: false
        }
    });

    return resultat;
}
  // --- LE RESTE NE CHANGE PAS ---

  async traiterPaiementTranche(idTranche, detailsPaiement) {
    const tranche = await prisma.tranchePaiement.findUnique({
      where: { id_tranche: idTranche },
      include: {
        paiement: true
      }
    });
    
    if (!tranche) {
      throw new Error("Tranche de paiement non trouvée");
    }
    
    if (tranche.statut === 'PAYE') {
      throw new Error("Cette tranche est déjà payée");
    }
    
    const resultatPaiement = await this.traiterPaiementExterne({
      mode_paiement: 'UNIQUE',
      methode_paiement: detailsPaiement.methode_paiement,
      raison_paiement: tranche.paiement.raison_paiement,
      montant_total: tranche.montant,
      details: detailsPaiement
    });
    
    if (!resultatPaiement.success) {
      throw new Error("Échec du paiement de la tranche");
    }
    
    const trancheModifiee = await prisma.tranchePaiement.update({
      where: { id_tranche: idTranche },
      data: {
        statut: 'PAYE',
        date_paiement: new Date()
      },
      include: {
        paiement: {
          include: {
            tranches: true
          }
        }
      }
    });
    
    const toutesTranchesPayees = trancheModifiee.paiement.tranches.every(t => t.statut === 'PAYE');
    if (toutesTranchesPayees) {
      await prisma.paiement.update({
        where: { id_paiement: trancheModifiee.paiement.id_paiement },
        data: { statut: 'PAYE' }
      });
      
      // ✅ Si c'était un paiement par tranches, et que tout est fini, on inscrit l'élève aussi
      if (trancheModifiee.paiement.id_inscription) {
         await prisma.inscription.update({
            where: { id_inscription: trancheModifiee.paiement.id_inscription },
            data: { statut: 'INSCRIT' }
         });
      }
    }
    
    return {
      tranche: trancheModifiee,
      transaction: resultatPaiement,
      paiementComplet: toutesTranchesPayees
    };
  }

  async verifierStatutPaiement(idPaiement) {
    const paiement = await prisma.paiement.findUnique({
      where: { id_paiement: idPaiement },
      include: { inscription: true, tranches: true }
    });
    
    if (!paiement) throw new Error("Paiement non trouvé");
    
    let statutExterne = null;
    if (paiement.methode_paiement && paiement.statut === 'EN_ATTENTE') {
      statutExterne = await this.verifierStatutExterne(paiement);
    }
    
    return { paiement, statutExterne, dateVerification: new Date().toISOString() };
  }

  async mettreAJourStatut(idPaiement, nouveauStatut) {
    const paiement = await prisma.paiement.findUnique({
      where: { id_paiement: idPaiement }
    });
    
    if (!paiement) throw new Error("Paiement non trouvé");
    
    const paiementModifie = await prisma.paiement.update({
      where: { id_paiement: idPaiement },
      data: { statut: nouveauStatut },
      include: { inscription: true }
    });
    
    // ✅ Si on force le statut à PAYE manuellement, on inscrit l'élève
    if (nouveauStatut === 'PAYE' && paiementModifie.id_inscription) {
        await prisma.inscription.update({
            where: { id_inscription: paiementModifie.id_inscription },
            data: { statut: 'INSCRIT' }
        });
    }
    
    return paiementModifie;
  }

  async genererRecu(idPaiement) {
    const paiement = await prisma.paiement.findUnique({
      where: { id_paiement: idPaiement },
      include: { inscription: { include: { etudiant: { include: { utilisateur: true } }, formation: true } } }
    });
    
    if (!paiement) throw new Error("Paiement non trouvé");
    const recu = await ReceiptGenerator.genererRecu(paiement);
    return { paiement, recu };
  }

  async traiterPaiementExterne(data) {
    const { methode_paiement, montant_total, raison_paiement, details } = data;
    const description = `Paiement ${raison_paiement.toLowerCase()} - ${montant_total}`;
    
    switch (methode_paiement) {
      case 'CARTE':
        return await StripeService.processPaiementCarte(
          parseFloat(montant_total),
          details.tokenPaiement,
          description,
          details.currency
        );
      case 'MOBILE_MONEY':
        return await MobileMoneyService.processPaiement(
          parseFloat(montant_total),
          details.telephone,
          description,
          details.operator
        );
      default:
        throw new Error("Méthode de paiement non supportée");
    }
  }

  validerPaiement(data) {
    const { mode_paiement, methode_paiement, montant_total, details } = data;
    if (montant_total < 0) throw new Error("Le montant doit être positif");
    if (mode_paiement !== 'GRATUIT' && !methode_paiement) throw new Error("Méthode de paiement requise");
    if (methode_paiement === 'MOBILE_MONEY' && !details?.telephone) throw new Error("Numéro de téléphone requis");
  }

  async verifierStatutExterne(paiement) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          statut: 'PAYE',
          idTransactionExterne: `ext_${paiement.id_paiement}`,
          dateVerificationExterne: new Date().toISOString()
        });
      }, 500);
    });
  }

  async getPaiementById(idPaiement) {
    return await prisma.paiement.findUnique({
      where: { id_paiement: idPaiement },
      include: { inscription: true, tranches: true }
    });
  }

  async getPaiementsByInscription(idInscription) {
    return await prisma.paiement.findMany({
      where: { id_inscription: idInscription },
      include: { tranches: true },
      orderBy: { created_at: 'desc' }
    });
  }

  async getTranchesEnRetard() {
    const aujourdHui = new Date();
    return await prisma.tranchePaiement.findMany({
      where: { date_echance: { lt: aujourdHui }, statut: 'EN_ATTENTE' },
      include: { paiement: true },
      orderBy: { date_echance: 'asc' }
    });
  }
  // services/paiement.service.js

async getHistoriqueFinances() {
  // 1. Récupération des données brutes avec les relations (Exactement comme pour le reçu)
  const paiements = await prisma.paiement.findMany({
    // On filtre pour avoir ceux qui ont payé ou qui sont en attente de validation
    // Si vous voulez SEULEMENT ceux validés, ajoutez : where: { statut: 'PAYE' },
    orderBy: { created_at: 'desc' },
    include: {
      inscription: {
        include: {
          etudiant: {
            include: {
              utilisateur: true // Pour avoir Nom et Prénom
            }
          },
          formation: true // Pour avoir le titre de la formation
        }
      }
    }
  });

  // 2. Extraction et Formatage (La logique que vous cherchiez)
  return paiements.map(p => {
    // Sécurisation des données (comme dans votre ReceiptGenerator)
    const details = p.details_paiement || {};
    const utilisateur = p.inscription?.etudiant?.utilisateur;
    const formation = p.inscription?.formation;

    // Construction du nom complet
    const nomComplet = utilisateur 
        ? `${utilisateur.nom || ''} ${utilisateur.prenom || ''}`.trim() 
        : "Étudiant Inconnu";

    // Extraction de la référence (Transaction ID)
    // On prend celle du provider (ex: Stripe/Mobile) ou sinon l'ID interne
    const refTransaction = details.idTransaction || `TX-${p.id_paiement}`;

    // Retour au format attendu par votre page React "Finance"
    return {
      id: p.id_paiement,            // Utilisé comme clé unique
      ref: refTransaction,          // La référence (REF)
      studentName: nomComplet,      // Le Candidat (CANDIDAT)
      studentId: p.inscription?.etudiant?.id_etudiant,
      inscriptionId: p.id_inscription, // Important pour la validation
      formation: formation?.titre || "Formation Inconnue",
      amount: `${p.montant_total.toLocaleString('fr-FR')} Ar`, // MONTANT formaté
      rawAmount: p.montant_total,   // Montant brut (utile si besoin de calculs)
      status: p.statut,             // STATUT (PAYE, EN_ATTENTE, etc.)
      date: p.created_at,           // Date pour le tri
      methode: p.methode_paiement   // (Optionnel) Pour info
    };
  });
}
}


export const paiementService = new PaiementService();