import { ecoleService } from "../services/ecole.service.js";

// 🔹 GESTION DU PROFIL (accessible à toutes les écoles)
export const getProfilEcole = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const profil = await ecoleService.getProfilEcole(id_utilisateur);
    
    if (!profil) {
      return res.status(404).json({ 
        success: false, 
        message: "Profil école non trouvé" 
      });
    }
    
    res.json({ success: true, data: profil });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... tes imports ...

// 🔹 GESTION DES CANDIDATURES (Réservé aux écoles ACTIVES)
export const getCandidatures = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    
    const candidatures = await ecoleService.getCandidatures(id_utilisateur);
    
    res.json({ 
      success: true, 
      data: candidatures 
    });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatutCandidature = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { id } = req.params; // id de l'inscription
    const { decision } = req.body; // 'Admis', 'Refusé', 'Vu'
    
    const result = await ecoleService.updateStatutCandidature(
      id_utilisateur, 
      parseInt(id), 
      decision
    );
    
    res.json({ 
      success: true, 
      message: `Statut mis à jour : ${decision}`, 
      data: result 
    });
  } catch (error) {
    if (error.message.includes("non validée") || error.message.includes("non autorisée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// ... le reste de tes controlleurs (getProfilEcole, etc.) ...
export const creerProfilEcole = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const profil = await ecoleService.creerProfilEcole(id_utilisateur, req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Profil école créé avec succès", 
      data: profil 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const modifierProfilEcole = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const profil = await ecoleService.modifierProfilEcole(id_utilisateur, req.body);
    
    res.json({ 
      success: true, 
      message: "Profil modifié avec succès", 
      data: profil 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const supprimerProfilEcole = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    await ecoleService.supprimerProfilEcole(id_utilisateur);
    
    res.json({ 
      success: true, 
      message: "Profil école supprimé avec succès" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 GESTION DES FORMATIONS (réservé aux écoles ACTIVES)
export const ajouterFormation = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const formation = await ecoleService.ajouterFormation(id_utilisateur, req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Formation ajoutée avec succès", 
      data: formation 
    });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFormationsEcole = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await ecoleService.getFormationsEcole(
      id_utilisateur, 
      parseInt(page), 
      parseInt(limit)
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const modifierFormation = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { id } = req.params;
    
    const formation = await ecoleService.modifierFormation(
      id_utilisateur, 
      parseInt(id), 
      req.body
    );
    
    res.json({ 
      success: true, 
      message: "Formation modifiée avec succès", 
      data: formation 
    });
  } catch (error) {
    if (error.message.includes("non validée") || error.message.includes("non trouvée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const supprimerFormation = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { id } = req.params;
    
    await ecoleService.supprimerFormation(id_utilisateur, parseInt(id));
    
    res.json({ 
      success: true, 
      message: "Formation supprimée avec succès" 
    });
  } catch (error) {
    if (error.message.includes("non validée") || error.message.includes("non trouvée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 GESTION DES ÉTUDIANTS (réservé aux écoles ACTIVES)
export const getEtudiantsInscrits = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { page = 1, limit = 10 } = req.query;
    
    const result = await ecoleService.getEtudiantsInscrits(
      id_utilisateur, 
      parseInt(page), 
      parseInt(limit)
    );
    
    res.json({ success: true, data: result });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const envoyerNotificationEtudiant = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { id_etudiant } = req.params;
    const { message } = req.body;
    
    const result = await ecoleService.envoyerNotificationEtudiant(
      id_utilisateur, 
      parseInt(id_etudiant), 
      message
    );
    
    res.json({ 
      success: true, 
      message: "Notification envoyée avec succès", 
      data: result 
    });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 STATISTIQUES ET RAPPORTS (réservé aux écoles ACTIVES)
export const getStatistiquesEcole = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const stats = await ecoleService.getStatistiquesEcole(id_utilisateur);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const genererRapportFinancier = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const rapport = await ecoleService.genererRapportFinancier(id_utilisateur);
    
    res.json({ success: true, data: rapport });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const exporterListeEtudiants = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { format = 'json' } = req.query;
    
    const exportData = await ecoleService.exporterListeEtudiants(id_utilisateur, format);
    
    res.json({ success: true, data: exportData });
  } catch (error) {
    if (error.message.includes("non validée")) {
      return res.status(403).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 NOTIFICATIONS (accessible à toutes les écoles)
export const getNotifications = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const notifications = await ecoleService.getNotificationsEcole(id_utilisateur);
    
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
