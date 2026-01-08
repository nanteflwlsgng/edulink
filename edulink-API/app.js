// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import utilisateurRoutes from "./src/routes/utilisateur.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import ecoleRoutes from "./src/routes/ecole.routes.js";
import { setupSwagger } from "./src/swagger.js";
import etudiantRoutes from './src/routes/etudiant.routes.js';
import formationRoutes from './src/routes/formation.routes.js';
import inscriptionRoutes from './src/routes/inscription.routes.js';
import evaluationRoutes from './src/routes/evaluation.routes.js';
import sessionRoutes from './src/routes/session.routes.js';
import avisRoutes from './src/routes/avis.routes.js';
import carteEtudiantRoutes from './src/routes/carteEtudiant.routes.js';
import paiementRoutes from './src/routes/paiement.routes.js';
import tranchePaiementRoutes from './src/routes/tranchePaiement.routes.js';

// Charger les variables d'environnement (.env)
dotenv.config();

// Créer l'application Express
const app = express();

// Middlewares globaux
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));
app.use(express.json());

// Test de route de base
app.get("/", (req, res) => {
  res.send("🚀 Bienvenue sur l’API Edulink !");
});
// 📘 Initialiser Swagger
setupSwagger(app);
// Routes principales
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ecoles", ecoleRoutes);
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/formations', formationRoutes);
app.use('/api/inscriptions', inscriptionRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/avis', avisRoutes);
app.use('/api/cartes-etudiant', carteEtudiantRoutes);
app.use('/api/paiements', paiementRoutes);
app.use('/api/tranches', tranchePaiementRoutes);
// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Port (venant du .env ou défaut 5000)
const PORT = process.env.PORT || 5000;

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
