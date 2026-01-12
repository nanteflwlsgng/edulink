// routes/paiement.routes.js
import express from 'express';
import { paiementController } from '../controllers/paiement.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Paiements
 *   description: Gestion des transactions de paiement
 */

/**
 * @swagger
 * /api/paiements:
 *   post:
 *     summary: Effectuer un paiement
 *     tags: [Paiements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mode_paiement
 *               - raison_paiement
 *               - montant_total
 *             properties:
 *               id_inscription:
 *                 type: integer
 *                 description: ID de l'inscription (optionnel)
 *               mode_paiement:
 *                 type: string
 *                 enum: [UNIQUE, MENSUEL, TRANCHE, GRATUIT]
 *                 description: Mode de paiement
 *               methode_paiement:
 *                 type: string
 *                 enum: [CARTE, MOBILE_MONEY, ESPECES, VIREMENT]
 *                 description: Méthode de paiement (requis sauf pour GRATUIT)
 *               raison_paiement:
 *                 type: string
 *                 enum: [INSCRIPTION, DROIT_CONCOURS, FRAIS_GENERAUX, FRAIS_FORMATION, AUTRE]
 *                 description: Raison du paiement
 *               montant_total:
 *                 type: number
 *                 format: float
 *                 description: Montant total
 *               details:
 *                 type: object
 *                 description: Détails spécifiques
 *                 properties:
 *                   tokenPaiement:
 *                     type: string
 *                     description: Token de carte (pour CARTE)
 *                   telephone:
 *                     type: string
 *                     description: Numéro de téléphone (pour MOBILE_MONEY)
 *                   operator:
 *                     type: string
 *                     description: Opérateur mobile (pour MOBILE_MONEY)
 *                   nombreTranches:
 *                     type: integer
 *                     description: Nombre de tranches (pour TRANCHE)
 *     responses:
 *       201:
 *         description: Paiement effectué avec succès
 *       400:
 *         description: Données invalides ou échec du paiement
 */
router.post('/', paiementController.effectuerPaiement);

/**
 * @swagger
 * /api/paiements/tranches/{idTranche}/paiement:
 *   post:
 *     summary: Payer une tranche spécifique
 *     tags: [Paiements]
 *     parameters:
 *       - in: path
 *         name: idTranche
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tranche
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - methode_paiement
 *             properties:
 *               methode_paiement:
 *                 type: string
 *                 enum: [CARTE, MOBILE_MONEY, ESPECES, VIREMENT]
 *               details:
 *                 type: object
 *                 properties:
 *                   tokenPaiement:
 *                     type: string
 *                   telephone:
 *                     type: string
 *                   operator:
 *                     type: string
 *     responses:
 *       200:
 *         description: Tranche payée avec succès
 *       400:
 *         description: Erreur de paiement
 *       404:
 *         description: Tranche non trouvée
 */
router.post('/tranches/:idTranche/paiement', paiementController.traiterPaiementTranche);

/**
 * @swagger
 * /api/paiements/{idPaiement}/statut:
 *   get:
 *     summary: Vérifier le statut d'un paiement
 *     tags: [Paiements]
 *     parameters:
 *       - in: path
 *         name: idPaiement
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du paiement
 *     responses:
 *       200:
 *         description: Statut du paiement récupéré
 *       404:
 *         description: Paiement non trouvé
 */
router.get('/:idPaiement/statut', paiementController.verifierStatutPaiement);

/**
 * @swagger
 * /api/paiements/{idPaiement}/statut:
 *   put:
 *     summary: Mettre à jour le statut d'un paiement
 *     tags: [Paiements]
 *     parameters:
 *       - in: path
 *         name: idPaiement
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du paiement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - statut
 *             properties:
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, PAYE, ECHEC, ANNULE, REMBOURSE]
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Paiement non trouvé
 */
router.put('/:idPaiement/statut', paiementController.mettreAJourStatut);

/**
 * @swagger
 * /api/paiements/{idPaiement}/recu:
 *   get:
 *     summary: Générer un reçu de paiement
 *     tags: [Paiements]
 *     parameters:
 *       - in: path
 *         name: idPaiement
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du paiement
 *     responses:
 *       200:
 *         description: Reçu généré avec succès
 *       404:
 *         description: Paiement non trouvé
 */
router.get('/:idPaiement/recu', paiementController.genererRecu);

/**
 * @swagger
 * /api/paiements/{idPaiement}:
 *   get:
 *     summary: Obtenir un paiement par son ID
 *     tags: [Paiements]
 *     parameters:
 *       - in: path
 *         name: idPaiement
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du paiement
 *     responses:
 *       200:
 *         description: Paiement trouvé
 *       404:
 *         description: Paiement non trouvé
 */
router.get('/:idPaiement', paiementController.getPaiementById);

/**
 * @swagger
 * /api/paiements/inscriptions/{idInscription}:
 *   get:
 *     summary: Obtenir les paiements d'une inscription
 *     tags: [Paiements]
 *     parameters:
 *       - in: path
 *         name: idInscription
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'inscription
 *     responses:
 *       200:
 *         description: Liste des paiements de l'inscription
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paiement'
 */
router.get('/inscriptions/:idInscription', paiementController.getPaiementsByInscription);

/**
 * @swagger
 * /api/paiements/tranches/retard:
 *   get:
 *     summary: Obtenir les tranches de paiement en retard
 *     tags: [Paiements]
 *     responses:
 *       200:
 *         description: Liste des tranches en retard
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TranchePaiement'
 */
router.get('/tranches/retard', paiementController.getTranchesEnRetard);

/**
 * @swagger
 * components:
 *   schemas:
 *     Paiement:
 *       type: object
 *       properties:
 *         id_paiement:
 *           type: integer
 *         mode_paiement:
 *           type: string
 *           enum: [UNIQUE, MENSUEL, TRANCHE, GRATUIT]
 *         methode_paiement:
 *           type: string
 *           enum: [CARTE, MOBILE_MONEY, ESPECES, VIREMENT]
 *         raison_paiement:
 *           type: string
 *           enum: [INSCRIPTION, DROIT_CONCOURS, FRAIS_GENERAUX, FRAIS_FORMATION, AUTRE]
 *         montant_total:
 *           type: number
 *           format: float
 *         statut:
 *           type: string
 *           enum: [EN_ATTENTE, PAYE, ECHEC, ANNULE, REMBOURSE]
 *         date_paiement:
 *           type: string
 *           format: date-time
 *         id_inscription:
 *           type: integer
 *         inscription:
 *           $ref: '#/components/schemas/Inscription'
 *         tranches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TranchePaiement'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     TranchePaiement:
 *       type: object
 *       properties:
 *         id_tranche:
 *           type: integer
 *         montant:
 *           type: number
 *         date_echance:
 *           type: string
 *           format: date-time
 *         statut:
 *           type: string
 *         date_paiement:
 *           type: string
 *           format: date-time
 *         numero_tranche:
 *           type: integer
 *         id_paiement:
 *           type: integer
 * 
 *     Inscription:
 *       type: object
 *       properties:
 *         id_inscription:
 *           type: integer
 *         etudiant:
 *           $ref: '#/components/schemas/Etudiant'
 *         formation:
 *           $ref: '#/components/schemas/Formation'
 */
// routes/paiement.routes.js

// Ajoutez cette ligne (par exemple avant les routes avec :id)
router.get('/ecoles/finances', paiementController.getFinances);
// Nouvelle route pour l'action du bouton "Confirmer"
router.put('/:idPaiement/valider', paiementController.validerTransactionEcole);
export default router;