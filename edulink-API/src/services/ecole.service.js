import prisma from "../config/prismaClient.js";

export const ecoleService = {
  
  // 🔹 CREATION DE PROFIL (Modifié pour Activation Immédiate)
  async creerProfilEcole(id_utilisateur, data) {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur },
      select: { email: true }
    });

    if (!utilisateur) {
      throw new Error("Utilisateur non trouvé");
    }

    // 1. Création du profil École
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

    // 2. 🔥 ACTIVATION IMMÉDIATE DU COMPTE
    // On force le statut à ACTIF, peu importe ce qui a été défini à l'inscription
    await prisma.utilisateur.update({
      where: { id_utilisateur },
      data: { statut: 'ACTIF' }
    });

    // Plus de notification aux admins ici

    return profil;
  },

  // 🔹 LECTURE DU PROFIL
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

  // 🔹 MODIFICATION DU PROFIL
  async modifierProfilEcole(id_utilisateur, data, logoFile, directeurFile, etablissementFile) {
    
    const updateData = {
      nom_etablissement: data.nom_etablissement,
      adresse: data.adresse,
      telephone: data.telephone,
      description: data.description,
      site_web: data.site_web,
      devis: data.devis,
      nom_directeur: data.nom_directeur,
    };

    if (data.date_fondation) updateData.date_fondation = new Date(data.date_fondation);
    if (logoFile) updateData.logo = `uploads/ecoles/${logoFile.filename}`;
    if (directeurFile) updateData.photo_directeur = `uploads/ecoles/${directeurFile.filename}`;

    // ✅ GESTION DE LA PHOTO ETABLISSEMENT
    if (etablissementFile) {
      updateData.photo_etablissement = `uploads/ecoles/${etablissementFile.filename}`;
    }

    return prisma.ecole.update({
      where: { id_utilisateur },
      data: updateData
    });
  },

  // 🔹 NOTIFICATIONS
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
        page, limit, total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // 🔹 VÉRIFICATION ACTIVITÉ
  async verifierEcoleActive(id_utilisateur) {
    const ecole = await prisma.ecole.findUnique({ where: { id_utilisateur } });
    
    if (!ecole) throw new Error("École non trouvée");

    // On récupère aussi le statut de l'utilisateur pour être sûr
    const utilisateur = await prisma.utilisateur.findUnique({
        where: { id_utilisateur },
        select: { statut: true }
    });

    // Si le statut est SUSPENDU ou INACTIF, on bloque.
    // Mais on laisse passer tout le reste car on valide automatiquement maintenant.
    if (utilisateur.statut === 'SUSPENDU' || utilisateur.statut === 'INACTIF') {
      throw new Error("Votre compte école n'est pas actif.");
    }
    if (ecole) {
      // Petit trick pour le frontend : on renvoie "nom" pour que le formulaire se remplisse facilement
      ecole.nom_etablissement = ecole.nom_etablissement;
  }    
    return ecole;
  },

  // 🔹 STATISTIQUES DASHBOARD
  async getStatistiquesEcole(id_utilisateur) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    const [
      inscritsDefinitifs,
      dossiersEnAttente,
      paiementsEnAttente,
      revenuTotal
    ] = await Promise.all([
      // Total Inscrits
      prisma.inscription.count({
        where: { formation: { id_ecole: ecole.id_ecole }, statut: "VALIDEE" }
      }),
      // Dossiers en attente
      prisma.inscription.count({
        where: { formation: { id_ecole: ecole.id_ecole }, statut: "EN_ATTENTE" }
      }),
      // Paiements en attente
      prisma.paiement.count({
        where: { 
          inscription: { formation: { id_ecole: ecole.id_ecole } },
          statut: "EN_ATTENTE" 
        }
      }),
      // Revenu total
      prisma.paiement.aggregate({
        where: { 
          inscription: { formation: { id_ecole: ecole.id_ecole } },
          statut: "PAYE"
        },
        _sum: { montant_total: true }
      })
    ]);

    // Graphique : Formations populaires
    const formationsPopulaires = await prisma.formation.findMany({
      where: { id_ecole: ecole.id_ecole },
      include: { _count: { select: { inscriptions: true } } },
      orderBy: { inscriptions: { _count: 'desc' } },
      take: 5
    });

    return {
      stats: {
        totalStudents: inscritsDefinitifs,
        pendingReview: dossiersEnAttente,
        pendingMoney: paiementsEnAttente,
        revenue: revenuTotal._sum.montant_total || 0
      },
      graphData: formationsPopulaires
    };
  },

  // 🔹 CANDIDATURES
  async getCandidatures(id_utilisateur, status = "TOUS") {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    const whereCondition = {
      formation: { id_ecole: ecole.id_ecole }
    };

    if (status !== "TOUS") {
        if(status === 'Admis') whereCondition.statut = 'VALIDEE';
        else if(status === 'Refusé') whereCondition.statut = 'ANNULEE';
        else whereCondition.statut = 'EN_ATTENTE';
    }

    const candidatures = await prisma.inscription.findMany({
      where: whereCondition,
      include: {
        etudiant: {
          include: {
            utilisateur: { select: { nom: true, prenom: true, email: true, telephone: true } }
          }
        },
        formation: { select: { titre: true, prix: true } }
      },
      orderBy: { date_inscription: 'desc' }
    });

    return candidatures.map(c => ({
      id: c.id_inscription,
      name: `${c.etudiant.utilisateur.prenom} ${c.etudiant.utilisateur.nom}`,
      formation: c.formation.titre,
      date: c.date_inscription,
      status: c.statut === 'VALIDEE' ? 'Admis' : c.statut === 'ANNULEE' ? 'Refusé' : 'En attente',
      email: c.etudiant.utilisateur.email,
      image: "https://i.pravatar.cc/150?u=" + c.id_inscription
    }));
  },

  async traiterCandidature(id_utilisateur, id_inscription, decision) {
    await this.verifierEcoleActive(id_utilisateur);
    return prisma.inscription.update({
      where: { id_inscription },
      data: { statut: decision }
    });
  },

  // 🔹 FINANCES
  async getPaiementsEcole(id_utilisateur) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);

    const paiements = await prisma.paiement.findMany({
      where: {
        inscription: { formation: { id_ecole: ecole.id_ecole } }
      },
      include: {
        inscription: {
          include: {
            etudiant: { include: { utilisateur: { select: { nom: true, prenom: true } } } },
            formation: { select: { titre: true } }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return paiements.map(p => ({
      id: p.id_paiement,
      studentId: p.inscription.etudiant.id_etudiant,
      studentName: `${p.inscription.etudiant.utilisateur.prenom} ${p.inscription.etudiant.utilisateur.nom}`,
      amount: `${p.montant_total} Ar`,
      date: p.date_paiement || p.created_at,
      status: p.statut === 'PAYE' ? 'Validé' : 'En attente',
      formation: p.inscription.formation.titre
    }));
  },

  async validerPaiement(id_utilisateur, id_paiement) {
    await this.verifierEcoleActive(id_utilisateur);
    
    const paiement = await prisma.paiement.update({
      where: { id_paiement },
      data: { 
        statut: 'PAYE',
        date_paiement: new Date()
      },
      include: { inscription: true }
    });

    if (paiement.inscription) {
      await prisma.inscription.update({
        where: { id_inscription: paiement.id_inscription },
        data: { statut: 'VALIDEE' }
      });
    }

    return paiement;
  },

  // 🔹 FORMATIONS
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
            utilisateur: { select: { nom: true, prenom: true, email: true } }
          }
        }
      }
    });
  },

  async getFormationsEcole(id_utilisateur) {
      const ecole = await this.verifierEcoleActive(id_utilisateur);
      const formations = await prisma.formation.findMany({
          where: { id_ecole: ecole.id_ecole },
          include: { _count: { select: { inscriptions: true } } }
      });
      
      return formations.map(f => ({
          id: f.id_formation,
          title: f.titre,
          level: "Formation",
          students: f._count.inscriptions,
          status: f.statut === 'ACTIF' ? 'Publié' : 'Brouillon',
          price: `${f.prix} Ar`,
          endDate: null
      }));
  },

  async modifierFormation(id_utilisateur, id_formation, data) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    return prisma.formation.update({
      where: { 
        id_formation,
        id_ecole: ecole.id_ecole 
      },
      data: {
        titre: data.titre,
        description: data.description,
        duree: data.duree,
        prix: data.prix
      },
      include: {
        ecole: {
          include: { utilisateur: { select: { nom: true, prenom: true } } }
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

  // 🔹 EXPORTS & RAPPORTS
  async exporterListeEtudiants(id_utilisateur, format = 'json') {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    const result = await this.getEtudiantsInscrits(id_utilisateur, 1, 1000);
    
    return {
      format,
      fileName: `etudiants_ecole_${ecole.id_ecole}_${new Date().toISOString().split('T')[0]}`,
      data: result.etudiants,
      generatedAt: new Date().toISOString(),
      total: result.pagination.total
    };
  },

  async getEtudiantsInscrits(id_utilisateur, page = 1, limit = 10) {
    const ecole = await this.verifierEcoleActive(id_utilisateur);
    
    const skip = (page - 1) * limit;
    const [inscriptions, total] = await Promise.all([
      prisma.inscription.findMany({
        where: {
          formation: { id_ecole: ecole.id_ecole },
          statut: "VALIDEE"
        },
        skip,
        take: limit,
        include: {
          etudiant: {
            include: {
              utilisateur: { select: { nom: true, prenom: true, email: true } }
            }
          },
          formation: { select: { titre: true, prix: true } }
        },
        orderBy: { date_inscription: 'desc' }
      }),
      prisma.inscription.count({
        where: {
          formation: { id_ecole: ecole.id_ecole },
          statut: "VALIDEE"
        }
      })
    ]);

    return {
      etudiants: inscriptions,
      pagination: {
        page, limit, total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  async supprimerProfilEcole(id_utilisateur) {
    await this.verifierEcoleActive(id_utilisateur);
    return prisma.ecole.delete({
      where: { id_utilisateur }
    });
  }
};