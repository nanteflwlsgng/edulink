// controllers/paiement.controller.js
import { paiementService } from '../services/paiement.service.js';

export class PaiementController {
  async effectuerPaiement(req, res) {
    try {
      const data = req.body;
      
      const resultat = await paiementService.effectuerPaiement(data);
      
      res.status(201).json({
        success: true,
        message: "Paiement effectué avec succès",
        data: resultat
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async traiterPaiementTranche(req, res) {
    try {
      const { idTranche } = req.params;
      const detailsPaiement = req.body;
      
      const resultat = await paiementService.traiterPaiementTranche(parseInt(idTranche), detailsPaiement);
      
      res.json({
        success: true,
        message: "Tranche payée avec succès",
        data: resultat
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async verifierStatutPaiement(req, res) {
    try {
      const { idPaiement } = req.params;
      
      const statut = await paiementService.verifierStatutPaiement(parseInt(idPaiement));
      
      res.json({
        success: true,
        data: statut
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async mettreAJourStatut(req, res) {
    try {
      const { idPaiement } = req.params;
      const { statut } = req.body;
      
      const paiement = await paiementService.mettreAJourStatut(parseInt(idPaiement), statut);
      
      res.json({
        success: true,
        message: "Statut du paiement mis à jour avec succès",
        data: paiement
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async genererRecu(req, res) {
    try {
      const { idPaiement } = req.params;
      
      const recu = await paiementService.genererRecu(parseInt(idPaiement));
      
      res.json({
        success: true,
        message: "Reçu généré avec succès",
        data: recu
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaiementById(req, res) {
    try {
      const { idPaiement } = req.params;
      
      const paiement = await paiementService.getPaiementById(parseInt(idPaiement));
      
      res.json({
        success: true,
        data: paiement
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getPaiementsByInscription(req, res) {
    try {
      const { idInscription } = req.params;
      
      const paiements = await paiementService.getPaiementsByInscription(parseInt(idInscription));
      
      res.json({
        success: true,
        data: paiements
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTranchesEnRetard(req, res) {
    try {
      const tranches = await paiementService.getTranchesEnRetard();
      
      res.json({
        success: true,
        data: tranches
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const paiementController = new PaiementController();