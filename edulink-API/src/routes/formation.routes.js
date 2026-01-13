import express from 'express';
import { FormationController } from '../controllers/formation.controller.js';
import { uploadFormationImage } from "../middlewares/upload.js";
import { authenticate } from "../middlewares/auth.js"; // On sécurise la route
import { isEcole } from "../middlewares/isEcole.js";
const router = express.Router();
const formationController = new FormationController();
/**
 * @swagger
 * tags:
 *   name: Formations
 *   description: Gestion des formations
 */

// ✅ ROUTE DE CRÉATION (CORRIGÉE)
// On utilise authenticate + isEcole + uploadFormationImage
router.post("/", 
  authenticate, 
  isEcole, 
  uploadFormationImage.single('image'), 
  (req, res) => formationController.creerFormation(req, res)
);
router.get('/mine', authenticate, isEcole, (req, res) => formationController.listerMesFormations(req, res));
router.get('/:id', (req, res) => formationController.getOneFormation(req, res));

router.get("/", (req, res) => formationController.listerFormations(req, res));
/**
 * @swagger
 * tags:
 *   name: Formations
 *   description: Gestion des formations et de leurs sessions
 */

/**
 * @swagger
 * /api/formations/{id_formation}/sessions:
 *   post:
 *     summary: Ajouter une session à une formation
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id_formation
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
 *               - date_debut
 *               - date_fin
 *             properties:
 *               date_debut:
 *                 type: string
 *                 format: date-time
 *               date_fin:
 *                 type: string
 *                 format: date-time
 *               lieu:
 *                 type: string
 *               places_max:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Session ajoutée avec succès
 *       400:
 *         description: Erreur lors de l'ajout de la session
 */


router.post('/:id_formation/sessions', formationController.ajouterSession);

/**
 * @swagger
 * /api/formations/{id_formation}:
 *   put:
 *     summary: Modifier une formation
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id_formation
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
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               duree:
 *                 type: integer
 *               prix:
 *                 type: number
 *               statut:
 *                 type: string
 *                 enum: [ACTIF, INACTIF]
 *     responses:
 *       200:
 *         description: Formation modifiée avec succès
 *       400:
 *         description: Erreur lors de la modification
 */
router.put('/:id_formation', 
  authenticate, 
  isEcole, 
  uploadFormationImage.single('image'), // <--- TRES IMPORTANT : Pour lire le FormData
  (req, res) => formationController.modifierFormation(req, res)
);

/**
 * @swagger
 * /api/formations/{id_formation}:
 *   delete:
 *     summary: Supprimer une formation
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id_formation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Formation supprimée avec succès
 *       400:
 *         description: Erreur lors de la suppression
 */
router.delete('/:id_formation', formationController.supprimerFormation);

/**
 * @swagger
 * /api/formations/{id_formation}/etudiants:
 *   get:
 *     summary: Consulter les étudiants inscrits à une formation
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id_formation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Liste des étudiants inscrits
 *       400:
 *         description: Erreur lors de la récupération
 */
router.get('/:id_formation/etudiants', formationController.consulterEtudiantsInscrits);

/**
 * @swagger
 * /api/formations/{id_formation}/evaluations/{id_etudiant}:
 *   post:
 *     summary: Évaluer un étudiant dans une formation
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id_formation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formation
 *       - in: path
 *         name: id_etudiant
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - note
 *             properties:
 *               note:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 20
 *               commentaire:
 *                 type: string
 *     responses:
 *       200:
 *         description: Évaluation enregistrée avec succès
 *       400:
 *         description: Erreur lors de l'évaluation
 */
router.post('/:id_formation/evaluations/:id_etudiant', formationController.evaluerEtudiant);

/**
 * @swagger
 * /api/formations/{id_formation}/statistiques:
 *   get:
 *     summary: Voir les statistiques d'inscription d'une formation
 *     tags: [Formations]
 *     parameters:
 *       - in: path
 *         name: id_formation
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la formation
 *     responses:
 *       200:
 *         description: Statistiques de la formation
 *       400:
 *         description: Erreur lors de la récupération des statistiques
 */
router.get('/:id_formation/statistiques', formationController.voirStatistiquesInscription);

export default router;