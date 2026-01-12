import { generatePDFBuffer } from './pdf.js';
// Service Stripe (carte bancaire)
export class StripeService {
  static async processPaiementCarte(montant, tokenPaiement, description, currency = 'eur') {
    console.log(`Processing Stripe card payment: ${montant} ${currency} - ${description}`);
    
    // Simulation d'appel API Stripe
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          idTransaction: `stripe_${Date.now()}`,
          statut: 'PAYE',
          montant,
          currency,
          description,
          date: new Date().toISOString(),
          receipt_url: `https://stripe.com/receipts/${Date.now()}`
        });
      }, 5000);
    });
  }
}

// Service PayPal
export class PayPalService {
  static async processPaiement(montant, orderId, description, currency = 'EUR') {
    console.log(`Processing PayPal payment: ${montant} ${currency} - ${description}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          idTransaction: `paypal_${Date.now()}`,
          statut: 'COMPLETED',
          montant,
          currency,
          description,
          orderId,
          date: new Date().toISOString()
        });
      }, 5000);
    });
  }
}

// Service Mobile Money
export class MobileMoneyService {
  static async processPaiement(montant, telephone, description, operator = 'ORANGE') {
    console.log(`Processing Mobile Money payment: ${montant} for ${telephone} (${operator}) - ${description}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          idTransaction: `mobile_${Date.now()}`,
          statut: 'PAYE',
          montant,
          telephone,
          operator,
          description,
          date: new Date().toISOString()
        });
      }, 5000);
    });
  }
}

// Gestionnaire de tranches
export class TrancheManager {
  static genererTranches(montantTotal, modePaiement, nombreTranches = 3) {
    if (modePaiement !== 'TRANCHE') {
      return [];
    }

    const tranches = [];
    const montantTranche = Math.round((montantTotal / nombreTranches) * 100) / 100;
    let reste = montantTotal;

    for (let i = 1; i <= nombreTranches; i++) {
      let montant = montantTranche;
      
      // Pour la dernière tranche, on prend ce qui reste
      if (i === nombreTranches) {
        montant = Math.round(reste * 100) / 100;
      } else {
        reste -= montantTranche;
      }

      const dateEchance = new Date();
      dateEchance.setMonth(dateEchance.getMonth() + i);

      tranches.push({
        numero_tranche: i,
        montant,
        date_echance: dateEchance,
        statut: 'EN_ATTENTE'
      });
    }

    return tranches;
  }

  static async traiterTranche(idTranche, detailsPaiement) {
    // Simulation du traitement d'une tranche
    console.log(`Processing tranche ${idTranche} with details:`, detailsPaiement);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          idTransaction: `tranche_${idTranche}_${Date.now()}`,
          statut: 'PAYE',
          date: new Date().toISOString()
        });
      }, 1000);
    });
  }
}

// Générateur de reçu

export class ReceiptGenerator {
  
  static async genererRecu(paiement) {
    console.log('Génération du reçu pour le paiement:', paiement.id_paiement);
    
    // --- A. PRÉPARATION DES DONNÉES ---
    
    // 1. Formatage Date et Montant
    const dateStr = new Date(paiement.date_paiement).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const montantStr = parseFloat(paiement.montant_total).toLocaleString('fr-FR') + ' Ar';

    // 2. Extraction intelligente des détails JSON
    const details = paiement.details_paiement || {};
    let infoMoyenPaiement = "";

    if (paiement.methode_paiement === 'MOBILE_MONEY') {
        // Ex: "MVOLA (034 12 345 67)"
        infoMoyenPaiement = `${details.operateur || 'Mobile'} (${details.telephone || 'Non spécifié'})`;
    } else if (paiement.methode_paiement === 'CARTE') {
        // Ex: "Carte Bancaire - JEAN DUPONT (**** 4242)"
        infoMoyenPaiement = `Carte - ${details.nom_porteur || ''} (**** ${details.dernier_chiffres || '****'})`;
    } else {
        infoMoyenPaiement = paiement.methode_paiement;
    }

    // 3. Infos Étudiant et École (Sécurité avec le "?." au cas où)
    const etudiantNom = `${paiement.inscription?.etudiant?.utilisateur?.nom || ''} ${paiement.inscription?.etudiant?.utilisateur?.prenom || ''}`.trim();
    const ecoleNom = paiement.inscription?.formation?.ecole?.nom || 'EduLink School';
    const formationTitre = paiement.inscription?.formation?.titre || 'Formation';

    // --- B. CONSTRUCTION DU TEXTE (Format compatible avec votre pdf.js) ---
    // Votre pdf.js détecte les ":" pour mettre en gras le label
    
    const content = `
==================
DÉTAILS DE LA TRANSACTION
==================
Référence Transaction: ${details.idTransaction || `TX-${paiement.id_paiement}`}
Date de validation: ${dateStr}
Statut: ${paiement.statut}

INFORMATION DE PAIEMENT
Montant réglé: ${montantStr}
Mode: ${paiement.mode_paiement}
Méthode: ${paiement.methode_paiement}
Détail du moyen: ${infoMoyenPaiement}

BÉNÉFICIAIRE (ÉCOLE)
Établissement: ${ecoleNom}
Formation: ${formationTitre}
Motif: ${paiement.raison_paiement}

PAYEUR (ÉTUDIANT)
Nom et Prénom: ${etudiantNom}
Email: ${paiement.inscription?.etudiant?.utilisateur?.email || 'Non renseigné'}
    `;

    // --- C. GÉNÉRATION DU BUFFER ---
    
    try {
        // Appel de votre fonction existante dans pdf.js
        const pdfBuffer = await generatePDFBuffer(content);

        // Retour au format attendu par le controller
        return {
            buffer: pdfBuffer,
            filename: `Recu_Paiement_${paiement.id_paiement}.pdf`,
            contentType: 'application/pdf'
        };
    } catch (error) {
        console.error("Erreur génération PDF:", error);
        throw new Error("Impossible de générer le fichier PDF");
    }
  }
}
export class CardGenerator {
  static async genererCarte(inscription) {
    const etudiant = inscription.etudiant.utilisateur;
    const formation = inscription.formation;
    const ecole = formation.ecole;
    const matricule = inscription.matricule || "EN COURS";
    
    // Année universitaire (logique simple)
    const year = new Date().getFullYear();
    const anneeUniv = `${year}-${year + 1}`;

    // Construction du contenu TEXTE (Simplifié pour votre générateur actuel)
    // Si vous voulez un design graphique complexe avec image, il faudrait utiliser pdfkit directement ici.
    // Mais pour rester cohérent avec votre méthode "generatePDFBuffer" qui prend du texte :
    
    const content = `
*****************************************
        CARTE D'ÉTUDIANT ${anneeUniv}
*****************************************

ÉTABLISSEMENT
Nom : ${ecole.nom}
Adresse : ${ecole.adresse || 'Antananarivo, Madagascar'}

ÉTUDIANT(E)
Matricule : ${matricule}
Nom : ${etudiant.nom.toUpperCase()}
Prénom : ${etudiant.prenom}
Email : ${etudiant.email}

FORMATION
Cursus : ${formation.titre}
Niveau : ${formation.niveau}

-----------------------------------------
Valide jusqu'au : 30 Juin ${year + 1}
Ce document certifie l'inscription régulière 
de l'étudiant pour l'année en cours.
-----------------------------------------
    `;

    // Appel à votre fonction existante qui transforme le texte en PDF
    return await generatePDFBuffer(content);
  }
}