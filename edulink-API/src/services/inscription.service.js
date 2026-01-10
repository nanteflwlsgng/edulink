import { PrismaClient } from '@prisma/client';
import { generatePDF, generatePDFBuffer } from '../utils/pdf.js'; // ← AJOUT ICI
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();

export class InscriptionService {
  // Valider une inscription
  async validerInscription(id_inscription) {
    try {
      // Vérifier si l'inscription existe
      const inscription = await prisma.inscription.findUnique({
        where: { id_inscription }
      });

      if (!inscription) {
        throw new Error("Inscription non trouvée");
      }

      if (inscription.statut === 'VALIDEE') {
        throw new Error("L'inscription est déjà validée");
      }

      // Valider l'inscription
      return await prisma.inscription.update({
        where: { id_inscription },
        data: {
          statut: 'VALIDEE'
        },
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
              ecole: {
                select: {
                  nom: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Erreur lors de la validation de l'inscription: ${error.message}`);
    }
  }

  // Annuler une inscription
  async annulerInscription(id_inscription) {
    try {
      // Vérifier si l'inscription existe
      const inscription = await prisma.inscription.findUnique({
        where: { id_inscription }
      });

      if (!inscription) {
        throw new Error("Inscription non trouvée");
      }

      if (inscription.statut === 'ANNULEE') {
        throw new Error("L'inscription est déjà annulée");
      }

      // Annuler l'inscription
      return await prisma.inscription.update({
        where: { id_inscription },
        data: {
          statut: 'ANNULEE'
        },
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
              titre: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Erreur lors de l'annulation de l'inscription: ${error.message}`);
    }
  }

  // Consulter le statut d'une inscription
  async consulterStatut(id_inscription) {
    try {
      const inscription = await prisma.inscription.findUnique({
        where: { id_inscription },
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
              ecole: {
                select: {
                  nom: true
                }
              }
            }
          }
        }
      });

      if (!inscription) {
        throw new Error("Inscription non trouvée");
      }

      return inscription;
    } catch (error) {
      throw new Error(`Erreur lors de la consultation du statut: ${error.message}`);
    }
  }

  // Générer un reçu d'inscription (simulation)
  // Méthode pour générer le PDF et retourner les infos (JSON)
async genererRecuInscription(id_inscription) {
  try {
    const inscription = await prisma.inscription.findUnique({
      where: { id_inscription },
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
            prix: true,
            ecole: {
              select: {
                nom: true,
                adresse: true
              }
            }
          }
        }
      }
    });

    if (!inscription) {
      throw new Error("Inscription non trouvée");
    }

    const content = `
      REÇU D'INSCRIPTION
      ==================

      Numéro: RECU-${id_inscription.toString().padStart(6, '0')}
      Date d'émission: ${new Date().toLocaleDateString('fr-FR')}

      ÉTUDIANT
      --------
      Nom: ${inscription.etudiant.utilisateur.nom}
      Prénom: ${inscription.etudiant.utilisateur.prenom}
      Email: ${inscription.etudiant.utilisateur.email}

      FORMATION
      ---------
      Intitulé: ${inscription.formation.titre}
      Prix: ${inscription.formation.prix} €

      ÉCOLE
      -----
      Nom: ${inscription.formation.ecole.nom}
      Adresse: ${inscription.formation.ecole.adresse}

      INSCRIPTION
      -----------
      Numéro: ${inscription.id_inscription}
      Date: ${inscription.date_inscription.toLocaleDateString('fr-FR')}
      Statut: ${inscription.statut}
    `;

    const filename = `recu_inscription_${id_inscription}_${Date.now()}.pdf`;
    const filepath = path.join(process.cwd(), 'uploads', 'recus', filename);

    // Créer le dossier s'il n'existe pas
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Générer le PDF
    generatePDF(filepath, content);

    return {
      success: true,
      message: "Reçu généré avec succès",
      filename: filename,
      filepath: filepath,
      downloadUrl: `/api/inscriptions/${id_inscription}/recu/download/${filename}`
    };
  } catch (error) {
    throw new Error(`Erreur lors de la génération du reçu: ${error.message}`);
  }
}

// NOUVELLE MÉTHODE : Retourne directement le buffer PDF
async genererRecuPDFDirect(id_inscription) {
  try {
    const inscription = await prisma.inscription.findUnique({
      where: { id_inscription },
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
            prix: true,
            ecole: {
              select: {
                nom: true,
                adresse: true
              }
            }
          }
        }
      }
    });

    if (!inscription) {
      throw new Error("Inscription non trouvée");
    }

    const content = `
      REÇU D'INSCRIPTION
      ==================

      Numéro: RECU-${id_inscription.toString().padStart(6, '0')}
      Date d'émission: ${new Date().toLocaleDateString('fr-FR')}

      ÉTUDIANT
      --------
      Nom: ${inscription.etudiant.utilisateur.nom}
      Prénom: ${inscription.etudiant.utilisateur.prenom}
      Email: ${inscription.etudiant.utilisateur.email}

      FORMATION
      ---------
      Intitulé: ${inscription.formation.titre}
      Prix: ${inscription.formation.prix} €

      ÉCOLE
      -----
      Nom: ${inscription.formation.ecole.nom}
      Adresse: ${inscription.formation.ecole.adresse}

      INSCRIPTION
      -----------
      Numéro: ${inscription.id_inscription}
      Date: ${inscription.date_inscription.toLocaleDateString('fr-FR')}
      Statut: ${inscription.statut}
    `;

    const pdfBuffer = await generatePDFBuffer(content);
    return pdfBuffer;
    
  } catch (error) {
    throw new Error(`Erreur lors de la génération du reçu: ${error.message}`);
  }
}
  // Méthode supplémentaire : Créer une inscription
  async creerInscription(id_etudiant, id_formation, statut = 'EN_ATTENTE') {
    try {
      // Vérifier si l'étudiant existe
      const etudiant = await prisma.etudiant.findUnique({
        where: { id_etudiant }
      });

      if (!etudiant) {
        throw new Error("Étudiant non trouvé");
      }

      // Vérifier si la formation existe
      const formation = await prisma.formation.findUnique({
        where: { id_formation }
      });

      if (!formation) {
        throw new Error("Formation non trouvée");
      }

      // Vérifier si l'étudiant est déjà inscrit
      const inscriptionExistante = await prisma.inscription.findFirst({
        where: {
          id_etudiant,
          id_formation
        }
      });

      if (inscriptionExistante) {
        throw new Error("L'étudiant est déjà inscrit à cette formation");
      }

      // Créer l'inscription
      return await prisma.inscription.create({
        data: {
          id_etudiant,
          id_formation,
          statut,
          date_inscription: new Date()
        },
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
              ecole: {
                select: {
                  nom: true
                }
              }
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'inscription: ${error.message}`);
    }
  }
}