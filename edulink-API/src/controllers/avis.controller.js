// controllers/avis.controller.js
import { avisService } from '../services/avis.service.js';

export class AvisController {
  async ajouterAvis(req, res) {
    try {
      const data = req.body;
      
      const avis = await avisService.ajouterAvis(data);
      
      res.status(201).json({
        success: true,
        message: "Avis ajouté avec succès",
        data: avis
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async modifierAvis(req, res) {
    try {
      const { idAvis } = req.params;
      const data = req.body;
      
      const avis = await avisService.modifierAvis(parseInt(idAvis), data);
      
      res.json({
        success: true,
        message: "Avis modifié avec succès",
        data: avis
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async supprimerAvis(req, res) {
    try {
      const { idAvis } = req.params;
      
      await avisService.supprimerAvis(parseInt(idAvis));
      
      res.json({
        success: true,
        message: "Avis supprimé avec succès"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async consulterAvisEcole(req, res) {
    try {
      const { idEcole } = req.params;
      
      const resultat = await avisService.consulterAvisEcole(parseInt(idEcole));
      
      res.json({
        success: true,
        data: resultat
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async consulterTousAvis(req, res) {
    try {
      const avis = await avisService.consulterTousAvis();
      
      res.json({
        success: true,
        data: avis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAvisById(req, res) {
    try {
      const { idAvis } = req.params;
      
      const avis = await avisService.getAvisById(parseInt(idAvis));
      
      res.json({
        success: true,
        data: avis
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAvisByUtilisateur(req, res) {
    try {
      const { idUtilisateur } = req.params;
      
      const avis = await avisService.getAvisByUtilisateur(parseInt(idUtilisateur));
      
      res.json({
        success: true,
        data: avis
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const avisController = new AvisController();