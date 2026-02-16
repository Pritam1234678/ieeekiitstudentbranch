import { Request, Response } from 'express';
import {
  getAllSocieties,
  getSocietyById,
  createSociety,
  updateSociety,
  deleteSociety,
} from '../services/societyService';
import { ISociety } from '../models/society';

export async function getSocieties(req: Request, res: Response) {
  try {
    const societies = await getAllSocieties();

    const transformedSocieties = societies.map(function(s: any) {
      return {
        ...s,
        id: s._id.toString()
      };
    });

    return res.json({
      success: true,
      data: transformedSocieties,
      count: societies.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch societies',
    });
  }
}

export async function getSociety(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, error: 'Invalid society ID' });
    }
    
    const society = await getSocietyById(id);
    if (!society) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    
    const transformedSociety = {
      ...society,
      id: (society as any)._id.toString()
    };

    return res.json({ success: true, data: transformedSociety });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch society' });
  }
}

export async function addSociety(req: Request, res: Response) {
  try {
    const societyId = await createSociety(req.body);
    return res.status(201).json({ success: true, data: { id: societyId } });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create society' });
  }
}

export async function editSociety(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, error: 'Invalid society ID' });
    }
    
    const updated = await updateSociety(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    return res.json({ success: true, message: 'Society updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update society' });
  }
}

export async function removeSociety(req: Request, res: Response) {
  try {
    const id = req.params.id;
    
    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, error: 'Invalid society ID' });
    }
    
    const deleted = await deleteSociety(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    return res.json({ success: true, message: 'Society deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete society' });
  }
}
