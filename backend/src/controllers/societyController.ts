import { Request, Response } from 'express';
import {
  getSocieties,
  getSocietyCount,
  getSocietyById,
  createSociety,
  updateSociety,
  deleteSociety,
} from '../services/societyService';
import { ApiResponse, Society } from '../models/society';


export async function getAllSocieties(req: Request, res: Response) {
  try {
    const limit = Number(req.query.limit) || 100;
    const offset = Number(req.query.offset) || 0;

    const [societies, count] = await Promise.all([
      getSocieties(limit, offset),
      getSocietyCount(),
    ]);

    const response: ApiResponse<Society[]> = {
      success: true,
      data: societies,
      pagination: {
        limit,
        offset,
        count,
      },
    };

    return res.json(response);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch societies',
    });
  }
}

export async function getSociety(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const society = await getSocietyById(id);
    if (!society) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    return res.json({ success: true, data: society });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to fetch society' });
  }
}

export async function createNewSociety(req: Request, res: Response) {
  try {
    const society = await createSociety(req.body);
    return res.status(201).json({ success: true, data: society });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to create society' });
  }
}

export async function updateExistingSociety(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const success = await updateSociety(id, req.body);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Society not found or no changes made' });
    }
    return res.json({ success: true, message: 'Society updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to update society' });
  }
}

export async function removeSociety(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const success = await deleteSociety(id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Society not found' });
    }
    return res.json({ success: true, message: 'Society deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to delete society' });
  }
}
