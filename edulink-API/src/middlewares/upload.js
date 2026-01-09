import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Assurons-nous que le dossier 'uploads' existe
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Les fichiers iront dans le dossier racine "uploads"
  },
  filename: (req, file, cb) => {
    // On renomme le fichier pour éviter les doublons : timestamp-nom_fichier
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtre pour n'accepter que les images et PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Format de fichier non supporté (PDF ou Image uniquement)'), false);
  }
};

export const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5MB
  fileFilter: fileFilter
});