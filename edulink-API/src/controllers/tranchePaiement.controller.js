// controllers/tranchePaiement.controller.js
import { tranchePaiementService } from '../services/tranchePaiement.service.js';

export class TranchePaiementController {
  async ajouterTranche(req, res) {
    try {
      const data = req.body;

      const tranche = await tranchePaiementService.ajouterTranche(data);

      res.status(201).json({
        success: true,
        message: "Tranche ajoutée avec succès",
        data: tranche
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async modifierTranche(req, res) {
    try {
      const { idTranche } = req.params;
      const data = req.body;

      const tranche = await tranchePaiementService.modifierTranche(parseInt(idTranche), data);

      res.json({
        success: true,
        message: "Tranche modifiée avec succès",
        data: tranche
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async supprimerTranche(req, res) {
    try {
      const { idTranche } = req.params;

      await tranchePaiementService.supprimerTranche(parseInt(idTranche));

      res.json({
        success: true,
        message: "Tranche supprimée avec succès"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async verifierEcheance(req, res) {
    try {
      const tranches = await tranchePaiementService.verifierEcheance();

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

  async getTrancheById(req, res) {
    try {
      const { idTranche } = req.params;

      const tranche = await tranchePaiementService.getTrancheById(parseInt(idTranche));

      res.json({
        success: true,
        data: tranche
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getTranchesByPaiement(req, res) {
    try {
      const { idPaiement } = req.params;

      const tranches = await tranchePaiementService.getTranchesByPaiement(parseInt(idPaiement));

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

export const tranchePaiementController = new TranchePaiementController();