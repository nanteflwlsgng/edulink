import { FavorisService } from '../services/favoris.service.js';

const favorisService = new FavorisService();

export class FavorisController {

  // Méthode pour le bouton "Sauvegarder" (Toggle)
  async toggle(req, res) {
    try {
      const { id_etudiant, id_formation } = req.body;

      if (!id_etudiant || !id_formation) {
        return res.status(400).json({ 
          success: false, 
          message: "id_etudiant et id_formation sont requis" 
        });
      }

      const result = await favorisService.toggleFavoris(
        parseInt(id_etudiant), 
        parseInt(id_formation)
      );

      res.status(200).json({
        success: true,
        ...result // Renvoie isFavorite et message
      });

    } catch (error) {
      console.error("Erreur Toggle Favoris:", error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour des favoris"
      });
    }
  }

  // Méthode pour afficher la liste dans le Dashboard
  async getMyFavorites(req, res) {
    try {
      const id_utilisateur = req.params.id_utilisateur; console.log("Controller: Demande favoris pour ID:", id_utilisateur);
       if (!id_utilisateur) {
            return res.status(400).json({ success: false, message: "ID manquant" });
        }

        // Appel au service avec la VALEUR (le string '5') et non l'objet
        const favoris = await favorisService.getFavorisByUtilisateur(id_utilisateur);

       return res.status(200).json({
        success: true,
        data: favoris,
        count: favoris.length
      });

    } catch (error) {
      console.error("Erreur Get Favoris:", error);
      return  res.status(500).json({
        success: false,
        message: "Impossible de récupérer les favoris"
      });
    }
  }
}