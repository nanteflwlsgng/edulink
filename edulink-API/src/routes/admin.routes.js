import express from "express";
import {
  getEcolesEnAttente,
  getEcolesParStatut,
  validerEcole,
  rejeterEcole,
  suspendreEcole,
  reactiverEcole,
  supprimerEcole,
  gererUtilisateurs,
  suspendreUtilisateur,
  reactiverUtilisateur,
  voirStatistiques,
  superviserPaiements,
  getNotificationsAdmin
} from "../controllers/admin.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { isAdmin } from "../middlewares/role.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Gestion administrative de la plateforme Edulink
 */

// Toutes les routes admin nécessitent l'authentification et le rôle ADMIN
router.use(authenticate);
router.use(isAdmin);

// 🔹 GESTION DES ÉCOLES

/**
 * @swagger
 * /api/admin/ecoles/en-attente:
 *   get:
 *     summary: Obtenir la liste des écoles en attente de validation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Nombre d'éléments par page
 *     responses:
 *       200:
 *         description: Liste des écoles en attente récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       403:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get("/ecoles/en-attente", getEcolesEnAttente);

/**
 * @swagger
 * /api/admin/ecoles/statut/{statut}:
 *   get:
 *     summary: Obtenir les écoles filtrées par statut
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: statut
 *         required: true
 *         schema:
 *           type: string
 *           enum: [EN_ATTENTE, ACTIF, SUSPENDU, INACTIF]
 *         description: Statut des écoles à filtrer
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
 *         description: Écoles récupérées avec succès
 */
router.get("/ecoles/statut/:statut", getEcolesParStatut);

/**
 * @swagger
 * /api/admin/ecoles/{id}/valider:
 *   put:
 *     summary: Valider une école en attente
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école à valider
 *     responses:
 *       200:
 *         description: École validée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       404:
 *         description: École non trouvée
 */
router.put("/ecoles/:id/valider", validerEcole);

/**
 * @swagger
 * /api/admin/ecoles/{id}/rejeter:
 *   put:
 *     summary: Rejeter une demande d'école
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école à rejeter
 *     responses:
 *       200:
 *         description: Demande d'école rejetée avec succès
 */
router.put("/ecoles/:id/rejeter", rejeterEcole);

/**
 * @swagger
 * /api/admin/ecoles/{id}/suspendre:
 *   put:
 *     summary: Suspendre une école active
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école à suspendre
 *     responses:
 *       200:
 *         description: École suspendue avec succès
 */
router.put("/ecoles/:id/suspendre", suspendreEcole);

/**
 * @swagger
 * /api/admin/ecoles/{id}/reactiver:
 *   put:
 *     summary: Réactiver une école suspendue
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école à réactiver
 *     responses:
 *       200:
 *         description: École réactivée avec succès
 */
router.put("/ecoles/:id/reactiver", reactiverEcole);

/**
 * @swagger
 * /api/admin/ecoles/{id}:
 *   delete:
 *     summary: Supprimer définitivement une école
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école à supprimer
 *     responses:
 *       200:
 *         description: École supprimée avec succès
 *       404:
 *         description: École non trouvée
 */
router.delete("/ecoles/:id", supprimerEcole);

// 🔹 GESTION DES UTILISATEURS

/**
 * @swagger
 * /api/admin/utilisateurs:
 *   get:
 *     summary: Lister tous les utilisateurs avec pagination et filtres
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, ETUDIANT, ECOLE]
 *         description: Filtrer par rôle
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [EN_ATTENTE, ACTIF, SUSPENDU, INACTIF]
 *         description: Filtrer par statut
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get("/utilisateurs", gererUtilisateurs);

/**
 * @swagger
 * /api/admin/utilisateurs/{id}/suspendre:
 *   put:
 *     summary: Suspendre un utilisateur
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à suspendre
 *     responses:
 *       200:
 *         description: Utilisateur suspendu avec succès
 */
router.put("/utilisateurs/:id/suspendre", suspendreUtilisateur);

/**
 * @swagger
 * /api/admin/utilisateurs/{id}/reactiver:
 *   put:
 *     summary: Réactiver un utilisateur suspendu
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à réactiver
 *     responses:
 *       200:
 *         description: Utilisateur réactivé avec succès
 */
router.put("/utilisateurs/:id/reactiver", reactiverUtilisateur);

// 🔹 STATISTIQUES

/**
 * @swagger
 * /api/admin/statistiques:
 *   get:
 *     summary: Obtenir les statistiques globales de la plateforme
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totals:
 *                       type: object
 *                     repartition:
 *                       type: object
 */
router.get("/statistiques", voirStatistiques);

// 🔹 SUPERVISION PAIEMENTS

/**
 * @swagger
 * /api/admin/paiements:
 *   get:
 *     summary: Superviser tous les paiements de la plateforme
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [EN_COURS, TERMINE, ECHOUE]
 *         description: Filtrer par statut de paiement
 *     responses:
 *       200:
 *         description: Liste des paiements récupérée avec succès
 */
router.get("/paiements", superviserPaiements);
/**
 * @swagger
 * /api/admin/notifications:
 *   get:
 *     summary: Récupère les notifications de l'administrateur
 *     description: Permet à un administrateur de consulter la liste de ses notifications.
 *     tags: [Admin - Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Nombre de notifications par page
 *       - in: query
 *         name: lue
 *         schema:
 *           type: boolean
 *         description: Filtrer les notifications par statut "lu" (true) ou "non lu" (false)
 *     responses:
 *       200:
 *         description: Liste des notifications récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     notifications:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Notification'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *       401:
 *         description: Non authentifié (token manquant ou invalide)
 *       403:
 *         description: Accès refusé (rôle non administrateur)
 *       500:
 *         description: Erreur serveur interne
 */
router.get("/notifications", getNotificationsAdmin);

export default router;