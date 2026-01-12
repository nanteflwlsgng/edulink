import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class FormationService {
 async listerFormations() {
  try {
    return await prisma.formation.findMany({
      where: { statut: 'ACTIF' },
      orderBy: { date_creation: 'desc' },
      include: {
        // ✅ AJOUT INDISPENSABLE POUR QUE L'ÉDITION FONCTIONNE
        sessions: true, 
        
        ecole: {
          select: {
            nom: true,
            // adresse: true // Si besoin
          }
        }
      }
    });
  } catch (error) {
    throw new Error(`Erreur lors de la récupération: ${error.message}`);
  }
}

 // src/services/formation.service.js

async creerFormation(id_utilisateur, data, file) {
    // 1. Trouver l'école
    const ecole = await prisma.ecole.findUnique({
      where: { id_utilisateur }
    });

    if (!ecole) throw new Error("École non trouvée");

    // 2. Image
    let imageUrl = null;
    if (file) imageUrl = `uploads/formations/${file.filename}`;

    // 3. Nettoyage Prix et Quota
    const prixClean = data.price 
        ? parseFloat(String(data.price).replace(/\s/g, '').replace(',', '.')) 
        : 0;
    const quotaClean = data.quota ? parseInt(data.quota) : null;

    // 4. Conditions (Tableau ou JSON)
    let conditionsClean = [];
    if (Array.isArray(data.conditions)) {
        conditionsClean = data.conditions;
    } else if (typeof data.conditions === 'string') {
        try { conditionsClean = JSON.parse(data.conditions); } 
        catch (e) { conditionsClean = [data.conditions]; }
    }

    // --- MAPPING DES ENUMS ---

    // A. Catégorie
    const categoriePrisma = data.category ? data.category.toUpperCase() : "AUTRE";

    // B. Niveau
    const niveauMap = {
        'Licence': 'LICENCE',
        'Master': 'MASTER',
        'Doctorat': 'DOCTORAT',
        'BTS': 'BTS',
        'DTS': 'DTS',
        'Bacc': 'BACCALAUREAT'
    };
    const niveauPrisma = niveauMap[data.level] || 'AUTRE'; // Valeur par défaut si non trouvé

    // C. Durée
    const dureeMap = {
        '1 an': 'ANS_1',
        '2 ans': 'ANS_2',
        '3 ans': 'ANS_3',
        '4 ans': 'ANS_4',
        '5 ans': 'ANS_5',
        '6 mois': 'MOIS_6'
    };
    const dureePrisma = dureeMap[data.duration] || 'ANS_3'; 

    // D. Mode
    const modePrisma = (data.mode === 'En ligne') ? 'EN_LIGNE' : 'PRESENTIEL';

    // 5. Création Prisma avec Session
    return await prisma.formation.create({
      data: {
        id_ecole: ecole.id_ecole,
        titre: data.title,
        
        // Champs mappés
        categorie: categoriePrisma,
        niveau: niveauPrisma,
        duree: dureePrisma,
        mode: modePrisma,
        
        langue: data.language,
        ville: data.city || ecole.adresse,
        description: data.description,
        prix: prixClean,
        nbr_max_etudiant: quotaClean,
        image_url: imageUrl,
        conditions: conditionsClean,
        statut: 'ACTIF',

        // Création de la session imbriquée
        sessions: {
            create: {
                date_debut: new Date(data.startDate),
                date_fin: new Date(data.endDate),
                statut: 'OUVERTE'
            }
        }
      },
      include: { sessions: true }
    });
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
    // 1. SÉCURITÉ : Vérifier que la formation appartient bien à l'école connectée
    // On cherche par ID formation ET ID utilisateur (propriétaire)
    const formationExistante = await prisma.formation.findFirst({
        where: { 
            id_formation: parseInt(id_formation),
            ecole: { id_utilisateur: id_utilisateur } 
        }
    });

    if (!formationExistante) {
        throw new Error("Formation introuvable ou vous n'avez pas les droits pour la modifier.");
    }

    // 2. PRÉPARATION DES DONNÉES (Exactement comme dans creerFormation)
    
    // Nettoyage Prix et Quota
    const prixClean = data.price 
        ? parseFloat(String(data.price).replace(/\s/g, '').replace(',', '.')) 
        : undefined; // undefined = on ne touche pas si pas envoyé
        
    const quotaClean = data.quota ? parseInt(data.quota) : undefined;

    // Conditions
    let conditionsClean = undefined;
    if (data.conditions) {
        try {
            conditionsClean = typeof data.conditions === 'string' ? JSON.parse(data.conditions) : data.conditions;
        } catch (e) { conditionsClean = [data.conditions]; }
    }

    // --- MAPPING DES ENUMS (Indispensable pour éviter les erreurs Prisma) ---
    
    let updateData = {
        titre: data.title,
        description: data.description,
        langue: data.language,
        ville: data.city,
        prix: prixClean,
        nbr_max_etudiant: quotaClean,
        conditions: conditionsClean,
        date_modification: new Date() // On met à jour la date de modif
    };

    // Mapping Catégorie
    if (data.category) updateData.categorie = data.category.toUpperCase();

    // Mapping Niveau
    if (data.level) {
        const niveauMap = { 'Licence': 'LICENCE', 'Master': 'MASTER', 'Doctorat': 'DOCTORAT', 'BTS': 'BTS', 'DTS': 'DTS', 'Bacc': 'BACCALAUREAT' };
        updateData.niveau = niveauMap[data.level] || data.level.toUpperCase();
    }

    // Mapping Durée
    if (data.duration) {
        const dureeMap = { '1 an': 'ANS_1', '2 ans': 'ANS_2', '3 ans': 'ANS_3', '4 ans': 'ANS_4', '5 ans': 'ANS_5', '6 mois': 'MOIS_6' };
        updateData.duree = dureeMap[data.duration] || 'ANS_3';
    }

    // Mapping Mode
    if (data.mode) {
        updateData.mode = (data.mode === 'En ligne') ? 'EN_LIGNE' : 'PRESENTIEL';
    }

    // Gestion de l'Image (si un nouveau fichier est envoyé)
    if (file) {
        updateData.image_url = `uploads/formations/${file.filename}`;
    }

    // 3. UPDATE PRISMA
    return await prisma.formation.update({
        where: { id_formation: parseInt(id_formation) },
        data: {
            ...updateData,
            
            // 4. MISE À JOUR DES DATES (SESSION)
            // On met à jour toutes les sessions liées à cette formation
            // (Ou tu peux affiner si tu veux modifier une session précise, mais ici on update tout pour rester simple)
            sessions: {
                updateMany: {
                    where: { id_formation: parseInt(id_formation) },
                    data: {
                        date_debut: new Date(data.startDate),
                        date_fin: new Date(data.endDate)
                    }
                }
            }
        },
        include: {
            sessions: true // Pour renvoyer les dates mises à jour
        }
    });
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
  // Supprimer une formation
// --- SUPPRESSION NETTE ET SANS BAVURE ---


  async supprimerFormation(id_utilisateur, id_formation) {
    const idParse = parseInt(id_formation);

    // 1. Vérifier que c'est bien TA formation
    const formation = await prisma.formation.findFirst({
        where: { 
            id_formation: idParse,
            ecole: { id_utilisateur: id_utilisateur }
        }
    });

    if (!formation) throw new Error("Formation introuvable ou accès refusé");

    // 2. SÉCURITÉ : Vérifier s'il y a de VRAIS étudiants inscrits
    const inscriptionsActives = await prisma.inscription.count({
        where: {
            id_formation: idParse,
            statut: { in: ['VALIDEE', 'EN_ATTENTE', 'INSCRIT'] } // Ajoute les statuts pertinents
        }
    });

    if (inscriptionsActives > 0) {
        throw new Error("Impossible de supprimer : des étudiants sont inscrits à cette formation.");
    }

    // 3. NETTOYAGE EN CASCADE (Transaction)
    // On doit supprimer tout ce qui est lié à la formation avant de la supprimer elle-même
    // Sinon SQL renvoie une erreur "Foreign Key Constraint"
    
    await prisma.$transaction([
        // A. Supprimer les sessions
        prisma.session.deleteMany({
            where: { id_formation: idParse }
        }),
        // B. Supprimer les favoris (si tu as cette table)
        prisma.favoris.deleteMany({
            where: { id_formation: idParse }
        }),
        // C. Supprimer les évaluations (si tu as cette table)
        prisma.evaluation.deleteMany({
            where: { id_formation: idParse }
        }),
        // D. Supprimer les inscriptions annulées/refusées (nettoyage final)
        prisma.inscription.deleteMany({
            where: { id_formation: idParse }
        }),
        // E. ENFIN : Supprimer la formation
        prisma.formation.delete({
            where: { id_formation: idParse }
        })
    ]);

    return { message: "Formation et données associées supprimées avec succès" };
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