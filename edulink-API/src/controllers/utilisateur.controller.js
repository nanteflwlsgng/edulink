import utilisateurService from "../services/utilisateur.service.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await utilisateurService.getAllUsers();
    
    res.json({
      message: "Liste des utilisateurs récupérée avec succès",
      data: users
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Erreur lors de la récupération des utilisateurs",
      error: error.message 
    });
  }
};

export const register = async (req, res, next) => {
  try {
    const result = await utilisateurService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;
    const result = await utilisateurService.login(email, mot_de_passe);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    console.log('📍 CONTROLLER getProfile called');
    console.log('🔍 req.user:', req.user);
    console.log('🔍 req.user.id_utilisateur:', req.user?.id_utilisateur);
    const utilisateur = await utilisateurService.getProfile(req.user.id_utilisateur);
    res.status(200).json(utilisateur);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await utilisateurService.updateProfile(req.user.id_utilisateur, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPass, newPass } = req.body;
    const updated = await utilisateurService.changePassword(req.user.id_utilisateur, oldPass, newPass);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    await utilisateurService.deleteAccount(req.user.id_utilisateur);
    res.status(204).json({ message: "Compte supprimé." });
  } catch (error) {
    next(error);
  }
};
