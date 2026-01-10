// controllers/evaluation.controller.js
import { evaluationService } from '../services/evaluation.service.js';

export class EvaluationController {
  async ajouterEvaluation(req, res) {
    try {
      const { idFormation } = req.params;
      const data = req.body;
      
      const evaluation = await evaluationService.ajouterEvaluation(parseInt(idFormation), data);
      
      res.status(201).json({
        success: true,
        message: "Évaluation créée avec succès",
        data: evaluation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async modifierEvaluation(req, res) {
    try {
      const { idEvaluation } = req.params;
      const data = req.body;
      
      const evaluation = await evaluationService.modifierEvaluation(parseInt(idEvaluation), data);
      
      res.json({
        success: true,
        message: "Évaluation modifiée avec succès",
        data: evaluation
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async supprimerEvaluation(req, res) {
    try {
      const { idEvaluation } = req.params;
      
      await evaluationService.supprimerEvaluation(parseInt(idEvaluation));
      
      res.json({
        success: true,
        message: "Évaluation supprimée avec succès"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async consulterEvaluations(req, res) {
    try {
      const evaluations = await evaluationService.consulterEvaluations();
      
      res.json({
        success: true,
        data: evaluations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getEvaluationById(req, res) {
    try {
      const { idEvaluation } = req.params;
      
      const evaluation = await evaluationService.getEvaluationById(parseInt(idEvaluation));
      
      res.json({
        success: true,
        data: evaluation
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getEvaluationsByFormation(req, res) {
    try {
      const { idFormation } = req.params;
      
      const evaluations = await evaluationService.getEvaluationsByFormation(parseInt(idFormation));
      
      res.json({
        success: true,
        data: evaluations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

// Créer une instance unique du controller
export const evaluationController = new EvaluationController();