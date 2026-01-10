import express from "express";
import {  creerProfilEcole, getProfilEcole,modifierProfilEcole,  supprimerProfilEcole,ajouterFormation,getFormationsEcole,modifierFormation,  supprimerFormation,getEtudiantsInscrits,envoyerNotificationEtudiant,


  
  getStatistiquesEcole,
  genererRapportFinancier,
  exporterListeEtudiants,
  getDashboardStats, 
  getCandidatures, 
  traiterCandidature, 
  getFinances, 
  validerPaiement,
  // Notifications
  getNotifications
} from "../controllers/ecole.controller.js";
import { authenticate } from "../middlewares/auth.js";
import { isEcole } from "../middlewares/isEcole.js";


const router = express.Router();

router.use(authenticate);
router.use(isEcole);

// --- DASHBOARD ---
router.get("/dashboard/stats", getDashboardStats);

// --- CANDIDATURES ---
router.get("/candidatures", getCandidatures);
router.put("/candidatures/:id/traiter", traiterCandidature); // Body: { decision: 'VALIDEE' }

// --- FINANCES ---
router.get("/finances", getFinances);
router.put("/finances/:id/valider", validerPaiement);

/**
 * @swagger
 * tags:
 *   name: Ecole
 *   description: Gestion des écoles et de leurs fonctionnalités
 */

// Middlewares communs
router.use(authenticate);
router.use(isEcole);

// 🔹 PROFIL ECOLE (Accessible à toutes les écoles)

/**
 * @swagger
 * /api/ecoles/profil:
 *   post:
 *     summary: Créer le profil de l'école
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *             properties:
 *               nom:
 *                 type: string
 *                 description: Nom de l'établissement
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               description:
 *                 type: string
 *               site_web:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profil école créé avec succès
 *       400:
 *         description: Données invalides
 */
router.post("/profil", creerProfilEcole);

/**
 * @swagger
 * /api/ecoles/profil:
 *   get:
 *     summary: Obtenir le profil de l'école
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil école récupéré
 *       404:
 *         description: Profil non trouvé
 */
router.get("/profil", getProfilEcole);

/**
 * @swagger
 * /api/ecoles/profil:
 *   put:
 *     summary: Modifier le profil de l'école
 *     tags: [Ecole]
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
 *               adresse:
 *                 type: string
 *               telephone:
 *                 type: string
 *               description:
 *                 type: string
 *               site_web:
 *                 type: string
 *               logo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil modifié avec succès
 */
router.get("/profil", getProfilEcole);


/**
 * @swagger
 * /api/ecoles/profil:
 *   delete:
 *     summary: Supprimer le profil de l'école (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil supprimé avec succès
 *       403:
 *         description: École non validée
 */
router.delete("/profil", supprimerProfilEcole);

// 🔹 GESTION DES FORMATIONS (Réservé aux écoles ACTIVES)

/**
 * @swagger
 * /api/ecoles/formations:
 *   post:
 *     summary: Ajouter une nouvelle formation (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               duree:
 *                 type: integer
 *                 description: Durée en heures
 *               prix:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Formation ajoutée avec succès
 *       403:
 *         description: École non validée
 */
router.post("/formations", ajouterFormation);

/**
 * @swagger
 * /api/ecoles/formations:
 *   get:
 *     summary: Lister les formations de l'école (réservé aux écoles actives)
 *     tags: [Ecole]
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
 *     responses:
 *       200:
 *         description: Liste des formations
 *       403:
 *         description: École non validée
 */
router.get("/formations", getFormationsEcole);

/**
 * @swagger
 * /api/ecoles/formations/{id}:
 *   put:
 *     summary: Modifier une formation (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               duree:
 *                 type: integer
 *               prix:
 *                 type: number
 *     responses:
 *       200:
 *         description: Formation modifiée avec succès
 *       403:
 *         description: École non validée ou formation non trouvée
 */
router.put("/formations/:id", modifierFormation);

/**
 * @swagger
 * /api/ecoles/formations/{id}:
 *   delete:
 *     summary: Supprimer une formation (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formation supprimée avec succès
 *       403:
 *         description: École non validée ou formation non trouvée
 */
router.delete("/formations/:id", supprimerFormation);

// 🔹 GESTION DES ÉTUDIANTS (Réservé aux écoles ACTIVES)

/**
 * @swagger
 * /api/ecoles/etudiants:
 *   get:
 *     summary: Obtenir la liste des étudiants inscrits (réservé aux écoles actives)
 *     tags: [Ecole]
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
 *     responses:
 *       200:
 *         description: Liste des étudiants
 *       403:
 *         description: École non validée
 */
router.get("/etudiants", getEtudiantsInscrits);

/**
 * @swagger
 * /api/ecoles/etudiants/{id}/notifier:
 *   post:
 *     summary: Envoyer une notification à un étudiant (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notification envoyée avec succès
 *       403:
 *         description: École non validée
 */
router.post("/etudiants/:id_etudiant/notifier", envoyerNotificationEtudiant);

// 🔹 STATISTIQUES ET RAPPORTS (Réservé aux écoles ACTIVES)

/**
 * @swagger
 * /api/ecoles/statistiques:
 *   get:
 *     summary: Obtenir les statistiques de l'école (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques récupérées
 *       403:
 *         description: École non validée
 */
router.get("/statistiques", getStatistiquesEcole);

/**
 * @swagger
 * /api/ecoles/rapports/financier:
 *   get:
 *     summary: Générer un rapport financier (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rapport financier généré
 *       403:
 *         description: École non validée
 */
router.get("/rapports/financier", genererRapportFinancier);

/**
 * @swagger
 * /api/ecoles/export/etudiants:
 *   get:
 *     summary: Exporter la liste des étudiants (réservé aux écoles actives)
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *           enum: [json, excel, pdf]
 *           default: json
 *     responses:
 *       200:
 *         description: Données exportées
 *       403:
 *         description: École non validée
 */
router.get("/export/etudiants", exporterListeEtudiants);

// 🔹 NOTIFICATIONS (Accessible à toutes les écoles)

/**
 * @swagger
 * /api/ecoles/notifications:
 *   get:
 *     summary: Obtenir les notifications de l'école
 *     tags: [Ecole]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications récupérées
 */
router.get("/notifications", getNotifications);

export default router;