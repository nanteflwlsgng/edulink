export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false,
        message: "Accès refusé. Rôle administrateur requis." 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Erreur de vérification du rôle" 
    });
  }
};