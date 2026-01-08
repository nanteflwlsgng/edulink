// middleware/auth.js
import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token décodé:', JSON.stringify(decoded, null, 2));
    console.log('🔍 id_utilisateur value:', decoded.id_utilisateur);
    console.log('🔍 Type of id_utilisateur:', typeof decoded.id_utilisateur);
    req.user = decoded; // On met les infos du token dans req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
