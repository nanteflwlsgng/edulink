import express from "express";
import {
  // Profil
  getProfilEtudiant,
  
  modifierProfilEtudiant,
  // Recherche
  rechercherEcoles,
  consulterProfilEcole,
  // Formations
  sinscrireFormation,
  // Paiement
  payerEcolage,
  // Carte étudiante
  telechargerCarteEtudiant,
  // Avis
  laisserAvis,
  // Notifications
  getNotificationsEtudiant,telechargerCarte 
} from "../controllers/etudiant.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { isEtudiant } from "../middlewares/isEtudiant.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Etudiant
 *   description: Gestion des étudiants et de leurs fonctionnalités
 */

// Middlewares communs
router.use(authenticate);
router.use(isEtudiant);

// 🔹 PROFIL ETUDIANT

/**
 * @swagger
 * /api/etudiants/profil:
 *   post:
 *     summary: Créer le profil de l'étudiant
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_naissance:
 *                 type: string
 *                 format: date
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profil étudiant créé avec succès
 *       400:
 *         description: Données invalides
 */
// router.post("/profil", creerProfilEtudiant);

/**
 * @swagger
 * /api/etudiants/profil:
 *   get:
 *     summary: Obtenir le profil de l'étudiant
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil étudiant récupéré
 *       404:
 *         description: Profil non trouvé
 */
router.get("/profil", getProfilEtudiant);

/**
 * @swagger
 * /api/etudiants/profil:
 *   put:
 *     summary: Modifier le profil de l'étudiant
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_naissance:
 *                 type: string
 *                 format: date
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil modifié avec succès
 */
router.put("/profil", modifierProfilEtudiant);

// 🔹 RECHERCHE D'ÉCOLES

/**
 * @swagger
 * /api/etudiants/ecoles/recherche:
 *   get:
 *     summary: Rechercher des écoles
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: nom
 *         schema:
 *           type: string
 *         description: Nom de l'école à rechercher
 *       - in: query
 *         name: specialite
 *         schema:
 *           type: string
 *         description: Spécialité de formation
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Liste des écoles correspondantes
 */
router.get("/ecoles/recherche", rechercherEcoles);

/**
 * @swagger
 * /api/etudiants/ecoles/{id_ecole}:
 *   get:
 *     summary: Consulter le profil d'une école
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_ecole
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Profil école récupéré
 *       404:
 *         description: École non trouvée
 */
router.get("/ecoles/:id_ecole", consulterProfilEcole);

// 🔹 INSCRIPTIONS FORMATIONS

/**
 * @swagger
 * /api/etudiants/formations/{id_formation}/inscrire:
 *   post:
 *     summary: S'inscrire à une formation
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_formation
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Inscription effectuée avec succès
 *       404:
 *         description: Formation non trouvée
 */
router.post("/formations/:id_formation/inscrire", sinscrireFormation);

// 🔹 PAIEMENTS

/**
 * @swagger
 * /api/etudiants/paiements/{id_inscription}/payer:
 *   post:
 *     summary: Payer l'écolage d'une formation
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - montant
 *             properties:
 *               montant:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Paiement initié avec succès
 *       404:
 *         description: Inscription non trouvée
 */
router.post("/paiements/:id_inscription/payer", payerEcolage);

// 🔹 CARTE ÉTUDIANTE

/**
 * @swagger
 * /api/etudiants/carte:
 *   get:
 *     summary: Télécharger la carte étudiante
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carte étudiante générée avec succès
 *       404:
 *         description: Étudiant non trouvé
 */
router.get("/carte", telechargerCarteEtudiant);

// 🔹 AVIS

/**
 * @swagger
 * /api/etudiants/ecoles/{id_ecole}/avis:
 *   post:
 *     summary: Laisser un avis sur une école
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_ecole
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentaire
 *               - note
 *             properties:
 *               commentaire:
 *                 type: string
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Avis publié avec succès
 *       400:
 *         description: Vous devez être inscrit à une formation de cette école
 */
router.post("/ecoles/:id_ecole/avis", laisserAvis);

// 🔹 NOTIFICATIONS

/**
 * @swagger
 * /api/etudiants/notifications:
 *   get:
 *     summary: Obtenir les notifications de l'étudiant
 *     tags: [Etudiant]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications récupérées
 */
router.get("/notifications", getNotificationsEtudiant);
router.get('/:id_inscription/carte', telechargerCarte);

export default router; 