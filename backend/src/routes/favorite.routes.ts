import express from 'express';
import * as favoriteController from '../controllers/favorite.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticate);

router.get('/', favoriteController.getFavorites);
router.post('/toggle', favoriteController.toggleFavorite);
router.post('/sync', favoriteController.syncFavorites);

export default router;
