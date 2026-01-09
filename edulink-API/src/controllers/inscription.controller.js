import { InscriptionService } from '../services/inscription.service.js';

const inscriptionService = new InscriptionService();

export class InscriptionController {
  // Valider une inscription
  async creerCandidature(req, res) {
    try {
      // 1. Extraction des données texte (req.body)
      const { 
        id_formation, id_utilisateur, 
        telephone, date_naissance, sexe, dernier_diplome, ecole_origine, motivation 
      } = req.body;

      // 2. Extraction des fichiers (req.files) fournis par Multer
      const files = req.files || {};
      const cvPath = files['cv'] ? files['cv'][0].path : null;
      const lettrePath = files['lettre_motivation'] ? files['lettre_motivation'][0].path : null;
      const notesPath = files['releve_notes'] ? files['releve_notes'][0].path : null;
      const idCardPath = files['piece_identite'] ? files['piece_identite'][0].path : null;

      // 3. Appel au Service
      const result = await inscriptionService.creerCandidature({
        id_utilisateur,
        id_formation,
        telephone,
        date_naissance,
        sexe,
        dernier_diplome,
        ecole_origine,
        motivation,
        cvPath,
        lettrePath,
        notesPath,
        idCardPath
      });

      res.status(201).json({
        success: true,
        message: "Candidature envoyée avec succès !",
        data: result
      });

    } catch (error) {
      console.error("Erreur Controller Inscription:", error);
      res.status(400).json({ // 400 Bad Request si erreur métier (ex: doublon)
        success: false,
        message: error.message || "Erreur lors de l'envoi de la candidature"
      });
    }
  }
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
async recupererCandidaturesEtudiant(req, res) {
    try {
      // On récupère l'ID soit via les paramètres d'URL (ex: /api/candidatures/user/5)
      // Soit via le token décodé (req.user.id) si vous utilisez un middleware d'auth.
      // Ici, je suppose que vous le passez en paramètre pour faire simple :
      const { id_utilisateur } = req.params;

      const result = await inscriptionService.getCandidaturesByUtilisateur(parseInt(id_utilisateur));
      
      res.status(200).json({
        success: true,
        data: result // Ceci sera votre tableau applications côté React
      });
    } catch (error) {
      console.error("Erreur récupération candidatures:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}