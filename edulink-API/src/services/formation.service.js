import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FormationService {
  // ✅ MÉTHODE DE CRÉATION COMPLÈTE
  async creerFormation(id_utilisateur, data, file) {
    // 1. Trouver l'école liée à l'utilisateur
    const ecole = await prisma.ecole.findUnique({
      where: { id_utilisateur }
    });

    if (!ecole) {
      throw new Error("Aucun profil école trouvé pour cet utilisateur.");
    }

    // 2. Gestion de l'image
    let imageUrl = null;
    if (file) {
      // Stockage du chemin relatif pour la BDD
      imageUrl = `uploads/formations/${file.filename}`;
    }

    // 3. Nettoyage des données
    // Le prix peut arriver sous forme "4 500 000", on enlève les espaces
    const prixString = data.price ? String(data.price) : "0";
    const prixClean = parseFloat(prixString.replace(/\s/g, '').replace(',', '.'));
    
    // Pour le quota
    const quotaString = data.quota ? String(data.quota) : "";
    const quotaClean = quotaString ? parseInt(quotaString) : null;

    // Les conditions arrivent en string JSON "['Bac', 'Test']"
    let conditionsClean = [];
    if (data.conditions) {
      try {
        conditionsClean = JSON.parse(data.conditions);
      } catch (e) {
        console.log("Erreur parsing conditions", e);
        conditionsClean = [];
      }
    }

    // 4. Insertion dans Prisma
    // On mappe les noms du Frontend (anglais) vers Prisma (français)
    return await prisma.formation.create({
      data: {
        id_ecole: ecole.id_ecole,
        titre: data.title,
        categorie: data.category,
        niveau: data.level,
        duree: data.duration,
        mode: data.mode,
        langue: data.language,
        ville: data.city || ecole.adresse, // Fallback sur l'adresse de l'école
        description: data.description,
        
        prix: prixClean,
        nbr_max_etudiant: quotaClean, // ✅ C'est ici que le quota s'enregistre
        
        date_debut: data.startDate ? new Date(data.startDate) : null,
        date_fin: data.endDate ? new Date(data.endDate) : null,
        
        image_url: imageUrl,
        conditions: conditionsClean, // Prisma gère le JSON automatiquement
        
        statut: 'ACTIF'
      }
    });
  }
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
  async modifierFormation(id_utilisateur, id_formation, data, file) {
    // 1. Vérifier que la formation appartient bien à l'école de l'utilisateur
    const ecole = await prisma.ecole.findUnique({ where: { id_utilisateur } });
    if (!ecole) throw new Error("École non trouvée");

    const formationExistante = await prisma.formation.findFirst({
      where: { 
        id_formation: id_formation,
        id_ecole: ecole.id_ecole // Sécurité : on ne modifie que ses propres formations
      }
    });

    if (!formationExistante) {
      throw new Error("Formation introuvable ou droits insuffisants.");
    }

    // 2. Préparer les données à mettre à jour
    let updateData = {
        titre: data.title,
        categorie: data.category,
        niveau: data.level,
        duree: data.duration,
        mode: data.mode,
        langue: data.language,
        ville: data.city,
        description: data.description,
        date_modification: new Date()
    };

    // 3. Gestion des champs numériques (si présents)
    if (data.price !== undefined) {
        const prixString = String(data.price);
        updateData.prix = parseFloat(prixString.replace(/\s/g, '').replace(',', '.'));
    }

    if (data.quota !== undefined) {
        const quotaString = String(data.quota);
        updateData.nbr_max_etudiant = quotaString ? parseInt(quotaString) : null;
    }

    // 4. Gestion des dates
    if (data.startDate) updateData.date_debut = new Date(data.startDate);
    if (data.endDate) updateData.date_fin = new Date(data.endDate);

    // 5. Gestion des conditions (JSON)
    if (data.conditions) {
      try {
        updateData.conditions = JSON.parse(data.conditions);
      } catch (e) {
        // Si erreur parsing, on ne change rien ou on met vide
      }
    }

    // 6. Gestion de l'image
    // Si un fichier est uploadé, on met à jour le chemin. Sinon, on ne touche pas.
    if (file) {
      updateData.image_url = `uploads/formations/${file.filename}`;
    }

    // 7. Exécution de la mise à jour
    return await prisma.formation.update({
      where: { id_formation },
      data: updateData
    });
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