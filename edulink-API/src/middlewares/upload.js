import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ 1. Définir la fonction utilitaire createDir
const createDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// --- CONFIGURATION FORMATIONS ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/formations/";
    createDir(dir); // On utilise la fonction ici
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'formation-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// --- CONFIGURATION ECOLES ---
const storageEcole = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/ecoles/';
    createDir(dir); // ✅ L'erreur est corrigée ici car la fonction existe maintenant
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtres
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées !"), false);
  }
};

// Exports
export const uploadFormationImage = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

export const uploadEcoleFiles = multer({ 
  storage: storageEcole,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Seules les images sont autorisées !'));
  }
});