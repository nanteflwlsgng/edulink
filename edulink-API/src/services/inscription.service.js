import { PrismaClient } from '@prisma/client';
import { generatePDF, generatePDFBuffer } from '../utils/pdf.js'; // ← AJOUT ICI
import fs from 'fs';
import path from 'path';
const prisma = new PrismaClient();

export class InscriptionService {
  // Valider une inscription
  /**
   * Crée une candidature : Met à jour le profil étudiant et crée l'inscription
   * @param {Object} data - Contient les infos texte et les chemins des fichiers
   */
  async creerCandidature(data) {
    const { 
      id_utilisateur, id_formation, 
      telephone, date_naissance, sexe, dernier_diplome, ecole_origine, motivation,
      cvPath, lettrePath, notesPath, idCardPath 
    } = data;

    // Utilisation d'une transaction pour garantir l'intégrité des données
    return await prisma.$transaction(async (tx) => {
      
      // 1. Gestion du profil Étudiant (Création ou Mise à jour)
      let etudiant = await tx.etudiant.findUnique({
        where: { id_utilisateur: parseInt(id_utilisateur) }
      });

      const etudiantData = {
        telephone,
        date_naissance: date_naissance ? new Date(date_naissance) : null,
        sexe,
        dernier_diplome,
        ecole_origine
        // Note: nom/prenom/email sont dans la table Utilisateur, on ne les touche pas ici
      };

      if (!etudiant) {
        // Création si n'existe pas
        etudiant = await tx.etudiant.create({
          data: {
            id_utilisateur: parseInt(id_utilisateur),
            ...etudiantData
          }
        });
      } else {
        // Mise à jour si existe
        etudiant = await tx.etudiant.update({
          where: { id_etudiant: etudiant.id_etudiant },
          data: etudiantData
        });
      }

      // 2. Vérification doublon inscription
      const existingInscription = await tx.inscription.findUnique({
        where: {
          id_etudiant_id_formation: {
            id_etudiant: etudiant.id_etudiant,
            id_formation: parseInt(id_formation)
          }
        }
      });

      if (existingInscription) {
        throw new Error("Vous avez déjà postulé à cette formation.");
      }

      // 3. Création de l'inscription
      const nouvelleInscription = await tx.inscription.create({
        data: {
          id_etudiant: etudiant.id_etudiant,
          id_formation: parseInt(id_formation),
          motivation: motivation,
          statut: "EN_ATTENTE",
          // Stockage des chemins de fichiers
          url_cv: cvPath,
          url_lettre: lettrePath,
          url_releve_notes: notesPath,
          url_piece_identite: idCardPath
        }
      });

      return nouvelleInscription;
    });
  }

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
  // Récupérer la liste des candidatures pour un utilisateur donné
  async getCandidaturesByUtilisateur(id_utilisateur) {
    try {
      return await prisma.inscription.findMany({
        where: {
          // Ici, on fait le lien : Inscription -> Etudiant -> Utilisateur
          // On cherche les inscriptions où l'étudiant associé a cet id_utilisateur
          etudiant: {
            id_utilisateur: parseInt(id_utilisateur)
          }
        },
        // On inclut les infos utiles pour l'affichage (Titre formation, Nom école)
        include: {
          formation: {
            select: {
              titre: true,
              description: true, // Si besoin
              ecole: {
                select: {
                  nom: true
                }
              }
            }
          },
          // Optionnel : Si vous voulez aussi renvoyer les infos de l'étudiant
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
        },
        // Pour afficher les plus récentes en premier
        orderBy: {
          date_inscription: 'desc'
        }
      });
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des candidatures: ${error.message}`);
    }
  }
}