import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FormationService {
  async listerFormations() {
    try {
      return await prisma.formation.findMany({
        where: {
          statut: 'ACTIF' // On ne récupère que les formations actives
        },
        orderBy: {
          date_creation: 'desc' // Les plus récentes en premier
        },
        include: {
          ecole: {
            select: {
              nom: true,
              // Ajoute ici ville et pays si ton modèle Ecole les possède
              // ville: true, 
              // pays: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des formations: ${error.message}`);
    }
  }
  async getFormationById(idFormation) {
    try {
      // Conversion sécurisée en entier
      const id = parseInt(idFormation, 10);

      if (isNaN(id)) {
        throw new Error("L'ID de la formation doit être un nombre valide.");
      }

      const formation = await prisma.formation.findUnique({
        where: {
          id_formation: id
        },
        include: {
          // On récupère toutes les infos de l'école (nécessaire pour le front: image, email, etc.)
          ecole: true, 
          
          // On récupère les sessions pour avoir la date de rentrée
          sessions: {
            orderBy: {
              date_debut: 'asc' // La plus proche en premier
            }
          },
          
          // Optionnel: pour calculer la moyenne si besoin
          evaluations: true 
        }
      });

      return formation;
    } catch (error) {
      throw new Error(`Erreur service lors de la récupération de la formation: ${error.message}`);
    }
  }
  // Créer une nouvelle session pour une formation
  async ajouterSession(id_formation, data) {
    try {
      // Vérifier si la formation existe
      const formation = await prisma.formation.findUnique({
        where: { id_formation }
      });

      if (!formation) {
        throw new Error("Formation non trouvée");
      }

      return await prisma.session.create({
        data: {
          ...data,
          id_formation
        },
        include: {
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
      throw new Error(`Erreur lors de l'ajout de la session: ${error.message}`);
    }
  }

  // Modifier une formation
  async modifierFormation(id_formation, data) {
    try {
      // Vérifier si la formation existe
      const formationExistante = await prisma.formation.findUnique({
        where: { id_formation }
      });

      if (!formationExistante) {
        throw new Error("Formation non trouvée");
      }

      return await prisma.formation.update({
        where: { id_formation },
        data: {
          ...data,
          date_modification: new Date()
        },
        include: {
          ecole: {
            select: {
              nom: true
            }
          }
        }
      });
    } catch (error) {
      throw new Error(`Erreur lors de la modification de la formation: ${error.message}`);
    }
  }

  // Supprimer une formation
  async supprimerFormation(id_formation) {
    try {
      // Vérifier si la formation existe
      const formation = await prisma.formation.findUnique({
        where: { id_formation }
      });

      if (!formation) {
        throw new Error("Formation non trouvée");
      }

      // Vérifier s'il y a des inscriptions actives
      const inscriptionsActives = await prisma.inscription.count({
        where: {
          id_formation,
          statut: {
            in: ['VALIDEE', 'EN_ATTENTE']
          }
        }
      });

      if (inscriptionsActives > 0) {
        throw new Error("Impossible de supprimer une formation avec des inscriptions actives");
      }

      await prisma.formation.delete({
        where: { id_formation }
      });

      return { message: "Formation supprimée avec succès" };
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la formation: ${error.message}`);
    }
  }

  // Consulter les étudiants inscrits à une formation
  async consulterEtudiantsInscrits(id_formation) {
    try {
      // Vérifier si la formation existe
      const formation = await prisma.formation.findUnique({
        where: { id_formation }
      });

      if (!formation) {
        throw new Error("Formation non trouvée");
      }

      const inscriptions = await prisma.inscription.findMany({
        where: { 
          id_formation,
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
          }
        },
        orderBy: {
          etudiant: {
            utilisateur: {
              nom: 'asc'
            }
          }
        }
      });

      return {
        formation: {
          id_formation: formation.id_formation,
          titre: formation.titre
        },
        etudiants: inscriptions.map(inscription => ({
          id_etudiant: inscription.etudiant.id_etudiant,
          nom: inscription.etudiant.utilisateur.nom,
          prenom: inscription.etudiant.utilisateur.prenom,
          email: inscription.etudiant.utilisateur.email,
          date_inscription: inscription.date_inscription
        }))
      };
    } catch (error) {
      throw new Error(`Erreur lors de la consultation des étudiants: ${error.message}`);
    }
  }

  // Évaluer un étudiant
  async evaluerEtudiant(id_formation, id_etudiant, data) {
    try {
      // Vérifier si l'étudiant est inscrit à la formation
      const inscription = await prisma.inscription.findFirst({
        where: {
          id_formation,
          id_etudiant,
          statut: 'VALIDEE'
        }
      });

      if (!inscription) {
        throw new Error("L'étudiant n'est pas inscrit à cette formation");
      }

      return await prisma.evaluation.create({
        data: {
          id_formation,
          id_etudiant,
          note: data.note,
          commentaire: data.commentaire,
          date_evaluation: new Date()
        },
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
      });
    } catch (error) {
      throw new Error(`Erreur lors de l'évaluation de l'étudiant: ${error.message}`);
    }
  }

  // Voir les statistiques d'inscription
  async voirStatistiquesInscription(id_formation) {
    try {
      // Vérifier si la formation existe
      const formation = await prisma.formation.findUnique({
        where: { id_formation },
        include: {
          ecole: {
            select: {
              nom: true
            }
          }
        }
      });

      if (!formation) {
        throw new Error("Formation non trouvée");
      }

      const inscriptions = await prisma.inscription.groupBy({
        by: ['statut'],
        where: { id_formation },
        _count: {
          id_inscription: true
        }
      });

      const totalInscriptions = await prisma.inscription.count({
        where: { id_formation }
      });

      const evaluations = await prisma.evaluation.aggregate({
        where: { id_formation },
        _avg: {
          note: true
        },
        _count: {
          id_evaluation: true
        }
      });

      return {
        formation: {
          id_formation: formation.id_formation,
          titre: formation.titre,
          ecole: formation.ecole.nom
        },
        statistiques: {
          total_inscriptions: totalInscriptions,
          repartition_par_statut: inscriptions,
          moyenne_notes: evaluations._avg.note || 0,
          nombre_evaluations: evaluations._count.id_evaluation
        }
      };
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
    }
  }
}