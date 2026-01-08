export const isEcole = async (req, res, next) => {
  try {
    if (req.user.role !== 'ECOLE') {
      return res.status(403).json({ 
        success: false,
        message: "Accès refusé. Rôle école requis." 
      });
    }

    // Vérifier que l'école est active (validée par admin)
    // if (req.user.statut !== 'ACTIF') {
    //   return res.status(403).json({ 
    //     success: false,
    //     message: "Votre compte école n'est pas encore validé par l'administrateur." 
    //   });
    // }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Erreur de vérification du rôle école" 
    });
  }
};