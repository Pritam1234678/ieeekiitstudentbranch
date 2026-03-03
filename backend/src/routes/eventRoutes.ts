import { Router } from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
  uploadEventImages,
  deleteEventImage
} from '../controllers/eventController';
import { authenticateToken } from '../middleware/authMiddleware';
import { body } from 'express-validator';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

// Validation middleware
const createEventValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters (Debug: Check Title)'),
  body('start_time')
    .isISO8601()
    .withMessage('start_time must be a valid ISO 8601 date'),
  body('end_time')
    .isISO8601()
    .withMessage('end_time must be a valid ISO 8601 date'),
  body('image_url')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('image_url cannot be empty if provided'),
  body('description')
    .optional()
    .trim(),
];

// Public routes
router.get('/', getAllEvents);
router.get('/stats', getEventStats);
router.get('/:id', getEventById);

// Protected routes
router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  createEventValidation,
  createEvent
);

router.put(
  '/:id',
  authenticateToken,
  upload.single('image'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  ],
  updateEvent
);

// Image Gallery Routes — must be BEFORE /:id routes to avoid shadowing
router.post('/:id/images', authenticateToken, upload.array('images', 10), uploadEventImages);
router.delete('/images/:imageId', authenticateToken, deleteEventImage);

router.delete('/:id', authenticateToken, deleteEvent);

export default router;
