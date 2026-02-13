import { Router } from 'express';
import { body } from 'express-validator';
import * as eventController from '../controllers/eventController';

const router = Router();

// Validation middleware
const createEventValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('start_time')
    .isISO8601()
    .withMessage('start_time must be a valid ISO 8601 date'),
  body('end_time')
    .isISO8601()
    .withMessage('end_time must be a valid ISO 8601 date')
    .custom((value, { req }) => {
      const startTime = new Date(req.body.start_time);
      const endTime = new Date(value);
      if (endTime <= startTime) {
        throw new Error('end_time must be after start_time');
      }
      return true;
    }),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('image_url must be a valid URL'),
  body('description')
    .optional()
    .trim(),
];

const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 255 })
    .withMessage('Title must be between 3 and 255 characters'),
  body('start_time')
    .optional()
    .isISO8601()
    .withMessage('start_time must be a valid ISO 8601 date'),
  body('end_time')
    .optional()
    .isISO8601()
    .withMessage('end_time must be a valid ISO 8601 date'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('image_url must be a valid URL'),
  body('description')
    .optional()
    .trim(),
];

// Routes
router.get('/stats', eventController.getEventStats);
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/', createEventValidation, eventController.createEvent);
router.put('/:id', updateEventValidation, eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

export default router;
