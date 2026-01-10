// controllers/carteEtudiant.controller.js
import { carteEtudiantService } from '../services/carteEtudiant.service.js';

export class CarteEtudiantController {
  async genererCarteEtudiant(req, res) {
    try {
      const { idEtudiant } = req.params;

      const carte = await carteEtudiantService.genererCarteEtudiant(parseInt(idEtudiant));

      res.status(201).json({
        success: true,
        message: "Carte étudiante générée avec succès",
        data: carte
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async afficherQRCode(req, res) {
    try {
      const { idCarte } = req.params;

      const qrCode = await carteEtudiantService.afficherQRCode(parseInt(idCarte));

      res.json({
        success: true,
        data: qrCode
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async renouvelerCarte(req, res) {
    try {
      const { idCarte } = req.params;

      const nouvelleCarte = await carteEtudiantService.renouvelerCarte(parseInt(idCarte));

      res.json({
        success: true,
        message: "Carte renouvelée avec succès",
        data: nouvelleCarte
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async desactiverCarte(req, res) {
    try {
      const { idCarte } = req.params;

      const carteDesactivee = await carteEtudiantService.desactiverCarte(parseInt(idCarte));

      res.json({
        success: true,
        message: "Carte désactivée avec succès",
        data: carteDesactivee
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCarteById(req, res) {
    try {
      const { idCarte } = req.params;

      const carte = await carteEtudiantService.getCarteById(parseInt(idCarte));

      res.json({
        success: true,
        data: carte
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getCartesByEtudiant(req, res) {
    try {
      const { idEtudiant } = req.params;

      const cartes = await carteEtudiantService.getCartesByEtudiant(parseInt(idEtudiant));

      res.json({
        success: true,
        data: cartes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const carteEtudiantController = new CarteEtudiantController();