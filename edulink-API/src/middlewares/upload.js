import multer from "multer";
import path from "path";
import fs from "fs";

// Assurer que le dossier existe
const uploadDir = "uploads/formations/";
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Nom unique : timestamp + extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'formation-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées !"), false);
  }
};

export const uploadFormationImage = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite 5MB
  fileFilter: fileFilter
});