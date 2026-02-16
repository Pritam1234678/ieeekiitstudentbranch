import {
  Event,
  EventStatus,
  CreateEventDTO,
  UpdateEventDTO,
  EventStats,
  IEvent
} from '../models/event';

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
  if (eventData.start_time !== undefined) updates.start_time = new Date(eventData.start_time);
  if (eventData.end_time !== undefined) updates.end_time = new Date(eventData.end_time);

  if (Object.keys(updates).length === 0) {
    throw new Error('No fields to update');
  }

  if (eventData.start_time && eventData.end_time) {
    const startTime = new Date(eventData.start_time);
    const endTime = new Date(eventData.end_time);
    if (endTime <= startTime) {
      throw new Error('End time must be after start time');
    }
  }

  const result = await Event.findByIdAndUpdate(id, updates, { new: true });
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
