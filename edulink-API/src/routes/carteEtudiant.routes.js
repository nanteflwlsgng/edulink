// routes/carteEtudiant.routes.js
import express from 'express';
import { carteEtudiantController } from '../controllers/carteEtudiant.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CartesEtudiant
 *   description: Gestion des cartes étudiantes numériques
 */

/**
 * @swagger
 * /api/cartes-etudiant/etudiants/{idEtudiant}:
 *   post:
 *     summary: Générer une nouvelle carte étudiante
 *     tags: [CartesEtudiant]
 *     parameters:
 *       - in: path
 *         name: idEtudiant
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant
 *     responses:
 *       201:
 *         description: Carte étudiante générée avec succès
 *       400:
 *         description: Données invalides ou carte déjà existante
 *       404:
 *         description: Étudiant non trouvé
 */
router.post('/etudiants/:idEtudiant', carteEtudiantController.genererCarteEtudiant);

/**
 * @swagger
 * /api/cartes-etudiant/{idCarte}/qrcode:
 *   get:
 *     summary: Afficher les données QR Code d'une carte étudiante
 *     tags: [CartesEtudiant]
 *     parameters:
 *       - in: path
 *         name: idCarte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carte étudiante
 *     responses:
 *       200:
 *         description: Données QR Code récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 qrCodeData:
 *                   type: object
 *                   properties:
 *                     numeroCarte:
 *                       type: string
 *                     etudiant:
 *                       type: string
 *                     dateEmission:
 *                       type: string
 *                       format: date-time
 *                     statut:
 *                       type: string
 *       404:
 *         description: Carte étudiante non trouvée
 */
router.get('/:idCarte/qrcode', carteEtudiantController.afficherQRCode);

/**
 * @swagger
 * /api/cartes-etudiant/{idCarte}/renouveler:
 *   post:
 *     summary: Renouveler une carte étudiante (désactive l'ancienne et crée une nouvelle)
 *     tags: [CartesEtudiant]
 *     parameters:
 *       - in: path
 *         name: idCarte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carte étudiante à renouveler
 *     responses:
 *       200:
 *         description: Carte renouvelée avec succès
 *       400:
 *         description: Erreur lors du renouvellement
 *       404:
 *         description: Carte étudiante non trouvée
 */
router.post('/:idCarte/renouveler', carteEtudiantController.renouvelerCarte);

/**
 * @swagger
 * /api/cartes-etudiant/{idCarte}/desactiver:
 *   put:
 *     summary: Désactiver une carte étudiante
 *     tags: [CartesEtudiant]
 *     parameters:
 *       - in: path
 *         name: idCarte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carte étudiante
 *     responses:
 *       200:
 *         description: Carte désactivée avec succès
 *       400:
 *         description: Erreur lors de la désactivation
 *       404:
 *         description: Carte étudiante non trouvée
 */
router.put('/:idCarte/desactiver', carteEtudiantController.desactiverCarte);

/**
 * @swagger
 * /api/cartes-etudiant/{idCarte}:
 *   get:
 *     summary: Obtenir une carte étudiante par son ID
 *     tags: [CartesEtudiant]
 *     parameters:
 *       - in: path
 *         name: idCarte
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la carte étudiante
 *     responses:
 *       200:
 *         description: Carte étudiante trouvée
 *       404:
 *         description: Carte étudiante non trouvée
 */
router.get('/:idCarte', carteEtudiantController.getCarteById);

/**
 * @swagger
 * /api/cartes-etudiant/etudiants/{idEtudiant}:
 *   get:
 *     summary: Obtenir les cartes d'un étudiant
 *     tags: [CartesEtudiant]
 *     parameters:
 *       - in: path
 *         name: idEtudiant
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'étudiant
 *     responses:
 *       200:
 *         description: Liste des cartes de l'étudiant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarteEtudiant'
 */
router.get('/etudiants/:idEtudiant', carteEtudiantController.getCartesByEtudiant);

/**
 * @swagger
 * components:
 *   schemas:
 *     CarteEtudiant:
 *       type: object
 *       properties:
 *         id_carte:
 *           type: integer
 *         numero_carte:
 *           type: string
 *         date_emission:
 *           type: string
 *           format: date-time
 *         statut:
 *           type: string
 *           enum: [ACTIF, INACTIF, EXPIRE]
 *         id_etudiant:
 *           type: integer
 *         etudiant:
 *           $ref: '#/components/schemas/Etudiant'
 * 
 *     Etudiant:
 *       type: object
 *       properties:
 *         id_etudiant:
 *           type: integer
 *         utilisateur:
 *           $ref: '#/components/schemas/Utilisateur'
 * 
 *     Utilisateur:
 *       type: object
 *       properties:
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         email:
 *           type: string
 */
export default router;