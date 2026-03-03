import { Router } from 'express';
import { body } from 'express-validator';
import { upload, validateImageBytes } from '../middleware/uploadMiddleware';
import { authenticateToken } from '../middleware/authMiddleware';
import { MemberPosition } from '../models/member';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
} from '../controllers/memberController';

const router = Router();

// Basic validation rules, allowing optional linkedin
const memberValidation = [
  body('fullname').notEmpty().withMessage('Fullname is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('position').isIn(Object.values(MemberPosition)).withMessage('Invalid position')
];

// Public directory access
router.get('/', getAllMembers);
router.get('/:id', getMemberById);

// Protected Admin Access
router.post('/', authenticateToken, upload.single('photo'), validateImageBytes, memberValidation, createMember);
// Optional validation on PUT so admins can update single fields (e.g. just the photo)
router.put('/:id', authenticateToken, upload.single('photo'), validateImageBytes, memberValidation.map(v => v.optional()), updateMember);
router.delete('/:id', authenticateToken, deleteMember);

export default router;
