import { FormationService } from '../services/formation.service.js';

const formationService = new FormationService();

export class FormationController {
  // ✅ CRÉATION
  async creerFormation(req, res) {
    try {
      // req.user est rempli par le middleware 'authenticate'
      const id_utilisateur = req.user.id_utilisateur;
      
      console.log("Données reçues:", req.body); // Pour débugger dans le terminal
      console.log("Fichier reçu:", req.file);

      const formation = await formationService.creerFormation(
        id_utilisateur, 
        req.body, 
        req.file
      );
      
      res.status(201).json({
        success: true,
        message: "Formation créée avec succès",
        data: formation
      });
    } catch (error) {
      console.error("Erreur création formation:", error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

    // ✅ Nouvelle méthode
    async listerMesFormations(req, res) {
      try {
        // req.user est fourni par le middleware authenticate
        const id_utilisateur = req.user.id_utilisateur;
        
        const formations = await formationService.listerFormationsParEcole(id_utilisateur);
        
        res.json({ success: true, data: formations });
      } catch (error) {
        console.error("Erreur récupération mes formations:", error);
        res.status(500).json({ success: false, message: error.message });
      }
    }
  // ✅ LECTURE
  async listerFormations(req, res) {
    try {
      const formations = await formationService.listerFormations();
      res.json({ success: true, data: formations });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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

  // formation.controller.js
async getOneFormation(req, res) {
  try {
    const { id } = req.params;
    const formation = await formationService.getFormationById(parseInt(id));
    if(!formation) return res.status(404).json({success: false, message: "Non trouvé"});
    res.json({ success: true, data: formation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

  // Modifier une formation
  async modifierFormation(req, res) {
    try {
      const id_utilisateur = req.user.id_utilisateur;
      const { id_formation } = req.params;

      const formation = await formationService.modifierFormation(
        id_utilisateur, 
        parseInt(id_formation), 
        req.body, 
        req.file // On passe aussi le fichier potentiellement uploadé
      );
      
      res.json({ 
        success: true, 
        message: "Formation modifiée avec succès", 
        data: formation 
      });
    } catch (error) {
      console.error("Erreur modification:", error);
      res.status(500).json({ success: false, message: error.message });
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