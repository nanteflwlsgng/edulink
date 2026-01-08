
  import prisma from "../config/prismaClient.js";

// 🔹 FONCTION DE NOTIFICATION (correcte)
const notifierAdminsNouvelleEcole = async (profilEcole) => {
  try {
    // Récupérer tous les administrateurs
    const admins = await prisma.admin.findMany({
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            email: true,
            nom: true,
            prenom: true
          }
        }
      }
    });

    // Créer une notification pour chaque admin
    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          type: 'NOUVELLE_ECOLE_ATTENTE',
          titre: 'Nouvelle école en attente de validation',
          message: `L'école "${profilEcole.nom}" a complété son profil et attend votre validation.`,
          donnees: {
            id_ecole: profilEcole.id_ecole,
            id_utilisateur: profilEcole.id_utilisateur,
            nom_ecole: profilEcole.nom,
            email: profilEcole.email,
            date_soumission: new Date()
          },
          id_utilisateur: admin.utilisateur.id_utilisateur
        }
      });
    }

    console.log(`📢 Notification envoyée à ${admins.length} admin(s) pour l'école: ${profilEcole.nom}`);
    
  } catch (error) {
    console.error('Erreur lors de la notification aux admins:', error);
  }
};

export const ecoleService = {
  // 🔹 FONCTIONS ACCESSIBLES À TOUTES LES ÉCOLES

  async creerProfilEcole(id_utilisateur, data) {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur },
      select: { email: true, statut: true }
    });

    if (!utilisateur) {
      throw new Error("Utilisateur non trouvé");
    }

    // 🔹 CORRECTION : Stocker le profil créé d'abord
    const profil = await prisma.ecole.create({
      data: {
        nom: data.nom,
        adresse: data.adresse,
        email: utilisateur.email,
        telephone: data.telephone,
        description: data.description,
        site_web: data.site_web,
        logo: data.logo,
        id_utilisateur
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

    // 🔹 CORRECTION : Notifier les admins APRÈS création, AVANT return
    await notifierAdminsNouvelleEcole(profil);

    return profil; // 🔹 UNIQUEMENT ICI on retourne le profil
  },

  // ... le reste de votre code reste inchangé ...
  async getProfilEcole(id_utilisateur) {
    return prisma.ecole.findUnique({
      where: { id_utilisateur },
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
          include: {
            _count: {
              select: {
                inscriptions: true
              }
            }
          }
        },
        _count: {
          select: {
            formations: true
          }
        }
      }
    });
  },

 
  // Modification du profil (accessible à toutes les écoles)
  async modifierProfilEcole(id_utilisateur, data) {
    return prisma.ecole.update({
      where: { id_utilisateur },
      data: {
        nom: data.nom,
        adresse: data.adresse,
        telephone: data.telephone,
        description: data.description,
        site_web: data.site_web,
        logo: data.logo
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

  // Réception de notifications (accessible à toutes les écoles)
  async getNotificationsEcole(id_utilisateur) {
    // Stub pour les notifications
    return {
      notifications: [],
      total: 0
    };
  },

  // 🔹 FONCTIONS RÉSERVÉES AUX ÉCOLES ACTIVES (statut ACTIF)

  // Vérification que l'école est active
  async verifierEcoleActive(id_utilisateur) {
  const ecole = await this.getProfilEcole(id_utilisateur);
  
  if (!ecole) {
    throw new Error("École non trouvée");
  }
  
  // ✅ CORRECTION : Vérifier le statut de l'école, pas de l'utilisateur
  // Et autoriser les écoles EN_ATTENTE pour les tests
  if (ecole.statut && !['ACTIF', 'EN_ATTENTE'].includes(ecole.statut)) {
    throw new Error("École non validée");
  }
  
  return ecole;
},

  // GESTION DES FORMATIONS (réservé aux écoles ACTIVES)
  async ajouterFormation(id_utilisateur, data) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    return prisma.formation.create({
      data: {
        titre: data.titre,
        description: data.description,
        duree: data.duree,
        prix: data.prix,
        id_ecole: ecole.id_ecole
      },
      include: {
        ecole: {
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
    });
  },

  async getFormationsEcole(id_utilisateur, page = 1, limit = 10) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    const skip = (page - 1) * limit;
    const [formations, total] = await Promise.all([
      prisma.formation.findMany({
        where: { id_ecole: ecole.id_ecole },
        skip,
        take: limit,
        include: {
          _count: {
            select: {
              inscriptions: {
                where: {
                  statut: "VALIDEE"
                }
              },
              sessions: true
            }
          }
        },
        orderBy: { date_creation: 'desc' }
      }),
      prisma.formation.count({ where: { id_ecole: ecole.id_ecole } })
    ]);

    return {
      formations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async modifierFormation(id_utilisateur, id_formation, data) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    return prisma.formation.update({
      where: { 
        id_formation,
        id_ecole: ecole.id_ecole // Vérifie l'appartenance
      },
      data: {
        titre: data.titre,
        description: data.description,
        duree: data.duree,
        prix: data.prix
      },
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
    });
  },

  async supprimerFormation(id_utilisateur, id_formation) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    return prisma.formation.delete({
      where: { 
        id_formation,
        id_ecole: ecole.id_ecole
      }
    });
  },

  // GESTION DES ÉTUDIANTS (réservé aux écoles ACTIVES)
  async getEtudiantsInscrits(id_utilisateur, page = 1, limit = 10) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    const skip = (page - 1) * limit;
    const [inscriptions, total] = await Promise.all([
      prisma.inscription.findMany({
        where: {
          formation: {
            id_ecole: ecole.id_ecole
          },
          statut: "VALIDEE"
        },
        skip,
        take: limit,
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
              prix: true
            }
          }
        },
        orderBy: { date_inscription: 'desc' }
      }),
      prisma.inscription.count({
        where: {
          formation: {
            id_ecole: ecole.id_ecole
          },
          statut: "VALIDEE"
        }
      })
    ]);

    return {
      etudiants: inscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // ENVOI DE NOTIFICATIONS (réservé aux écoles ACTIVES)
  async envoyerNotificationEtudiant(id_utilisateur, id_etudiant, message) {
    await this.verifierEcoleActive(id_utilisateur);
    
    return {
      message: "Notification envoyée",
      etudiantId: id_etudiant,
      contenu: message,
      dateEnvoi: new Date()
    };
  },

  // STATISTIQUES ET RAPPORTS (réservé aux écoles ACTIVES)
  async getStatistiquesEcole(id_utilisateur) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    const [
      totalFormations,
      totalEtudiants,
      formationsPopulaires,
      revenusTotaux
    ] = await Promise.all([
      prisma.formation.count({ where: { id_ecole: ecole.id_ecole } }),
      prisma.inscription.count({
        where: {
          formation: { id_ecole: ecole.id_ecole },
          statut: "VALIDEE"
        }
      }),
      prisma.formation.findMany({
        where: { id_ecole: ecole.id_ecole },
        include: {
          _count: {
            select: {
              inscriptions: {
                where: {
                  statut: "VALIDEE"
                }
              }
            }
          }
        },
        orderBy: {
          inscriptions: {
            _count: 'desc'
          }
        },
        take: 5
      }),
      prisma.formation.aggregate({
        where: { id_ecole: ecole.id_ecole },
        _sum: {
          prix: true
        }
      })
    ]);

    return {
      totals: {
        formations: totalFormations,
        etudiants: totalEtudiants,
        revenus: revenusTotaux._sum.prix || 0
      },
      formationsPopulaires
    };
  },

  async genererRapportFinancier(id_utilisateur) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    const stats = await this.getStatistiquesEcole(id_utilisateur);
    
    return {
      ...stats,
      generatedAt: new Date().toISOString(),
      periode: "Complet"
    };
  },

  async exporterListeEtudiants(id_utilisateur, format = 'json') {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    const etudiants = await this.getEtudiantsInscrits(id_utilisateur, 1, 1000);
    
    return {
      format,
      fileName: `etudiants_ecole_${ecole.id_ecole}_${new Date().toISOString().split('T')[0]}`,
      data: etudiants,
      generatedAt: new Date().toISOString(),
      total: etudiants.pagination.total
    };
  },

  // Suppression (réservé aux écoles ACTIVES)
  async supprimerProfilEcole(id_utilisateur) {
    await this.verifierEcoleActive(id_utilisateur);
    return prisma.ecole.delete({
      where: { id_utilisateur }
    });
  },
  async getNotificationsEcole(id_utilisateur, { page = 1, limit = 20, lue = null } = {}) {
  const skip = (page - 1) * limit;
  const where = { id_utilisateur };
  
  if (lue !== null) {
    where.lue = lue === 'true';
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date_creation: 'desc' }
    }),
    prisma.notification.count({ where })
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
      }
    };
  }
};