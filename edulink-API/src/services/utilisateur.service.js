import bcrypt from "bcrypt";
import prisma from "../config/prismaClient.js";
import { generateToken } from "../utils/jwt.js";
const getAllUsers = async () => {
  try {
    const users = await prisma.utilisateur.findMany({
      select: {
        id_utilisateur: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
      
        
      },
      orderBy: {
        id_utilisateur: 'desc' // Tri par date de création décroissante
      }
    });
    
    return users;
  } catch (error) {
    throw new Error(`Erreur récupération des utilisateurs: ${error.message}`);
  }
};
const register = async (data) => {
  const existing = await prisma.utilisateur.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email déjà utilisé.");

  const hashedPassword = await bcrypt.hash(data.mot_de_passe, 10);

 
  // ✅ DÉTERMINER LE STATUT SELON LE RÔLE
  let statutInitial = "ACTIF"; // Par défaut pour tous
  
  if (data.role === "ECOLE") {
    statutInitial = "EN_ATTENTE"; //  Seules les écoles en attente
  }
  
  // car 'data' contient tout (ville, tel, etc.) et prisma.utilisateur n'en veut pas.
  const userData = {
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    mot_de_passe: hashedPassword,
    role: data.role,
    statut: statutInitial,
    
    // === C'EST ICI QU'ON FAIT L'APPEL AU PROFIL ===
    // Prisma va créer l'étudiant AUTOMATIQUEMENT et le lier
    etudiant: data.role === 'ETUDIANT' ? {
      create: {
        telephone: data.telephone,
        adresse: data.adresse || data.ville, // Adapte selon ton formulaire
        date_naissance: data.date_naissance ? new Date(data.date_naissance) : null
      }
    } : undefined,

    // Idem pour l'école
    ecole: data.role === 'ECOLE' ? {
      create: {
        telephone: data.telephone,
        adresse: data.adresse || data.ville, // ou adresse
        nom: data.nom // Souvent le nom de l'école
      }
    } : undefined
  };

  // 5. CRÉATION ATOMIQUE (Tout ou Rien)
  // Si la création de l'étudiant échoue, l'utilisateur ne sera PAS créé.
  const utilisateur = await prisma.utilisateur.create({
    data: userData,
    include: {
      etudiant: true, // On renvoie les infos créées
      ecole: true
    }
  });

  const token = generateToken({
    id_utilisateur: utilisateur.id_utilisateur,
    role: utilisateur.role,
  });

  return { utilisateur, token };
};

const login = async (email, mot_de_passe) => {
  const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
  if (!utilisateur) throw new Error("Utilisateur non trouvé.");

  const isValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
  if (!isValid) throw new Error("Mot de passe incorrect.");

  const token = generateToken({
    id_utilisateur: utilisateur.id_utilisateur,
    role: utilisateur.role,
  });

  return { utilisateur, token };
};

const getProfile = async (id_utilisateur) => {
  return prisma.utilisateur.findUnique({ where: { id_utilisateur } });
};

const updateProfile = async (id_utilisateur, data) => {
  return prisma.utilisateur.update({
    where: { id_utilisateur },
    data,
  });
};

const changePassword = async (id_utilisateur, oldPass, newPass) => {
  const user = await prisma.utilisateur.findUnique({ where: { id_utilisateur } });
  const valid = await bcrypt.compare(oldPass, user.mot_de_passe);
  if (!valid) throw new Error("Ancien mot de passe incorrect.");
  const hashed = await bcrypt.hash(newPass, 10);
  return prisma.utilisateur.update({
    where: { id_utilisateur },
    data: { mot_de_passe: hashed },
  });
};

const deleteAccount = async (id_utilisateur) => {
  return prisma.utilisateur.delete({ where: { id_utilisateur } });
};

export default {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAllUsers,
};
