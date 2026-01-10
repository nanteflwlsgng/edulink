// routes/tranchePaiement.routes.js
import express from 'express';
import { tranchePaiementController } from '../controllers/tranchePaiement.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: TranchesPaiement
 *   description: Gestion des tranches de paiement
 */

/**
 * @swagger
 * /api/tranches:
 *   post:
 *     summary: Ajouter une tranche de paiement
 *     tags: [TranchesPaiement]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_paiement
 *               - montant
 *               - date_echance
 *               - numero_tranche
 *             properties:
 *               id_paiement:
 *                 type: integer
 *               montant:
 *                 type: number
 *               date_echance:
 *                 type: string
 *                 format: date-time
 *               numero_tranche:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Tranche ajoutée avec succès
 *       400:
 *         description: Données invalides
 */
router.post('/', tranchePaiementController.ajouterTranche);

/**
 * @swagger
 * /api/tranches/{idTranche}:
 *   put:
 *     summary: Modifier une tranche de paiement
 *     tags: [TranchesPaiement]
 *     parameters:
 *       - in: path
 *         name: idTranche
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               montant:
 *                 type: number
 *               date_echance:
 *                 type: string
 *                 format: date-time
 *               statut:
 *                 type: string
 *                 enum: [EN_ATTENTE, PAYE, ECHEC, ANNULE, REMBOURSE]
 *     responses:
 *       200:
 *         description: Tranche modifiée avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Tranche non trouvée
 */
router.put('/:idTranche', tranchePaiementController.modifierTranche);

/**
 * @swagger
 * /api/tranches/{idTranche}:
 *   delete:
 *     summary: Supprimer une tranche de paiement
 *     tags: [TranchesPaiement]
 *     parameters:
 *       - in: path
 *         name: idTranche
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tranche supprimée avec succès
 *       404:
 *         description: Tranche non trouvée
 */
router.delete('/:idTranche', tranchePaiementController.supprimerTranche);

/**
 * @swagger
 * /api/tranches/echeances:
 *   get:
 *     summary: Vérifier les tranches en échéance
 *     tags: [TranchesPaiement]
 *     responses:
 *       200:
 *         description: Liste des tranches en échéance
 */
router.get('/echeances', tranchePaiementController.verifierEcheance);

/**
 * @swagger
 * /api/tranches/{idTranche}:
 *   get:
 *     summary: Obtenir une tranche par son ID
 *     tags: [TranchesPaiement]
 *     parameters:
 *       - in: path
 *         name: idTranche
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tranche trouvée
 *       404:
 *         description: Tranche non trouvée
 */
router.get('/:idTranche', tranchePaiementController.getTrancheById);

/**
 * @swagger
 * /api/tranches/paiements/{idPaiement}:
 *   get:
 *     summary: Obtenir les tranches d'un paiement
 *     tags: [TranchesPaiement]
 *     parameters:
 *       - in: path
 *         name: idPaiement
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des tranches du paiement
 */
router.get('/paiements/:idPaiement', tranchePaiementController.getTranchesByPaiement);

export default router;