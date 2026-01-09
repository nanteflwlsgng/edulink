import { FormationService } from '../services/formation.service.js';

const formationService = new FormationService();

export class FormationController {
  // Récupérer toutes les formations
  async listerFormations(req, res) {
    try {
      const formations = await formationService.listerFormations();
      
      res.json({
        success: true,
        data: formations 
        // Le JSON retourné contiendra exactement :
        // id_formation, titre, description, duree, prix, 
        // nbr_max_etudiant, date_creation, id_ecole, ecole: { nom: ... }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  async getFormationById(req, res) {
    try {
      const { id_formation } = req.params;
      
      const formation = await formationService.getFormationById(id_formation);

      // Si la formation n'existe pas (retourne null)
      if (!formation) {
        return res.status(404).json({
          success: false,
          message: "Formation introuvable."
        });
      }

      // Succès
      res.json({
        success: true,
        data: formation
      });

    } catch (error) {
      // Erreur serveur ou ID invalide
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Ajouter une session à une formation
  async ajouterSession(req, res) {
    try {
      const { id_formation } = req.params;
      const sessionData = req.body;

      const result = await formationService.ajouterSession(parseInt(id_formation), sessionData);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Modifier une formation
  async modifierFormation(req, res) {
    try {
      const { id_formation } = req.params;
      const formationData = req.body;

      const result = await formationService.modifierFormation(parseInt(id_formation), formationData);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Supprimer une formation
  async supprimerFormation(req, res) {
    try {
      const { id_formation } = req.params;

      const result = await formationService.supprimerFormation(parseInt(id_formation));
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Consulter les étudiants inscrits
  async consulterEtudiantsInscrits(req, res) {
    try {
      const { id_formation } = req.params;

      const result = await formationService.consulterEtudiantsInscrits(parseInt(id_formation));
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Évaluer un étudiant
  async evaluerEtudiant(req, res) {
    try {
      const { id_formation, id_etudiant } = req.params;
      const evaluationData = req.body;

      const result = await formationService.evaluerEtudiant(
        parseInt(id_formation), 
        parseInt(id_etudiant), 
        evaluationData
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Voir les statistiques d'inscription
  async voirStatistiquesInscription(req, res) {
    try {
      const { id_formation } = req.params;

      const result = await formationService.voirStatistiquesInscription(parseInt(id_formation));
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}