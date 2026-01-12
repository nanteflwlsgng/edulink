import { etudiantService } from "../services/etudiant.service.js";

// 🔹 PROFIL ÉTUDIANT
export const getProfilEtudiant = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const profil = await etudiantService.getProfilEtudiant(id_utilisateur);
    
    if (!profil) {
      return res.status(404).json({ 
        success: false, 
        message: "Profil étudiant non trouvé" 
      });
    }
    
    res.json({ success: true, data: profil });
  } catch (error) {console.error("❌ ERREUR PRISMA DÉTECTÉE :", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const creerProfilEtudiant = async (req, res) => {
//   try {
//     const id_utilisateur = req.user.id_utilisateur;
//     const profil = await etudiantService.creerProfilEtudiant(id_utilisateur, req.body);
    
//     res.status(201).json({ 
//       success: true, 
//       message: "Profil étudiant créé avec succès", 
//       data: profil 
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const modifierProfilEtudiant = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const profil = await etudiantService.modifierProfilEtudiant(id_utilisateur, req.body);
    
    res.json({ 
      success: true, 
      message: "Profil modifié avec succès", 
      data: profil 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 RECHERCHE ÉCOLES
export const rechercherEcoles = async (req, res) => {
  try {
    const { nom, specialite, page = 1, limit = 10 } = req.query;
    
    const result = await etudiantService.rechercherEcoles({
      nom,
      specialite,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 CONSULTER PROFIL ÉCOLE
export const consulterProfilEcole = async (req, res) => {
  try {
    const { id_ecole } = req.params;
    const ecole = await etudiantService.consulterProfilEcole(parseInt(id_ecole));
    
    if (!ecole) {
      return res.status(404).json({ 
        success: false, 
        message: "École non trouvée" 
      });
    }
    
    res.json({ success: true, data: ecole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 INSCRIPTION FORMATION
export const sinscrireFormation = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { id_formation } = req.params;
    
    const inscription = await etudiantService.sinscrireFormation(
      id_utilisateur, 
      parseInt(id_formation)
    );
    
    res.status(201).json({ 
      success: true, 
      message: "Inscription à la formation effectuée avec succès", 
      data: inscription 
    });
  } catch (error) {
    if (error.message.includes("non trouvé") || error.message.includes("inactive")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 PAIEMENT
export const payerEcolage = async (req, res) => {
  try {
    console.log('=== DEBUG CONTROLLER PAIEMENT ===');
    console.log('Body reçu:', req.body);
    console.log('Params:', req.params);
    console.log('User:', req.user);
    
    const id_utilisateur = req.user.id_utilisateur;
    const { id_inscription } = req.params;
    
    // EXTRACTION EXPLICITE des champs du body
    const { montant_total, type_paiement } = req.body;
    
    console.log('Champs extraits - montant_total:', montant_total, 'type_paiement:', type_paiement);
    
    // Validation des champs obligatoires
    if (!montant_total || montant_total <= 0) {
      return res.status(400).json({
        success: false,
        message: "Le montant_total est obligatoire et doit être supérieur à 0"
      });
    }
    
    if (!type_paiement) {
      return res.status(400).json({
        success: false,
        message: "Le type_paiement est obligatoire"
      });
    }
    
    const paiement = await etudiantService.payerEcolage(
      id_utilisateur, 
      parseInt(id_inscription), 
      {
        montant_total: parseFloat(montant_total),
        type_paiement: type_paiement
      }
    );
    
    res.status(201).json({ 
      success: true, 
      message: "Paiement initié avec succès", 
      data: paiement 
    });
  } catch (error) {
    console.error('Erreur controller paiement:', error);
    
    if (error.message.includes("non trouvé") || error.message.includes("non trouvée")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 CARTE ÉTUDIANT
export const telechargerCarteEtudiant = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const carte = await etudiantService.telechargerCarteEtudiant(id_utilisateur);
    
    res.json({ 
      success: true, 
      message: "Carte étudiante avec QR code générée avec succès", 
      data: {
        ...carte,
        // Informations supplémentaires pour le frontend
        qr_info: {
          format: 'base64',
          type: 'image/png',
          size: '300x300'
        }
      }
    });
  } catch (error) {
    if (error.message.includes("non trouvé")) {
      return res.status(404).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 AVIS
export const laisserAvis = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { id_ecole } = req.params;
    
    const avis = await etudiantService.laisserAvis(
      id_utilisateur, 
      parseInt(id_ecole), 
      req.body
    );
    
    res.status(201).json({ 
      success: true, 
      message: "Avis publié avec succès", 
      data: avis 
    });
  } catch (error) {
    if (error.message.includes("inscrit") || error.message.includes("non trouvé")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 NOTIFICATIONS
export const getNotificationsEtudiant = async (req, res) => {
  try {
    // Sécurité : parfois le middleware met 'id' et parfois 'id_utilisateur'
    const id_utilisateur = req.user.id_utilisateur || req.user.id;

    if (!id_utilisateur) {
        return res.status(401).json({ success: false, message: "Utilisateur non identifié" });
    }

    const result = await etudiantService.getNotificationsEtudiant(id_utilisateur);
    
    // Le frontend recevra : response.data.data.notifications
    res.json({ 
        success: true, 
        data: result 
    });

  } catch (error) {
    console.error("Erreur notification controller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
export const telechargerCarte = async (req, res)=> {
    try {
      const {id_inscription } = req.params;

      // 1. Appel au service pour générer le binaire (buffer) du PDF
      const pdfBuffer = await etudiantService.genererCartePDF(parseInt(id_inscription));

      // 2. Configuration des en-têtes pour le téléchargement
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="Carte_Etudiant_${id_inscription}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      // 3. Envoi du fichier
      res.send(pdfBuffer);

    } catch (error) {
      console.error("Erreur carte:", error);
      res.status(404).json({ 
        success: false, 
        message: error.message || "Impossible de générer la carte." 
      });
    }
  }