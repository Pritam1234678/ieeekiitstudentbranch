import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as memberService from '../services/memberService';
import { deleteFile } from '../utils/fileUtils';

export async function getAllMembers(req: Request, res: Response) {
  try {
    const members = await memberService.getAllMembers();
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch members' });
  }
}

export async function getMemberById(req: Request, res: Response) {
  try {
    const member = await memberService.getMemberById(req.params.id);
    if (!member) return res.status(404).json({ success: false, error: 'Member not found' });
    res.json({ success: true, data: member });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch member' });
  }
}

export async function createMember(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const memberData = { ...req.body };
    if (req.file) {
      memberData.photo_url = `/uploads/members/${req.file.filename}`;
    }

    const memberId = await memberService.createMember(memberData);
    res.status(201).json({ success: true, data: { id: memberId }, message: 'Member created successfully' });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, error: error.message || 'Failed to create member' });
  }
}

export async function updateMember(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const memberData = { ...req.body };
    const currentMember = await memberService.getMemberById(req.params.id);

    if (req.file) {
      memberData.photo_url = `/uploads/members/${req.file.filename}`;
      // Clean up the old photo if a new one is uploaded
      if (currentMember && currentMember.photo_url) {
        deleteFile(currentMember.photo_url);
      }
    } else if (memberData.photo_url === '') {
      // User explicitly removed the photo using the X button
      if (currentMember && currentMember.photo_url) {
        deleteFile(currentMember.photo_url);
      }
    }

    const updated = await memberService.updateMember(req.params.id, memberData);
    if (!updated) return res.status(404).json({ success: false, error: 'Member not found' });

    res.json({ success: true, message: 'Member updated successfully' });
  } catch (error: any) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ success: false, error: error.message || 'Failed to update member' });
  }
}

export async function deleteMember(req: Request, res: Response) {
  try {
    const currentMember = await memberService.getMemberById(req.params.id);
    const deleted = await memberService.deleteMember(req.params.id);
    
    if (!deleted) return res.status(404).json({ success: false, error: 'Member not found' });

    // Clean up the photo from disk since the member is deleted
    if (currentMember && currentMember.photo_url) {
       deleteFile(currentMember.photo_url);
    }

    res.json({ success: true, message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete member' });
  }
}
