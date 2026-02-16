import express from 'express';
import {
  getSocieties,
  getSociety,
  addSociety,
  editSociety,
  removeSociety,
} from '../controllers/societyController';

import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getSocieties);
router.get('/:id', getSociety);

// Protected routes (admin only)
router.post('/', authenticateToken, addSociety);
router.put('/:id', authenticateToken, editSociety);
router.delete('/:id', authenticateToken, removeSociety);

export default router;
