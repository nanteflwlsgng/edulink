import { InscriptionService } from '../services/inscription.service.js';

const inscriptionService = new InscriptionService();

export class InscriptionController {
  // Valider une inscription
  async validerInscription(req, res) {
    try {
      const { id_inscription } = req.params;

      const result = await inscriptionService.validerInscription(parseInt(id_inscription));
      
      res.json({
        success: true,
        message: "Inscription validée avec succès",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Annuler une inscription
  async annulerInscription(req, res) {
    try {
      const { id_inscription } = req.params;

      const result = await inscriptionService.annulerInscription(parseInt(id_inscription));
      
      res.json({
        success: true,
        message: "Inscription annulée avec succès",
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Consulter le statut d'une inscription
  async consulterStatut(req, res) {
    try {
      const { id_inscription } = req.params;

      const result = await inscriptionService.consulterStatut(parseInt(id_inscription));
      
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

  // Générer un reçu d'inscription
  // Méthode qui retourne les infos en JSON
async genererRecuInscription(req, res) {
  try {
    const { id_inscription } = req.params;

    const result = await inscriptionService.genererRecuInscription(parseInt(id_inscription));
    
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

// Méthode qui retourne le PDF directement
async downloadRecuPDF(req, res) {
  try {
    const { id_inscription } = req.params;
    
    // Utiliser la NOUVELLE méthode qui retourne le buffer PDF
    const pdfBuffer = await inscriptionService.genererRecuPDFDirect(parseInt(id_inscription));
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="recu_inscription_${id_inscription}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}



  // Créer une inscription
  async creerInscription(req, res) {
    try {
      const { id_etudiant, id_formation, statut } = req.body;

      const result = await inscriptionService.creerInscription(
        parseInt(id_etudiant), 
        parseInt(id_formation), 
        statut
      );
      
      res.status(201).json({
        success: true,
        message: "Inscription créée avec succès",
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