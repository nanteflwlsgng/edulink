import prisma from "../config/prismaClient.js";
import { generateCarteEtudiantQR } from '../utils/qrcode.js';
export const etudiantService = {
  // 🔹 PROFIL ÉTUDIANT
  async getProfilEtudiant(id_utilisateur) {
    return prisma.etudiant.findUnique({
      where: { id_utilisateur },
      include: {
        utilisateur: {
          select: {
            email: true,
            nom: true,
            prenom: true,
            
          }
        },
        inscriptions: {
          include: {
            formation: {
              include: {
                ecole: {
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
            }
          }
        }
      }
    });
  },

  // async creerProfilEtudiant(id_utilisateur, data) {
  //   return prisma.etudiant.create({
  //     data: {
  //       date_naissance: data.date_naissance ? new Date(data.date_naissance) : null,
  //       adresse: data.adresse,
  //       telephone: data.telephone,
  //       id_utilisateur
  //     },
  //     include: {
  //       utilisateur: {
  //         select: {
  //           email: true,
  //           nom: true,
  //           prenom: true,
  //           statut: true
  //         }
  //       }
  //     }
  //   });
  // },

  async modifierProfilEtudiant(id_utilisateur, data) {
    return prisma.etudiant.update({
      where: { id_utilisateur },
      data: {
        date_naissance: data.date_naissance ? new Date(data.date_naissance) : null,
        adresse: data.adresse,
        telephone: data.telephone
      },
      include: {
        utilisateur: {
          select: {
            email: true,
            nom: true,
            prenom: true,
            statut: true
          }
        }
      }
    });
  },

  // 🔹 RECHERCHE ÉCOLES
  async rechercherEcoles(filtres = {}) {
    const { nom, specialite, page = 1, limit = 10 } = filtres;
    
    const where = {};
    if (nom) where.nom = { contains: nom, mode: 'insensitive' };
    
    const skip = (page - 1) * limit;

    const [ecoles, total] = await Promise.all([
      prisma.ecole.findMany({
        where,
        skip,
        take: limit,
        include: {
          utilisateur: {
            select: {
              email: true,
              nom: true,
              prenom: true,
              statut: true
            }
          },
          formations: {
            where: {
              statut: 'ACTIF'
            },
            include: {
              _count: {
                select: {
                  inscriptions: {
                    where: {
                      statut: 'VALIDEE'
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              formations: {
                where: {
                  statut: 'ACTIF'
                }
              }
            }
          }
        }
      }),
      prisma.ecole.count({ where })
    ]);

    return {
      ecoles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // 🔹 CONSULTER PROFIL ÉCOLE
  async consulterProfilEcole(id_ecole) {
    return prisma.ecole.findUnique({
      where: { id_ecole },
      include: {
        utilisateur: {
          select: {
            email: true,
            nom: true,
            prenom: true,
            statut: true
          }
        },
        formations: {
          where: {
            statut: 'ACTIF'
          },
          include: {
            _count: {
              select: {
                inscriptions: {
                  where: {
                    statut: 'VALIDEE'
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            formations: {
              where: {
                statut: 'ACTIF'
              }
            }
          }
        }
      }
    });
  },

  // 🔹 INSCRIPTION FORMATION
  async sinscrireFormation(id_utilisateur, id_formation) {
    // Vérifier que l'étudiant existe
    const etudiant = await prisma.etudiant.findUnique({
      where: { id_utilisateur }
    });

    if (!etudiant) {
      throw new Error("Profil étudiant non trouvé");
    }

    // Vérifier que la formation existe et est active
    const formation = await prisma.formation.findUnique({
      where: { 
        id_formation,
        statut: 'ACTIF'
      }
    });

    if (!formation) {
      throw new Error("Formation non trouvée ou inactive");
    }

    // Créer l'inscription
    return prisma.inscription.create({
      data: {
        id_etudiant: etudiant.id_etudiant,
        id_formation,
        statut: 'EN_ATTENTE',
        date_inscription: new Date()
      },
      include: {
        formation: {
          include: {
            ecole: {
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
        }
      }
    });
  },

  // 🔹 PAIEMENT
   async payerEcolage(id_utilisateur, id_inscription, data) {
    try {
      console.log('=== DEBUG PAIEMENT SERVICE ===');
      console.log('Data reçu:', data);
      console.log('montant_total:', data.montant_total);
      console.log('type_paiement:', data.type_paiement);
      
      // Vérifier que l'inscription appartient à l'étudiant
      const inscription = await prisma.inscription.findFirst({
        where: {
          id_inscription: parseInt(id_inscription),
          etudiant: {
            id_utilisateur: parseInt(id_utilisateur)
          }
        },
        include: {
          formation: true
        }
      });

      if (!inscription) {
        throw new Error("Inscription non trouvée");
      }

      // VALIDATION CORRIGÉE - Utilisez montant_total au lieu de montant
      if (!data.montant_total || data.montant_total <= 0) {
        throw new Error("Le montant_total doit être supérieur à 0");
      }

      if (!data.type_paiement) {
        throw new Error("Le type_paiement est obligatoire");
      }

      // Créer le paiement AVEC LES BONS CHAMPS
      return prisma.paiement.create({
        data: {
          id_inscription: parseInt(id_inscription),
          montant_total: parseFloat(data.montant_total), // Correction ici
          type_paiement: data.type_paiement, // Ajout du champ manquant
          statut: 'EN_COURS',
          date_paiement: new Date()
        },
        include: {
          inscription: {
            include: {
              formation: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Erreur service paiement:', error);
      throw new Error(`Erreur lors du paiement: ${error.message}`);
    }
  },
  // 🔹 AVIS
  async laisserAvis(id_utilisateur, id_ecole, data) {
    const etudiant = await prisma.etudiant.findUnique({
      where: { id_utilisateur }
    });

    if (!etudiant) {
      throw new Error("Étudiant non trouvé");
    }

    // Vérifier que l'étudiant est inscrit à au moins une formation de cette école
    const inscriptionValidee = await prisma.inscription.findFirst({
      where: {
        id_etudiant: etudiant.id_etudiant,
        statut: {
        in: ['VALIDEE', 'EN_ATTENTE'] // ← Accepter les deux statuts
      },
        formation: {
          id_ecole
        }
      }
    });

    if (!inscriptionValidee) {
      throw new Error("Vous devez être inscrit à une formation de cette école pour laisser un avis");
    }

    return prisma.avis.create({
      data: {
        id_utilisateur,
        id_ecole,
        commentaire: data.commentaire,
        note: data.note,
        // date_creation: new Date()
      },
      include: {
        utilisateur: {
          select: {
            nom: true,
            prenom: true
          }
        },
        ecole: {
          select: {
            nom: true
          }
        }
      }
    });
  },

   async telechargerCarteEtudiant(id_utilisateur) {
    // Votre code existant pour la carte étudiante
    const etudiant = await prisma.etudiant.findUnique({
      where: { id_utilisateur },
      include: {
        utilisateur: {
          select: {
            nom: true,
            prenom: true,
            email: true
          }
        },
        inscriptions: {
          where: {
            statut:{ in: ['VALIDEE', 'EN_ATTENTE'] }
          },
          include: {
            formation: {
              include: {
                ecole: {
                  include: {
                    utilisateur: {
                      select: {
                        nom: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!etudiant) {
      throw new Error("Étudiant non trouvé");
    }

     // Préparer les données pour la carte
      const carteData = {
        etudiant: {
          id_etudiant: etudiant.id_etudiant,
          nom: etudiant.utilisateur.nom,
          prenom: etudiant.utilisateur.prenom,
          email: etudiant.utilisateur.email,
          date_naissance: etudiant.date_naissance,
          telephone: etudiant.telephone
        },
        formations: etudiant.inscriptions.map(inscription => ({
          formation: inscription.formation.titre,
          ecole: inscription.formation.ecole.utilisateur.nom,
          date_inscription: inscription.date_inscription,
          statut: inscription.statut
        })),
        qr_code: `ETUDIANT_${etudiant.id_etudiant}_${Date.now()}`,
        date_emission: new Date().toISOString()
      };

      // Générer le QR Code avec les données structurées
      const qrCodeImage = await generateCarteEtudiantQR(carteData);

      // Retourner les données COMPLÈTES avec le QR code
      return {
        ...carteData,
        qr_code_image: qrCodeImage, // Image base64 du QR code
        timestamp: Date.now()
      };

   
  },


  // 🔹 NOTIFICATIONS
  async getNotificationsEtudiant(id_utilisateur) {
    const notifications = await prisma.notification.findMany({
      where: { id_utilisateur },
      orderBy: { date_creation: 'desc' },
      take: 20
    });

    return {
      notifications,
      total: notifications.length
    };
  }
};