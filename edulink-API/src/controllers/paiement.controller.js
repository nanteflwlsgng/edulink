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
// controllers/paiement.controller.js

async genererRecu(req, res) {
  try {
    const { idPaiement } = req.params;
    
    // 1. Appel au service (qui retourne { paiement, recu })
    const resultat = await paiementService.genererRecu(parseInt(idPaiement));
    
    // 2. Extraction des données binaires du PDF
    // Le service retourne un objet { paiement: ..., recu: { buffer, filename, contentType } }
    const { buffer, filename, contentType } = resultat.recu;

    // 3. Configuration des headers HTTP pour dire au navigateur "Ceci est un fichier PDF"
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);

    // 4. Envoi direct du buffer (IMPORTANT : ne pas utiliser res.json)
    res.send(buffer);

  } catch (error) {
    console.error("Erreur génération reçu:", error);
    // En cas d'erreur, on peut renvoyer du JSON (le frontend devra gérer ce cas s'il attend un blob)
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
  // controllers/paiement.controller.js

async getFinances(req, res) {
  try {
    const transactions = await paiementService.getHistoriqueFinances();
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    console.error("Erreur finances:", error);
    res.status(500).json({
      success: false,
      message: "Impossible de récupérer l'historique financier"
    });
  }
}
async validerTransactionEcole(req, res) {
    try {
        const { idPaiement } = req.params;
        await paiementService.validerPaiementEcole(idPaiement);
        res.json({ success: true, message: "Transaction validée et étudiant inscrit." });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
}


export const paiementController = new PaiementController();