import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';
export const isEtudiant = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Accès refusé. Token manquant.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'votre_secret_jwt');
    
    if (decoded.role !== 'ETUDIANT') {
      return res.status(403).json({ 
        success: false,
        message: 'Accès refusé. Réservé aux étudiants uniquement.' 
      });
    }

    const utilisateur = await prisma.utilisateur.findUnique({
      where: { id_utilisateur: decoded.id_utilisateur },
      include: {
        etudiant: true
      }
    });

    if (!utilisateur) {
      return res.status(403).json({ 
        success: false,
        message: 'Accès refusé. Étudiant non trouvé.' 
      });
    }

    req.etudiant = {
      user_id: utilisateur.id_utilisateur,
      email: utilisateur.email,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      role: utilisateur.role,
      statut: utilisateur.statut,
      etudiant: utilisateur.etudiant
    };

    next();
    
  } catch (error) {
    console.error('Erreur middleware isEtudiant:', error);
    return res.status(401).json({ 
      success: false,
      message: 'Token invalide ou erreur d\'authentification.' 
    });
  }
};

export default isEtudiant;