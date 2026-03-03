import {
  Event,
  EventStatus,
  CreateEventDTO,
  UpdateEventDTO,
  EventStats,
  IEvent
} from '../models/event';
import EventImage, { IEventImage } from '../models/EventImage';
import { Express } from 'express';
import mongoose from 'mongoose';


export async function getEvents(
  status?: EventStatus,
  limit: number = 100,
  offset: number = 0
): Promise<IEvent[]> {
  const now = new Date();
  let query: any = {};

  if (status) {
    switch (status) {
      case EventStatus.UPCOMING:
        query.start_time = { $gt: now };
        break;
      case EventStatus.LIVE:
        query.start_time = { $lte: now };
        query.end_time = { $gte: now };
        break;
      case EventStatus.PAST:
        query.end_time = { $lt: now };
        break;
    }
  }

  const events = await Event.find(query)
    .sort({ start_time: 1 })
    .limit(limit)
    .skip(offset);

  return events as IEvent[];
}

export async function getEventById(id: string): Promise<IEvent | null> {
  const event = await Event.findById(id);
  return event as IEvent | null;
}

export async function createEvent(eventData: CreateEventDTO): Promise<string> {
  const startTime = new Date(eventData.start_time);
  const endTime = new Date(eventData.end_time);

  if (endTime <= startTime) {
    throw new Error('End time must be after start time');
  }

  const event = new Event({
    title: eventData.title,
    image_url: eventData.image_url || undefined,
    description: eventData.description || undefined,
    start_time: startTime,
    end_time: endTime,
    location: eventData.location || undefined,
    place: eventData.place || undefined,
    managed_by: eventData.managed_by || undefined,
    contact_details: eventData.contact_details || '7608976946',
    registration_link: eventData.registration_link || undefined,
  });

  const savedEvent = await event.save();
  return savedEvent._id.toString();
}

export async function updateEvent(
  id: string,
  eventData: UpdateEventDTO
): Promise<boolean> {
  const updates: any = {};

  if (eventData.title !== undefined) updates.title = eventData.title;
  if (eventData.image_url !== undefined) updates.image_url = eventData.image_url;
  if (eventData.description !== undefined) updates.description = eventData.description;
  if (eventData.location !== undefined) updates.location = eventData.location;
  if (eventData.place !== undefined) updates.place = eventData.place;
  if (eventData.managed_by !== undefined) updates.managed_by = eventData.managed_by;
  if (eventData.contact_details !== undefined) updates.contact_details = eventData.contact_details;
  if (eventData.registration_link !== undefined) updates.registration_link = eventData.registration_link;
  
  // Date handling
  let newStartTime: Date | undefined;
  let newEndTime: Date | undefined;

  if (eventData.start_time !== undefined) {
    newStartTime = new Date(eventData.start_time);
    updates.start_time = newStartTime;
  }
  
  if (eventData.end_time !== undefined) {
    newEndTime = new Date(eventData.end_time);
    updates.end_time = newEndTime;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error('No fields to update');
  }

  // Fetch existing event if we need to validate time range against existing data
  const existingEvent = await Event.findById(id);
  if (!existingEvent) {
    throw new Error('Event not found');
  }

  const finalStartTime = newStartTime || existingEvent.start_time;
  const finalEndTime = newEndTime || existingEvent.end_time;

  if (finalEndTime <= finalStartTime) {
    throw new Error('End time must be after start time');
  }

  const result = await Event.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  return result !== null;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const result = await Event.findByIdAndDelete(id);
  return result !== null;
}

export async function getEventStats(): Promise<EventStats> {
  const now = new Date();

  const [total, upcoming, live, past] = await Promise.all([
    Event.countDocuments(),
    Event.countDocuments({ start_time: { $gt: now } }),
    Event.countDocuments({ start_time: { $lte: now }, end_time: { $gte: now } }),
    Event.countDocuments({ end_time: { $lt: now } })
  ]);

  return {
    total,
    upcoming,
    live,
    past
  };
}

export async function addEventImages(eventId: string, files: Express.Multer.File[]): Promise<IEventImage[]> {
  const imageDocs = files.map(file => ({
    event: new mongoose.Types.ObjectId(eventId),
    url: `/uploads/events/${file.filename}`
  }));

  const images = await EventImage.insertMany(imageDocs);
  return images;
}

export async function removeEventImage(imageId: string): Promise<boolean> {
  const result = await EventImage.findByIdAndDelete(imageId);
  return result !== null;
}

export async function getEventImages(eventId: string): Promise<IEventImage[]> {
  return await EventImage.find({ event: eventId }).sort({ created_at: -1 });
}

