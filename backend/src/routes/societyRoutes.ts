import { Router } from 'express';
import {
  getAllSocieties,
  getSociety,
  createNewSociety,
  updateExistingSociety,
  removeSociety,
} from '../controllers/societyController';

import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getAllSocieties);
router.get('/:id', getSociety);
router.post('/', authenticateToken, createNewSociety);
router.put('/:id', authenticateToken, updateExistingSociety);
router.delete('/:id', authenticateToken, removeSociety);

export default router;
