// utils/jwt.js
import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    { id_utilisateur: user.id_utilisateur, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' } // Le token expire en 1 jour
  );
};
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};