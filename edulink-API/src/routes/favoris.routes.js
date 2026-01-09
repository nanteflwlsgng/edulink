import express from 'express';
import { FavorisController } from '../controllers/favoris.controller.js';

const router = express.Router();
const favorisController = new FavorisController();


router.post('/toggle', favorisController.toggle);
router.get('/:id_utilisateur', favorisController.getMyFavorites);


export default router;