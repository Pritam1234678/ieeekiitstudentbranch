import { Router } from 'express';
import { loginAdmin, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/login', loginAdmin);
router.get('/me', authenticateToken, getMe);

export default router;
