import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as eventService from '../services/eventService';
import { EventStatus } from '../models/event';

export async function getAllEvents(req: Request, res: Response) {
  try {
    const status = req.query.status as EventStatus | undefined;
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    if (status && !Object.values(EventStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status parameter. Must be UPCOMING, LIVE, or PAST',
      });
    }

    if (limit < 1 || limit > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1 and 1000',
      });
    }

    if (offset < 0) {
      return res.status(400).json({
        success: false,
        error: 'Offset must be non-negative',
      });
    }

    const events = await eventService.getEvents(status, limit, offset);

    res.json({
      success: true,
      data: events,
      pagination: {
        limit,
        offset,
        count: events.length,
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function getEventById(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID',
      });
    }

    const event = await eventService.getEventById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function createEvent(req: Request, res: Response) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const eventId = await eventService.createEvent(req.body);

    res.status(201).json({
      success: true,
      data: { id: eventId },
      message: 'Event created successfully',
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID',
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const updated = await eventService.updateEvent(eventId, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const eventId = parseInt(req.params.id);

    if (isNaN(eventId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID',
      });
    }

    const deleted = await eventService.deleteEvent(eventId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete event',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function getEventStats(req: Request, res: Response) {
  try {
    const stats = await eventService.getEventStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching event stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event statistics',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
