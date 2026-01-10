// src/controllers/admin.controller.js
import {adminService} from "../services/admin.service.js";

// 🔹 GESTION DES ÉCOLES
export const getEcolesEnAttente = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await adminService.getEcolesEnAttente(parseInt(page), parseInt(limit));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEcolesParStatut = async (req, res) => {
  try {
    const { statut } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await adminService.getEcolesParStatut(statut, parseInt(page), parseInt(limit));
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const validerEcole = async (req, res) => {
  try {
    const { id } = req.params;
    const ecole = await adminService.validerEcole(parseInt(id));
    res.json({ success: true, message: "École validée avec succès", data: ecole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejeterEcole = async (req, res) => {
  try {
    const { id } = req.params;
    const ecole = await adminService.rejeterEcole(parseInt(id));
    res.json({ success: true, message: "Demande d'école rejetée", data: ecole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const suspendreEcole = async (req, res) => {
  try {
    const { id } = req.params;
    const ecole = await adminService.suspendreEcole(parseInt(id));
    res.json({ success: true, message: "École suspendue avec succès", data: ecole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reactiverEcole = async (req, res) => {
  try {
    const { id } = req.params;
    const ecole = await adminService.reactiverEcole(parseInt(id));
    res.json({ success: true, message: "École réactivée avec succès", data: ecole });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const supprimerEcole = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.supprimerEcole(parseInt(id));
    res.json({ success: true, message: "École supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 GESTION DES UTILISATEURS
export const gererUtilisateurs = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, statut } = req.query;
    const result = await adminService.gererUtilisateurs(parseInt(page), parseInt(limit), role, statut);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const suspendreUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await adminService.suspendreUtilisateur(parseInt(id));
    res.json({ success: true, message: "Utilisateur suspendu avec succès", data: utilisateur });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reactiverUtilisateur = async (req, res) => {
  try {
    const { id } = req.params;
    const utilisateur = await adminService.reactiverUtilisateur(parseInt(id));
    res.json({ success: true, message: "Utilisateur réactivé avec succès", data: utilisateur });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 STATISTIQUES
export const voirStatistiques = async (req, res) => {
  try {
    const stats = await adminService.voirStatistiquesGlobales();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 SUPERVISION PAIEMENTS
export const superviserPaiements = async (req, res) => {
  try {
    const { page = 1, limit = 10, statut } = req.query;
    const result = await adminService.superviserPaiements(parseInt(page), parseInt(limit), statut);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getNotificationsAdmin = async (req, res) => {
  try {
    const id_utilisateur = req.user.id_utilisateur;
    const { page = 1, limit = 20, lue } = req.query;
    
    const result = await adminService.getNotificationsAdmin(id_utilisateur, {
      page: parseInt(page),
      limit: parseInt(limit),
      lue: lue || null
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};