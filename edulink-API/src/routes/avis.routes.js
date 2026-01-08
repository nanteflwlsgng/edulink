// routes/avis.routes.js
import express from 'express';
import { avisController } from '../controllers/avis.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Avis
 *   description: Gestion des avis et retours des étudiants
 */

/**
 * @swagger
 * /api/avis:
 *   post:
 *     summary: Ajouter un nouvel avis
 *     tags: [Avis]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_utilisateur
 *               - note
 *               - commentaire
 *             properties:
 *               id_utilisateur:
 *                 type: integer
 *                 description: ID de l'utilisateur (étudiant)
 *               id_ecole:
 *                 type: integer
 *                 description: ID de l'école (optionnel)
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 description: Note entre 1 et 5
 *               commentaire:
 *                 type: string
 *                 description: Commentaire de l'avis
 *     responses:
 *       201:
 *         description: Avis ajouté avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Utilisateur ou école non trouvé
 */
router.post('/', avisController.ajouterAvis);

/**
 * @swagger
 * /api/avis:
 *   get:
 *     summary: Consulter tous les avis
 *     tags: [Avis]
 *     responses:
 *       200:
 *         description: Liste de tous les avis
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avis'
 */
router.get('/', avisController.consulterTousAvis);

/**
 * @swagger
 * /api/avis/{idAvis}:
 *   get:
 *     summary: Obtenir un avis par son ID
 *     tags: [Avis]
 *     parameters:
 *       - in: path
 *         name: idAvis
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis
 *     responses:
 *       200:
 *         description: Avis trouvé
 *       404:
 *         description: Avis non trouvé
 */
router.get('/:idAvis', avisController.getAvisById);

/**
 * @swagger
 * /api/avis/{idAvis}:
 *   put:
 *     summary: Modifier un avis
 *     tags: [Avis]
 *     parameters:
 *       - in: path
 *         name: idAvis
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avis modifié avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Avis non trouvé
 */
router.put('/:idAvis', avisController.modifierAvis);

/**
 * @swagger
 * /api/avis/{idAvis}:
 *   delete:
 *     summary: Supprimer un avis
 *     tags: [Avis]
 *     parameters:
 *       - in: path
 *         name: idAvis
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis
 *     responses:
 *       200:
 *         description: Avis supprimé avec succès
 *       404:
 *         description: Avis non trouvé
 */
router.delete('/:idAvis', avisController.supprimerAvis);

/**
 * @swagger
 * /api/avis/ecoles/{idEcole}:
 *   get:
 *     summary: Consulter les avis d'une école spécifique
 *     tags: [Avis]
 *     parameters:
 *       - in: path
 *         name: idEcole
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école
 *     responses:
 *       200:
 *         description: Avis de l'école avec statistiques
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ecole:
 *                   $ref: '#/components/schemas/Ecole'
 *                 avis:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Avis'
 *                 statistiques:
 *                   type: object
 *                   properties:
 *                     totalAvis:
 *                       type: integer
 *                     noteMoyenne:
 *                       type: number
 *                     distributionNotes:
 *                       type: object
 *       404:
 *         description: École non trouvée
 */
router.get('/ecoles/:idEcole', avisController.consulterAvisEcole);

/**
 * @swagger
 * /api/avis/utilisateurs/{idUtilisateur}:
 *   get:
 *     summary: Obtenir les avis d'un utilisateur spécifique
 *     tags: [Avis]
 *     parameters:
 *       - in: path
 *         name: idUtilisateur
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     responses:
 *       200:
 *         description: Liste des avis de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avis'
 */
router.get('/utilisateurs/:idUtilisateur', avisController.getAvisByUtilisateur);

/**
 * @swagger
 * components:
 *   schemas:
 *     Avis:
 *       type: object
 *       properties:
 *         id_avis:
 *           type: integer
 *           description: ID unique de l'avis
 *         commentaire:
 *           type: string
 *           description: Commentaire de l'avis
 *         note:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Note entre 1 et 5
 *         id_utilisateur:
 *           type: integer
 *           description: ID de l'utilisateur
 *         id_ecole:
 *           type: integer
 *           nullable: true
 *           description: ID de l'école
 *         utilisateur:
 *           $ref: '#/components/schemas/Utilisateur'
 *         ecole:
 *           $ref: '#/components/schemas/Ecole'
 *       required:
 *         - id_avis
 *         - commentaire
 *         - note
 *         - id_utilisateur
 * 
 *     Utilisateur:
 *       type: object
 *       properties:
 *         id_utilisateur:
 *           type: integer
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         email:
 *           type: string
 * 
 *     Ecole:
 *       type: object
 *       properties:
 *         id_ecole:
 *           type: integer
 *         nom:
 *           type: string
 *         description:
 *           type: string
 */

export default router;