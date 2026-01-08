// routes/evaluation.routes.js
import express from 'express';
import { evaluationController } from '../controllers/evaluation.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Evaluations
 *   description: Gestion des processus d'évaluation et d'admission
 */

/**
 * @swagger
 * /api/evaluations/formations/{idFormation}:
 *   post:
 *     summary: Créer une nouvelle évaluation pour une formation
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: idFormation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type_admission
 *             properties:
 *               type_admission:
 *                 type: string
 *                 enum: [DIRECT, DOSSIER, CONCOURS, MIXTE]
 *                 description: Type d'admission
 *               date_debut_depot_dossier:
 *                 type: string
 *                 format: date-time
 *                 description: Date de début de dépôt des dossiers
 *               date_fin_depot_dossier:
 *                 type: string
 *                 format: date-time
 *                 description: Date de fin de dépôt des dossiers
 *               date_debut_concours:
 *                 type: string
 *                 format: date-time
 *                 description: Date de début du concours
 *               date_fin_concours:
 *                 type: string
 *                 format: date-time
 *                 description: Date de fin du concours
 *               date_resultat:
 *                 type: string
 *                 format: date-time
 *                 description: Date de publication des résultats
 *               resultat:
 *                 type: string
 *                 description: Résultat de l'évaluation
 *     responses:
 *       201:
 *         description: Évaluation créée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Formation non trouvée
 */
router.post('/formations/:idFormation', evaluationController.ajouterEvaluation);

/**
 * @swagger
 * /api/evaluations:
 *   get:
 *     summary: Lister toutes les évaluations
 *     tags: [Evaluations]
 *     responses:
 *       200:
 *         description: Liste des évaluations récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluation'
 */
router.get('/', evaluationController.consulterEvaluations);

/**
 * @swagger
 * /api/evaluations/{idEvaluation}:
 *   get:
 *     summary: Obtenir une évaluation par son ID
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: idEvaluation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'évaluation
 *     responses:
 *       200:
 *         description: Évaluation trouvée
 *       404:
 *         description: Évaluation non trouvée
 */
router.get('/:idEvaluation', evaluationController.getEvaluationById);

/**
 * @swagger
 * /api/evaluations/{idEvaluation}:
 *   put:
 *     summary: Modifier une évaluation
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: idEvaluation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'évaluation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type_admission:
 *                 type: string
 *                 enum: [DIRECT, DOSSIER, CONCOURS, MIXTE]
 *               date_debut_depot_dossier:
 *                 type: string
 *                 format: date-time
 *               date_fin_depot_dossier:
 *                 type: string
 *                 format: date-time
 *               date_debut_concours:
 *                 type: string
 *                 format: date-time
 *               date_fin_concours:
 *                 type: string
 *                 format: date-time
 *               date_resultat:
 *                 type: string
 *                 format: date-time
 *               resultat:
 *                 type: string
 *     responses:
 *       200:
 *         description: Évaluation modifiée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Évaluation non trouvée
 */
router.put('/:idEvaluation', evaluationController.modifierEvaluation);

/**
 * @swagger
 * /api/evaluations/{idEvaluation}:
 *   delete:
 *     summary: Supprimer une évaluation
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: idEvaluation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'évaluation
 *     responses:
 *       200:
 *         description: Évaluation supprimée avec succès
 *       404:
 *         description: Évaluation non trouvée
 */
router.delete('/:idEvaluation', evaluationController.supprimerEvaluation);

/**
 * @swagger
 * /api/evaluations/formations/{idFormation}/evaluations:
 *   get:
 *     summary: Obtenir les évaluations d'une formation spécifique
 *     tags: [Evaluations]
 *     parameters:
 *       - in: path
 *         name: idFormation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Liste des évaluations de la formation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluation'
 *       404:
 *         description: Formation non trouvée
 */
router.get('/formations/:idFormation/evaluations', evaluationController.getEvaluationsByFormation);

/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluation:
 *       type: object
 *       properties:
 *         id_evaluation:
 *           type: integer
 *           description: ID unique de l'évaluation
 *         type_admission:
 *           type: string
 *           enum: [DIRECT, DOSSIER, CONCOURS, MIXTE]
 *           description: Type d'admission
 *         date_debut_depot_dossier:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         date_fin_depot_dossier:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         date_debut_concours:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         date_fin_concours:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         date_resultat:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         resultat:
 *           type: string
 *           nullable: true
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
 *         - id_evaluation
 *         - type_admission
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