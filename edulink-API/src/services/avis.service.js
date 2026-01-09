// services/avis.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AvisService {
  async ajouterAvis(data) {
    const { id_utilisateur, id_ecole, note, commentaire } = data;
    
    // Validation des données
    this.validerAvis(note, commentaire);
    
    // Vérifier si l'utilisateur existe
    const utilisateurExist = await prisma.utilisateur.findUnique({
      where: { id_utilisateur }
    });
    
    if (!utilisateurExist) {
      throw new Error("Utilisateur non trouvé");
    }
    
    // Vérifier si l'école existe
    if (id_ecole) {
      const ecoleExist = await prisma.ecole.findUnique({
        where: { id_ecole }
      });
      
      if (!ecoleExist) {
        throw new Error("École non trouvée");
      }
    }
    const avisExistant = await prisma.avis.findFirst({
        where: {
            id_utilisateur: id_utilisateur,
            id_ecole: id_ecole
        }
    });
    if (avisExistant) {
        throw new Error("Vous avez déjà donné votre avis sur cet établissement.");
    }
    return await prisma.avis.create({
      data: {
        commentaire,
        note,
        id_utilisateur,
        id_ecole,
      },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        ecole: {
          select: {
            id_ecole: true,
            nom: true,
            description: true
          }
        }
      }
    });
  }

  async modifierAvis(idAvis, data) {
    const { note, commentaire } = data;
    
    // Vérifier si l'avis existe
    const avisExist = await prisma.avis.findUnique({
      where: { id_avis: idAvis }
    });
    
    if (!avisExist) {
      throw new Error("Avis non trouvé");
    }
    
    // Validation si nouvelles données fournies
    if (note !== undefined || commentaire) {
      this.validerAvis(note || avisExist.note, commentaire || avisExist.commentaire);
    }
    
    return await prisma.avis.update({
      where: { id_avis: idAvis },
      data: {
        ...(note !== undefined && { note }),
        ...(commentaire && { commentaire }),
      },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        ecole: {
          select: {
            id_ecole: true,
            nom: true,
            description: true
          }
        }
      }
    });
  }

  async supprimerAvis(idAvis) {
    const avisExist = await prisma.avis.findUnique({
      where: { id_avis: idAvis }
    });
    
    if (!avisExist) {
      throw new Error("Avis non trouvé");
    }
    
    return await prisma.avis.delete({
      where: { id_avis: idAvis }
    });
  }

  async consulterAvisEcole(idEcole) {
    // Vérifier si l'école existe
    const ecoleExist = await prisma.ecole.findUnique({
      where: { id_ecole: idEcole }
    });
    
    if (!ecoleExist) {
      throw new Error("École non trouvée");
    }
    
    const avis = await prisma.avis.findMany({
      where: { id_ecole: idEcole },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        ecole: {
          select: {
            id_ecole: true,
            nom: true,
            description: true
          }
        }
      },
      orderBy: {
        id_avis: 'desc'
      }
    });
    
    // Calculer la note moyenne
    const noteMoyenne = avis.length > 0 
      ? avis.reduce((sum, avis) => sum + avis.note, 0) / avis.length 
      : 0;
    
    return {
      ecole: ecoleExist,
      avis,
      statistiques: {
        totalAvis: avis.length,
        noteMoyenne: Math.round(noteMoyenne * 10) / 10,
        distributionNotes: this.calculerDistributionNotes(avis)
      }
    };
  }

  async consulterTousAvis() {
    return await prisma.avis.findMany({
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        ecole: {
          select: {
            id_ecole: true,
            nom: true,
            description: true
          }
        }
      },
      orderBy: {
        id_avis: 'desc'
      }
    });
  }

  async getAvisById(idAvis) {
    const avis = await prisma.avis.findUnique({
      where: { id_avis: idAvis },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        ecole: {
          select: {
            id_ecole: true,
            nom: true,
            description: true
          }
        }
      }
    });
    
    if (!avis) {
      throw new Error("Avis non trouvé");
    }
    
    return avis;
  }

  async getAvisByUtilisateur(idUtilisateur) {
    return await prisma.avis.findMany({
      where: { id_utilisateur: idUtilisateur },
      include: {
        utilisateur: {
          select: {
            id_utilisateur: true,
            nom: true,
            prenom: true,
            email: true
          }
        },
        ecole: {
          select: {
            id_ecole: true,
            nom: true,
            description: true
          }
        }
      },
      orderBy: {
        id_avis: 'desc'
      }
    });
  }

  // Méthodes de validation
  validerAvis(note, commentaire) {
    if (note < 1 || note > 5) {
      throw new Error("La note doit être comprise entre 1 et 5");
    }
    
    if (!commentaire || commentaire.trim().length === 0) {
      throw new Error("Le commentaire est requis");
    }
    
    if (commentaire.length > 1000) {
      throw new Error("Le commentaire ne peut pas dépasser 1000 caractères");
    }
  }

  calculerDistributionNotes(avis) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    avis.forEach(avis => {
      distribution[avis.note]++;
    });
    
    return distribution;
  }
}

export const avisService = new AvisService();