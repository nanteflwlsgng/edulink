// controllers/session.controller.js
import { sessionService } from '../services/session.service.js';

export class SessionController {
  async creerSession(req, res) {
    try {
      const data = req.body;
      
      const session = await sessionService.creerSession(data);
      
      res.status(201).json({
        success: true,
        message: "Session créée avec succès",
        data: session
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async modifierSession(req, res) {
    try {
      const { idSession } = req.params;
      const data = req.body;
      
      const session = await sessionService.modifierSession(parseInt(idSession), data);
      
      res.json({
        success: true,
        message: "Session modifiée avec succès",
        data: session
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async supprimerSession(req, res) {
    try {
      const { idSession } = req.params;
      
      await sessionService.supprimerSession(parseInt(idSession));
      
      res.json({
        success: true,
        message: "Session supprimée avec succès"
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async consulterPlanning(req, res) {
    try {
      const sessions = await sessionService.consulterPlanning();
      
      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSessionById(req, res) {
    try {
      const { idSession } = req.params;
      
      const session = await sessionService.getSessionById(parseInt(idSession));
      
      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSessionsByFormation(req, res) {
    try {
      const { idFormation } = req.params;
      
      const sessions = await sessionService.getSessionsByFormation(parseInt(idFormation));
      
      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export const sessionController = new SessionController();