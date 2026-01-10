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
  async effectuerPaiement(data) {
    const { 
      id_inscription, 
      mode_paiement, 
      methode_paiement, 
      raison_paiement, 
      montant_total, 
      details 
    } = data;
    
    // Validation des données
    this.validerPaiement(data);
    
    // Vérifier l'inscription si fournie
    if (id_inscription) {
      const inscriptionExist = await prisma.inscription.findUnique({
        where: { id_inscription }
      });
      
      if (!inscriptionExist) {
        throw new Error("Inscription non trouvée");
      }
    }
    
    let tranches = [];
    let resultatPaiement = null;
    
    // Générer les tranches si mode TRANCHE
    if (mode_paiement === 'TRANCHE') {
      tranches = TrancheManager.genererTranches(
        parseFloat(montant_total), 
        mode_paiement, 
        details.nombreTranches
      );
    }
    
    // Traiter le paiement selon la méthode (sauf pour GRATUIT)
    if (mode_paiement !== 'GRATUIT' && methode_paiement) {
      resultatPaiement = await this.traiterPaiementExterne(data);
      
      if (!resultatPaiement.success) {
        throw new Error("Échec du traitement du paiement");
      }
    }
    
    // Créer l'enregistrement de paiement
    const paiementData = {
      mode_paiement,
      methode_paiement: mode_paiement === 'GRATUIT' ? null : methode_paiement,
      raison_paiement,
      montant_total: parseFloat(montant_total),
      statut: mode_paiement === 'GRATUIT' ? 'PAYE' : (resultatPaiement?.statut || 'EN_ATTENTE'),
      date_paiement: mode_paiement === 'GRATUIT' ? new Date() : (resultatPaiement ? new Date() : null),
      id_inscription: id_inscription || null,
      tranches: tranches.length > 0 ? {
        create: tranches.map(tranche => ({
          ...tranche,
          statut: mode_paiement === 'GRATUIT' ? 'PAYE' : tranche.statut
        }))
      } : undefined
    };
    
    const paiement = await prisma.paiement.create({
      data: paiementData,
      include: {
        inscription: {
          include: {
            etudiant: {
              include: {
                utilisateur: {
                  select: {
                    nom: true,
                    prenom: true,
                    email: true
                  }
                }
              }
            },
            formation: {
              select: {
                titre: true,
                description: true
              }
            }
          }
        },
        tranches: true
      }
    });
    
    return {
      paiement,
      transaction: resultatPaiement
    };
  }

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
    
    // Traiter le paiement de la tranche
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
    
    // Mettre à jour la tranche
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
    
    // Vérifier si toutes les tranches sont payées
    const toutesTranchesPayees = trancheModifiee.paiement.tranches.every(t => t.statut === 'PAYE');
    if (toutesTranchesPayees) {
      await prisma.paiement.update({
        where: { id_paiement: trancheModifiee.paiement.id_paiement },
        data: { statut: 'PAYE' }
      });
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
      include: {
        inscription: {
          include: {
            etudiant: {
              include: {
                utilisateur: {
                  select: {
                    nom: true,
                    prenom: true
                  }
                }
              }
            },
            formation: {
              select: {
                titre: true
              }
            }
          }
        },
        tranches: true
      }
    });
    
    if (!paiement) {
      throw new Error("Paiement non trouvé");
    }
    
    // Vérifier le statut externe si nécessaire
    let statutExterne = null;
    if (paiement.methode_paiement && paiement.statut === 'EN_ATTENTE') {
      statutExterne = await this.verifierStatutExterne(paiement);
    }
    
    return {
      paiement,
      statutExterne,
      dateVerification: new Date().toISOString()
    };
  }

  async mettreAJourStatut(idPaiement, nouveauStatut) {
    const paiement = await prisma.paiement.findUnique({
      where: { id_paiement: idPaiement }
    });
    
    if (!paiement) {
      throw new Error("Paiement non trouvé");
    }
    
    const paiementModifie = await prisma.paiement.update({
      where: { id_paiement: idPaiement },
      data: { statut: nouveauStatut },
      include: {
        inscription: {
          include: {
            etudiant: {
              include: {
                utilisateur: {
                  select: {
                    nom: true,
                    prenom: true
                  }
                }
              }
            }
          }
        },
        tranches: true
      }
    });
    
    return paiementModifie;
  }

  async genererRecu(idPaiement) {
    const paiement = await prisma.paiement.findUnique({
      where: { id_paiement: idPaiement },
      include: {
        inscription: {
          include: {
            etudiant: {
              include: {
                utilisateur: {
                  select: {
                    nom: true,
                    prenom: true,
                    email: true
                  }
                }
              }
            },
            formation: {
              select: {
                titre: true,
                description: true
              }
            }
          }
        },
        tranches: true
      }
    });
    
    if (!paiement) {
      throw new Error("Paiement non trouvé");
    }
    
    const recu = await ReceiptGenerator.genererRecu(paiement);
    
    return {
      paiement,
      recu
    };
  }

  // Méthodes auxiliaires
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
    const { mode_paiement, methode_paiement, raison_paiement, montant_total, details } = data;
    
    if (montant_total < 0) {
      throw new Error("Le montant doit être positif");
    }
    
    if (mode_paiement === 'GRATUIT' && montant_total > 0) {
      throw new Error("Le mode GRATUIT doit avoir un montant de 0");
    }
    
    if (mode_paiement !== 'GRATUIT' && !methode_paiement) {
      throw new Error("Méthode de paiement requise pour les modes non-gratuits");
    }
    
    if (mode_paiement === 'TRANCHE' && (!details.nombreTranches || details.nombreTranches < 2)) {
      throw new Error("Le mode TRANCHE nécessite au moins 2 tranches");
    }
    
    if (methode_paiement === 'CARTE' && !details?.tokenPaiement) {
      throw new Error("Token de paiement requis pour les paiements par carte");
    }
    
    if (methode_paiement === 'MOBILE_MONEY' && !details?.telephone) {
      throw new Error("Numéro de téléphone requis pour les paiements Mobile Money");
    }
  }

  async verifierStatutExterne(paiement) {
    // Simulation de vérification externe
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          statut: 'PAYE', // Simulé
          idTransactionExterne: `ext_${paiement.id_paiement}`,
          dateVerificationExterne: new Date().toISOString()
        });
      }, 500);
    });
  }

  // Getters
  async getPaiementById(idPaiement) {
    const paiement = await prisma.paiement.findUnique({
      where: { id_paiement: idPaiement },
      include: {
        inscription: {
          include: {
            etudiant: {
              include: {
                utilisateur: {
                  select: {
                    nom: true,
                    prenom: true,
                    email: true
                  }
                }
              }
            },
            formation: {
              select: {
                titre: true,
                description: true
              }
            }
          }
        },
        tranches: {
          orderBy: { numero_tranche: 'asc' }
        }
      }
    });
    
    if (!paiement) {
      throw new Error("Paiement non trouvé");
    }
    
    return paiement;
  }

  async getPaiementsByInscription(idInscription) {
    return await prisma.paiement.findMany({
      where: { id_inscription: idInscription },
      include: {
        inscription: {
          include: {
            etudiant: {
              include: {
                utilisateur: {
                  select: {
                    nom: true,
                    prenom: true
                  }
                }
              }
            }
          }
        },
        tranches: {
          orderBy: { numero_tranche: 'asc' }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
  }

  async getTranchesEnRetard() {
    const aujourdHui = new Date();
    
    return await prisma.tranchePaiement.findMany({
      where: {
        date_echance: { lt: aujourdHui },
        statut: 'EN_ATTENTE'
      },
      include: {
        paiement: {
          include: {
            inscription: {
              include: {
                etudiant: {
                  include: {
                    utilisateur: {
                      select: {
                        nom: true,
                        prenom: true,
                        email: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        date_echance: 'asc'
      }
    });
  }
}

export const paiementService = new PaiementService();