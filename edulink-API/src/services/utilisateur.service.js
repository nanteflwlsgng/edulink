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
        id_utilisateur: 'desc' 
      }
    });
    return users;
  } catch (error) {
    throw new Error(`Erreur récupération des utilisateurs: ${error.message}`);
  }
};

const register = async (data) => {
  // 1. Vérification si l'email existe déjà
  const existing = await prisma.utilisateur.findUnique({
    where: { email: data.email },
  });
  if (existing) throw new Error("Email déjà utilisé.");

  // 2. Hashage du mot de passe
  const hashedPassword = await bcrypt.hash(data.mot_de_passe, 10);

  // 3. Définition du statut
  // 🔥 MODIFICATION : Tout le monde est ACTIF par défaut, même les écoles.
  const statutInitial = "ACTIF"; 
  
  // 4. Préparation des données pour Prisma
  const userData = {
    // Données générales (Table Utilisateur)
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    mot_de_passe: hashedPassword,
    role: data.role,
    statut: statutInitial,
    telephone: data.telephone, 
    ville: data.ville,         

    // --- CONFIGURATION SPÉCIFIQUE ÉCOLE ---
    ecole: data.role === 'ECOLE' ? {
      create: {
        adresse: data.ville, 
        telephone: data.telephone,
        nom: data.nom 
      }
    } : undefined,

    // --- CONFIGURATION SPÉCIFIQUE ÉTUDIANT ---
    etudiant: data.role === 'ETUDIANT' ? {
      create: {
        telephone: data.telephone,
        adresse: data.adresse || data.ville, 
        date_naissance: data.date_naissance ? new Date(data.date_naissance) : null
      }
    } : undefined
  };

  // 5. Création en base de données
  const utilisateur = await prisma.utilisateur.create({
    data: userData,
    include: {
      etudiant: true, 
      ecole: true
    }
  });

  // 6. Génération du Token JWT
  const token = generateToken({
    id_utilisateur: utilisateur.id_utilisateur,
    role: utilisateur.role,
  });

  return { utilisateur, token };
};

const login = async (email, mot_de_passe, roleRequis) => { 
  
  // 1. Chercher l'utilisateur
  const utilisateur = await prisma.utilisateur.findUnique({ where: { email } });
  if (!utilisateur) throw new Error("Email ou mot de passe incorrect.");

  // 2. Vérifier le mot de passe
  const isValid = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
  if (!isValid) throw new Error("Email ou mot de passe incorrect.");

  // 3. 🔒 VÉRIFICATION DU RÔLE (SECURITY CHECK)
  if (roleRequis) {
    if (utilisateur.role !== roleRequis) {
      throw new Error("Accès refusé : Ce compte ne correspond pas au profil demandé.");
    }
  }

  // 4. Vérification du statut
  // 🔥 MODIFICATION : On a supprimé le blocage pour "EN_ATTENTE"
  // On ne bloque que les comptes explicitement bannis ou suspendus
  if (utilisateur.statut === 'SUSPENDU' || utilisateur.statut === 'INACTIF') {
     throw new Error("Ce compte est désactivé.");
  }

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