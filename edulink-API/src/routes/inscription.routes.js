import express from 'express';
import { InscriptionController } from '../controllers/inscription.controller.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();
const inscriptionController = new InscriptionController();
router.get('/mes-candidatures/:id_utilisateur', (req, res) => inscriptionController.recupererCandidaturesEtudiant(req, res));

const uploadFields = upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'lettre_motivation', maxCount: 1 },
  { name: 'releve_notes', maxCount: 1 },
  { name: 'piece_identite', maxCount: 1 }
]);
router.post('/', uploadFields, (req, res) => 
  inscriptionController.creerCandidature(req, res)
);
/**
 * @swagger
 * tags:
 *   name: Inscriptions
 *   description: Gestion des inscriptions aux formations
 */

/**
 * @swagger
 * /api/inscriptions:
 *   post:
 *     summary: Créer une nouvelle inscription
 *     tags: [Inscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_etudiant
 *               - id_formation
 *             properties:
 *               id_etudiant:
 *                 type: integer
 *               id_formation:
 *                 type: integer
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, VALIDEE, ANNULEE]
 *                 default: EN_ATTENTE
 *     responses:
 *       201:
 *         description: Inscription créée avec succès
 *       400:
 *         description: Erreur lors de la création
 */


/**
 * @swagger
 * /api/inscriptions/{id_inscription}/valider:
 *   patch:
 *     summary: Valider une inscription
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'inscription
 *     responses:
 *       200:
 *         description: Inscription validée avec succès
 *       400:
 *         description: Erreur lors de la validation
 */
router.patch('/:id_inscription/valider', inscriptionController.validerInscription);

/**
 * @swagger
 * /api/inscriptions/{id_inscription}/annuler:
 *   patch:
 *     summary: Annuler une inscription
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'inscription
 *     responses:
 *       200:
 *         description: Inscription annulée avec succès
 *       400:
 *         description: Erreur lors de l'annulation
 */
router.patch('/:id_inscription/annuler', inscriptionController.annulerInscription);

/**
 * @swagger
 * /api/inscriptions/{id_inscription}/statut:
 *   get:
 *     summary: Consulter le statut d'une inscription
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'inscription
 *     responses:
 *       200:
 *         description: Statut de l'inscription
 *       400:
 *         description: Erreur lors de la consultation
 */
router.get('/:id_inscription/statut', inscriptionController.consulterStatut);
/**
 * @swagger
 * /api/inscriptions/{id_inscription}/recu:
 *   get:
 *     summary: Générer un reçu d'inscription (retourne JSON avec infos)
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Informations du reçu généré
 *       400:
 *         description: Erreur lors de la génération
 */
router.get('/:id_inscription/recu', inscriptionController.genererRecuInscription);

/**
 * @swagger
 * /api/inscriptions/{id_inscription}/recu/pdf:
 *   get:
 *     summary: Télécharger le reçu en PDF directement
 *     tags: [Inscriptions]
 *     parameters:
 *       - in: path
 *         name: id_inscription
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: PDF du reçu
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Erreur lors de la génération
 */
router.get('/:id_inscription/recu/pdf', inscriptionController.downloadRecuPDF);
export default router;