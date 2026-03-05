import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import * as eventService from '../services/eventService';
import { EventStatus } from '../models/event';
import fs from 'fs';
import path from 'path';
import { deleteFile } from '../utils/fileUtils';

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
    const eventId = req.params.id;

    if (!eventId || eventId.length !== 24) {
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

    const images = await eventService.getEventImages(eventId);

    res.json({
      success: true,
      data: {
        ...event.toObject(),
        images
      },
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

    const eventData = req.body;
    if (req.body.managed_by) {
      try {
        eventData.managed_by = JSON.parse(req.body.managed_by);
      } catch (e) {
        eventData.managed_by = [req.body.managed_by];
      }
    }

    if (req.file) {
      eventData.image_url = `/uploads/events/${req.file.filename}`;
    }

    const eventId = await eventService.createEvent(eventData);

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
    const eventId = req.params.id;

    if (!eventId || eventId.length !== 24) {
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

    const eventData = req.body;
    const currentEvent = await eventService.getEventById(eventId);

    if (req.body.managed_by) {
      try {
        eventData.managed_by = JSON.parse(req.body.managed_by);
      } catch (e) {
        eventData.managed_by = [req.body.managed_by];
      }
    }

    if (req.file) {
      eventData.image_url = `/uploads/events/${req.file.filename}`;
      if (currentEvent && currentEvent.image_url) {
        deleteFile(currentEvent.image_url);
      }
    } else if (eventData.image_url === '') {
      if (currentEvent && currentEvent.image_url) {
         deleteFile(currentEvent.image_url);
      }
    }

    const updated = await eventService.updateEvent(eventId, eventData);

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

export async function uploadEventImages(req: Request, res: Response) {
  try {
    const eventId = req.params.id;
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    const images = await eventService.addEventImages(eventId, req.files as Express.Multer.File[]);

    res.json({
      success: true,
      data: images,
      message: 'Images uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading event images:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload images',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export async function deleteEventImage(req: Request, res: Response) {
  try {
    const imageId = req.params.imageId;
    
    // Use Mongoose directly to get the image URL before deleting
    // Alternatively, a new service method could be created, but this works cleanly
    const EventImage = require('../models/EventImage').default;
    const image = await EventImage.findById(imageId);

    if (!image) {
        return res.status(404).json({ success: false, error: 'Image not found' });
    }

    const result = await eventService.removeEventImage(imageId);

    if (!result) {
        return res.status(500).json({ success: false, error: 'Failed to delete image record' });
    }

    // Actually delete the file from the filesystem
    deleteFile(image.url);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting event image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}


export async function deleteEvent(req: Request, res: Response) {
  try {
    const eventId = req.params.id;

    if (!eventId || eventId.length !== 24) {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID',
      });
    }

    const currentEvent = await eventService.getEventById(eventId);
    const eventImages = await eventService.getEventImages(eventId);

    const deleted = await eventService.deleteEvent(eventId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    // Clean up main poster
    if (currentEvent && currentEvent.image_url) {
      deleteFile(currentEvent.image_url);
    }

    // Clean up gallery images
    if (eventImages && eventImages.length > 0) {
      eventImages.forEach(img => {
        deleteFile(img.url);
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
