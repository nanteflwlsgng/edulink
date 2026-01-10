import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAllUsers,
} from "../controllers/utilisateur.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs (inscription, connexion, profil, etc.)
 */

/**
 * @swagger
 * /utilisateurs:
 *   get:
 *     summary: Récupérer la liste de tous les utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /utilisateurs/register:
 *   post:
 *     summary: Inscription d’un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - email
 *               - motDePasse
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *               motDePasse:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur lors de l'inscription
 */
router.post("/register", register);

/**
 * @swagger
 * /utilisateurs/login:
 *   post:
 *     summary: Connexion d’un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *               motDePasse:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion réussie (retourne un token JWT)
 *       401:
 *         description: Identifiants invalides
 */
router.post("/login", login);

/**
 * @swagger
 * /utilisateurs/me:
 *   get:
 *     summary: Récupérer le profil de l’utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l’utilisateur connecté
 *       401:
 *         description: Non autorisé
 */
router.get("/me", authenticate, getProfile);

/**
 * @swagger
 * /utilisateurs/update:
 *   put:
 *     summary: Mettre à jour le profil de l’utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Jean Dupont
 *               email:
 *                 type: string
 *                 example: jean@example.com
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       401:
 *         description: Non autorisé
 */
router.put("/update", authenticate, updateProfile);

/**
 * @swagger
 * /utilisateurs/change-password:
 *   put:
 *     summary: Changer le mot de passe de l’utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ancienMotDePasse
 *               - nouveauMotDePasse
 *             properties:
 *               ancienMotDePasse:
 *                 type: string
 *                 example: "123456"
 *               nouveauMotDePasse:
 *                 type: string
 *                 example: "654321"
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *       400:
 *         description: Ancien mot de passe incorrect
 *       401:
 *         description: Non autorisé
 */
router.put("/change-password", authenticate, changePassword);

/**
 * @swagger
 * /utilisateurs/delete:
 *   delete:
 *     summary: Supprimer le compte de l’utilisateur connecté
 *     tags: [Utilisateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compte supprimé avec succès
 *       401:
 *         description: Non autorisé
 */
router.delete("/delete", authenticate, deleteAccount);

export default router;
