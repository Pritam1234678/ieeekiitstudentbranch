import express from 'express';
import { submitContactForm } from '../controllers/contactController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Strict rate limiter for the contact route: 3 requests per hour per IP
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 3, 
    standardHeaders: true, 
    legacyHeaders: false, 
    message: { success: false, message: 'You have sent too many messages. Please try again later.' },
});

router.post('/', contactLimiter, submitContactForm);

export default router;
