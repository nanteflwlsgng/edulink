import prisma from "../config/prismaClient.js";

// 🔹 FONCTIONS DE NOTIFICATION (gardez-les en haut)
const notifierEcoleValidation = async (utilisateur) => {
  try {
    await prisma.notification.create({
      data: {
        type: 'VALIDATION_ECOLE',
        titre: 'Votre compte a été validé ! 🎉',
        message: `Félicitations ! Votre école a été validée par notre équipe. Vous pouvez maintenant accéder à toutes les fonctionnalités.`,
        donnees: {
          id_ecole: utilisateur.ecole.id_ecole,
          date_validation: new Date(),
          statut: 'ACTIF'
        },
        id_utilisateur: utilisateur.id_utilisateur
      }
    });
    
    console.log(`✅ Notification de validation envoyée à l'école: ${utilisateur.ecole.nom}`);
  } catch (error) {
    console.error('Erreur notification validation école:', error);
  }
};

const notifierEcoleRejet = async (utilisateur) => {
  try {
    await prisma.notification.create({
      data: {
        type: 'REJET_ECOLE',
        titre: 'Validation refusée',
        message: `Votre demande de validation a été refusée. Veuillez contacter l'administration pour plus d'informations.`,
        donnees: {
          id_ecole: utilisateur.ecole.id_ecole,
          date_rejet: new Date(),
          statut: 'INACTIF'
        },
        id_utilisateur: utilisateur.id_utilisateur
      }
    });
    
    console.log(`❌ Notification de rejet envoyée à l'école: ${utilisateur.ecole.nom}`);
  } catch (error) {
    console.error('Erreur notification rejet école:', error);
  }
};

export const adminService = {
  // 🔹 GESTION DES ÉCOLES
  
  async validerEcole(id_ecole) {
    // 🔹 CORRECTION : Stocker le résultat d'abord
    const ecoleValidee = await prisma.ecole.update({
      where: { id_ecole },
      data: { 
        date_validation: new Date(),
        utilisateur: {
          update: {
            statut: "ACTIF"
          }
        }
      },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true, // 🔹 AJOUT important pour la notification
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
        }
      }
    });

    // 🔹 CORRECTION : Notifier APRÈS la mise à jour, AVANT le return
    await notifierEcoleValidation({
      id_utilisateur: ecoleValidee.utilisateur.id_utilisateur,
      ecole: {
        id_ecole: ecoleValidee.id_ecole,
        nom: ecoleValidee.nom
      }
    });

    return ecoleValidee;
  },

  async rejeterEcole(id_ecole) {
    // 🔹 CORRECTION : Stocker le résultat d'abord
    const ecoleRejetee = await prisma.ecole.update({
      where: { id_ecole },
      data: { 
        utilisateur: {
          update: {
            statut: "INACTIF"
          }
        }
      },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true, // 🔹 AJOUT important pour la notification
            email: true,
            nom: true,
            prenom: true,
            statut: true
          }
        }
      }
    });

    // 🔹 CORRECTION : Notifier APRÈS la mise à jour, AVANT le return
    await notifierEcoleRejet({
      id_utilisateur: ecoleRejetee.utilisateur.id_utilisateur,
      ecole: {
        id_ecole: ecoleRejetee.id_ecole,
        nom: ecoleRejetee.nom
      }
    });

    return ecoleRejetee;
  },

  // ... le reste de votre code reste identique ...
  async suspendreEcole(id_ecole) {
    return prisma.ecole.update({
      where: { id_ecole },
      data: { 
        utilisateur: {
          update: {
            statut: "SUSPENDU"
          }
        }
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

  async reactiverEcole(id_ecole) {
    return prisma.ecole.update({
      where: { id_ecole },
      data: { 
        utilisateur: {
          update: {
            statut: "ACTIF"
          }
        }
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


  async getEcolesEnAttente(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [ecoles, total] = await Promise.all([
      prisma.ecole.findMany({
        where: { 
          utilisateur: {
            statut: "EN_ATTENTE"
          }
        },
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
          _count: {
            select: {
              formations: true
            }
          }
        },
        orderBy: { id_utilisateur: 'asc' }
      }),
      prisma.ecole.count({ 
        where: { 
          utilisateur: {
            statut: "EN_ATTENTE"
          }
        }
      })
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

  async getEcolesParStatut(statut, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [ecoles, total] = await Promise.all([
      prisma.ecole.findMany({
        where: { 
          utilisateur: {
            statut: statut
          }
        },
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
          _count: {
            select: {
              formations: true,
             
            }
          }
        },
        orderBy: { id_utilisateur: 'desc' }
      }),
      prisma.ecole.count({ 
        where: { 
          utilisateur: {
            statut: statut
          }
        }
      })
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

  // 🔹 GESTION DES UTILISATEURS
  async gererUtilisateurs(page = 1, limit = 10, role = null, statut = null) {
    const skip = (page - 1) * limit;
    const where = {};
    
    if (role) where.role = role;
    if (statut) where.statut = statut;
    
    const [utilisateurs, total] = await Promise.all([
      prisma.utilisateur.findMany({
        where,
        skip,
        take: limit,
        select: {
          id_utilisateur: true,
          email: true,
          nom: true,
          prenom: true,
          role: true,
          statut: true,
          etudiant: {
            select: {
              id_etudiant: true,
              telephone: true,
              date_naissance: true
            }
          },
          ecole: {
            select: {
              id_ecole: true,
              nom: true,
              date_validation: true
            }
          },
          admin: {
            select: {
              id_admin: true
            }
          }
        },
        orderBy: { id_utilisateur: 'desc' }
      }),
      prisma.utilisateur.count({ where })
    ]);

    return {
      utilisateurs,
      pagination: {
        page,
        limit, 
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async suspendreUtilisateur(id_utilisateur) {
    return prisma.utilisateur.update({
      where: { id_utilisateur },
      data: { statut: "SUSPENDU" }
    });
  },

  async reactiverUtilisateur(id_utilisateur) {
    return prisma.utilisateur.update({
      where: { id_utilisateur },
      data: { statut: "ACTIF" }
    });
  },

  // 🔹 STATISTIQUES
  async voirStatistiquesGlobales() {
    const [
      totalEcoles,
      totalEtudiants,
      totalFormations,
      totalPaiements,
      ecolesParStatut,
      utilisateursParRole,
      utilisateursParStatut,
      paiementsParStatut
    ] = await Promise.all([
      prisma.ecole.count(),
      prisma.etudiant.count(),
      prisma.formation.count(),
      prisma.paiement.count(),
      prisma.utilisateur.groupBy({
        by: ['statut'],
        where: { role: "ECOLE" },
        _count: { id_utilisateur: true }
      }),
      prisma.utilisateur.groupBy({
        by: ['role'],
        _count: { id_utilisateur: true }
      }),
      prisma.utilisateur.groupBy({
        by: ['statut'],
        _count: { id_utilisateur: true }
      }),
      prisma.paiement.groupBy({
        by: ['statut'],
        _count: { id_paiement: true },
        _sum: { montant_total: true }
      })
    ]);

    return {
      totals: {
        ecoles: totalEcoles,
        etudiants: totalEtudiants,
        formations: totalFormations,
        paiements: totalPaiements
      },
      repartition: {
        ecolesParStatut,
        utilisateursParRole,
        utilisateursParStatut,
        paiementsParStatut
      }
    };
  },

  // 🔹 SUPERVISION PAIEMENTS
  async superviserPaiements(page = 1, limit = 10, statut = null) {
    const skip = (page - 1) * limit;
    const where = statut ? { statut } : {};
    
    const [paiements, total] = await Promise.all([
      prisma.paiement.findMany({
        where,
        skip,
        take: limit,
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
          },
          tranches: {
            orderBy: { date_echeance: 'asc' }
          }
        },
        orderBy: { date_paiement: 'desc' }
      }),
      prisma.paiement.count({ where })
    ]);

    return {
      paiements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },
  async getNotificationsAdmin(id_utilisateur, { page = 1, limit = 20, lue = null } = {}) {
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
},
async supprimerEcole(id_ecole) {
  try {
    // D'abord, vérifiez si l'école existe
    const ecole = await prisma.ecole.findUnique({
      where: { id_ecole },
      include: {
        formations: {
          include: {
            inscriptions: true,
            sessions: true
          }
        }
      }
    });

    if (!ecole) {
      throw new Error("École non trouvée");
    }

    // Si l'école a des formations, vous pouvez choisir de :
    // 1. Supprimer en cascade (si vos relations sont bien configurées)
    // 2. Empêcher la suppression si des formations existent
    
    if (ecole.formations.length > 0) {
      throw new Error("Impossible de supprimer une école avec des formations actives");
    }

    return prisma.ecole.delete({
      where: { id_ecole }
    });
  } catch (error) {
    console.error('Erreur suppression école:', error);
    throw error;
  }
},
};