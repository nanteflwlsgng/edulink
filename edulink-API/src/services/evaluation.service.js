// services/evaluation.service.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class EvaluationService {
  async ajouterEvaluation(idFormation, data) {
    const { type_admission, ...autresDonnees } = data;
    
    this.validerDonneesEvaluation(type_admission, autresDonnees);
    
    const formationExist = await prisma.formation.findUnique({
      where: { id_formation: idFormation }
    });
    
    if (!formationExist) {
      throw new Error("Formation non trouvée");
    }
    
    return await prisma.evaluation.create({
      data: {
        id_formation: idFormation,
        type_admission,
        ...autresDonnees
      },
      include: {
        formation: true
      }
    });
  }

  async modifierEvaluation(idEvaluation, data) {
    const { type_admission, ...autresDonnees } = data;
    
    if (type_admission) {
      this.validerDonneesEvaluation(type_admission, autresDonnees);
    }
    
    const evaluationExist = await prisma.evaluation.findUnique({
      where: { id_evaluation: idEvaluation }
    });
    
    if (!evaluationExist) {
      throw new Error("Évaluation non trouvée");
    }
    
    return await prisma.evaluation.update({
      where: { id_evaluation: idEvaluation },
      data: {
        ...(type_admission && { type_admission }),
        ...autresDonnees
      },
      include: {
        formation: true
      }
    });
  }

  async supprimerEvaluation(idEvaluation) {
    const evaluationExist = await prisma.evaluation.findUnique({
      where: { id_evaluation: idEvaluation }
    });
    
    if (!evaluationExist) {
      throw new Error("Évaluation non trouvée");
    }
    
    return await prisma.evaluation.delete({
      where: { id_evaluation: idEvaluation }
    });
  }

  async consulterEvaluations() {
    return await prisma.evaluation.findMany({
      include: {
        formation: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async getEvaluationById(idEvaluation) {
    const evaluation = await prisma.evaluation.findUnique({
      where: { id_evaluation: idEvaluation },
      include: {
        formation: true
      }
    });
    
    if (!evaluation) {
      throw new Error("Évaluation non trouvée");
    }
    
    return evaluation;
  }

  async getEvaluationsByFormation(idFormation) {
    return await prisma.evaluation.findMany({
      where: { id_formation: idFormation },
      include: {
        formation: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  validerDonneesEvaluation(type_admission, donnees) {
    switch(type_admission) {
      case 'DOSSIER':
        if (!donnees.date_fin_depot_dossier) {
          throw new Error("Date fin dépôt dossier requise pour admission sur dossier");
        }
        break;
        
      case 'CONCOURS':
        if (!donnees.date_debut_concours || !donnees.date_fin_concours) {
          throw new Error("Dates de concours requises pour admission par concours");
        }
        break;
        
      case 'MIXTE':
        if (!donnees.date_fin_depot_dossier || !donnees.date_debut_concours) {
          throw new Error("Dates dépôt dossier ET concours requises pour admission mixte");
        }
        break;
        
      case 'DIRECT':
        break;
        
      default:
        throw new Error("Type d'admission non valide");
    }
  }
}

// Créer une instance unique du service
export const evaluationService = new EvaluationService();