// routes/session.routes.js
import express from 'express';
import { sessionController } from '../controllers/session.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Gestion des sessions de formation
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Créer une nouvelle session
 *     tags: [Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date_debut
 *               - date_fin
 *               - id_formation
 *             properties:
 *               date_debut:
 *                 type: string
 *                 format: date-time
 *                 description: Date de début de la session
 *               date_fin:
 *                 type: string
 *                 format: date-time
 *                 description: Date de fin de la session
 *               id_formation:
 *                 type: integer
 *                 description: ID de la formation
 *     responses:
 *       201:
 *         description: Session créée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Formation non trouvée
 */
router.post('/', sessionController.creerSession);

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Consulter le planning de toutes les sessions
 *     tags: [Sessions]
 *     responses:
 *       200:
 *         description: Planning des sessions récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 */
router.get('/', sessionController.consulterPlanning);

/**
 * @swagger
 * /api/sessions/{idSession}:
 *   get:
 *     summary: Obtenir une session par son ID
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: idSession
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la session
 *     responses:
 *       200:
 *         description: Session trouvée
 *       404:
 *         description: Session non trouvée
 */
router.get('/:idSession', sessionController.getSessionById);

/**
 * @swagger
 * /api/sessions/{idSession}:
 *   put:
 *     summary: Modifier une session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: idSession
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_debut:
 *                 type: string
 *                 format: date-time
 *               date_fin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Session modifiée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Session non trouvée
 */
router.put('/:idSession', sessionController.modifierSession);

/**
 * @swagger
 * /api/sessions/{idSession}:
 *   delete:
 *     summary: Supprimer une session
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: idSession
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la session
 *     responses:
 *       200:
 *         description: Session supprimée avec succès
 *       404:
 *         description: Session non trouvée
 */
router.delete('/:idSession', sessionController.supprimerSession);

/**
 * @swagger
 * /api/sessions/formations/{idFormation}:
 *   get:
 *     summary: Obtenir les sessions d'une formation spécifique
 *     tags: [Sessions]
 *     parameters:
 *       - in: path
 *         name: idFormation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Liste des sessions de la formation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *       404:
 *         description: Formation non trouvée
 */
router.get('/formations/:idFormation', sessionController.getSessionsByFormation);

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       properties:
 *         id_session:
 *           type: integer
 *           description: ID unique de la session
 *         date_debut:
 *           type: string
 *           format: date-time
 *           description: Date de début de la session
 *         date_fin:
 *           type: string
 *           format: date-time
 *           description: Date de fin de la session
 *         id_formation:
 *           type: integer
 *           description: ID de la formation associée
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         formation:
 *           $ref: '#/components/schemas/Formation'
 *       required:
 *         - id_session
 *         - date_debut
 *         - date_fin
 *         - id_formation
 * 
 *     Formation:
 *       type: object
 *       properties:
 *         id_formation:
 *           type: integer
 *         nom:
 *           type: string
 *         description:
 *           type: string
 */

export default router;