import { FormationService } from '../services/formation.service.js';

const formationService = new FormationService();

export class FormationController {
  // Récupérer toutes les formations
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
// Dans formation.controller.js

async modifierFormation(req, res) {
    try {
        // ✅ CORRECTION : Le nom doit correspondre à la route '/:id_formation'
        const id_formation = req.params.id_formation; 
        
        const id_utilisateur = req.user.id_utilisateur;
        const data = req.body;
        const file = req.file;

        console.log("🛠️ Modif - ID:", id_formation); // Ajoute ce log pour vérifier

        // Vérification de sécurité avant d'appeler le service
        if (!id_formation) {
            return res.status(400).json({ success: false, message: "ID formation manquant" });
        }

        const resultat = await formationService.modifierFormation(
            id_utilisateur, 
            id_formation, // Maintenant c'est bien défini
            data, 
            file
        );

        res.json({ success: true, message: "Formation modifiée", data: resultat });
    } catch (error) {
        console.error("Erreur modif:", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

  // Supprimer une formation
async supprimerFormation(req, res) {
    try {
      // Récupération des IDs
      const id_formation = req.params.id_formation;
      const id_utilisateur = req.user.id_utilisateur;

      console.log(`🗑️ Tentative suppression Form:${id_formation} par User:${id_utilisateur}`);

      // Appel du service corrigé
      const result = await formationService.supprimerFormation(id_utilisateur, id_formation);
      
      res.json({ success: true, message: result.message });
    } catch (error) {
      console.error("Erreur suppression:", error);
      // Renvoie l'erreur exacte au Frontend
      res.status(400).json({ success: false, message: error.message });
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