import { NextFunction, Request, Response, Router } from 'express';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import { loginAdmin, getMe, logoutAdmin } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || 'unknown-ip';
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  skip: (req) => req.method === 'OPTIONS',
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : 'unknown-email';
    return `${getClientIp(req)}:${email}`;
  },
  message: { success: false, error: 'Too many login attempts, please try again after 15 minutes' },
});

const botBlocker = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  if (/curl|wget|python|postman|insomnia/i.test(userAgent)) {
    return res.status(403).json({ success: false, error: 'Bots not allowed' });
  }
  next();
};

const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isString()
    .withMessage('Password is required')
    .isLength({ min: 8, max: 128 })
    .withMessage('Password must be between 8 and 128 characters'),
];

router.post('/login', loginLimiter, botBlocker, loginValidation, loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', authenticateToken, getMe);

export default router;
