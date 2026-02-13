import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { executeQuery } from '../config/db';
import {
  EventWithStatus,
  EventStatus,
  CreateEventDTO,
  UpdateEventDTO,
  EventStats,
} from '../models/event';

export async function getEvents(
  status?: EventStatus,
  limit: number = 100,
  offset: number = 0
): Promise<EventWithStatus[]> {
  let query = `
    SELECT 
      id,
      title,
      image_url,
      description,
      start_time,
      end_time,
      created_at,
      updated_at,
      CASE 
        WHEN NOW() < start_time THEN 'UPCOMING'
        WHEN NOW() BETWEEN start_time AND end_time THEN 'LIVE'
        WHEN NOW() > end_time THEN 'PAST'
      END as status
    FROM events
  `;

  if (status) {
    switch (status) {
      case EventStatus.UPCOMING:
        query += ' WHERE NOW() < start_time';
        break;
      case EventStatus.LIVE:
        query += ' WHERE NOW() BETWEEN start_time AND end_time';
        break;
      case EventStatus.PAST:
        query += ' WHERE NOW() > end_time';
        break;
    }
  }

  query += `
    ORDER BY 
      CASE 
        WHEN NOW() BETWEEN start_time AND end_time THEN 1
        WHEN NOW() < start_time THEN 2
        WHEN NOW() > end_time THEN 3
      END,
      start_time ASC
    LIMIT ? OFFSET ?
  `;

  const params = [limit, offset];

  const results = await executeQuery<RowDataPacket[]>(query, params);
  return results as EventWithStatus[];
}

export async function getEventById(id: number): Promise<EventWithStatus | null> {
  const query = `
    SELECT 
      id,
      title,
      image_url,
      description,
      start_time,
      end_time,
      created_at,
      updated_at,
      CASE 
        WHEN NOW() < start_time THEN 'UPCOMING'
        WHEN NOW() BETWEEN start_time AND end_time THEN 'LIVE'
        WHEN NOW() > end_time THEN 'PAST'
      END as status
    FROM events
    WHERE id = ?
  `;

  const results = await executeQuery<RowDataPacket[]>(query, [id]);
  
  if (results.length === 0) {
    return null;
  }

  return results[0] as EventWithStatus;
}

export async function createEvent(eventData: CreateEventDTO): Promise<number> {
  const startTime = new Date(eventData.start_time);
  const endTime = new Date(eventData.end_time);

  if (endTime <= startTime) {
    throw new Error('End time must be after start time');
  }

  const query = `
    INSERT INTO events (title, image_url, description, start_time, end_time)
    VALUES (?, ?, ?, ?, ?)
  `;

  const params = [
    eventData.title,
    eventData.image_url || null,
    eventData.description || null,
    startTime,
    endTime,
  ];

  const result = await executeQuery<ResultSetHeader>(query, params);
  return result.insertId;
}

export async function updateEvent(
  id: number,
  eventData: UpdateEventDTO
): Promise<boolean> {
  const updates: string[] = [];
  const params: any[] = [];

  if (eventData.title !== undefined) {
    updates.push('title = ?');
    params.push(eventData.title);
  }

  if (eventData.image_url !== undefined) {
    updates.push('image_url = ?');
    params.push(eventData.image_url);
  }

  if (eventData.description !== undefined) {
    updates.push('description = ?');
    params.push(eventData.description);
  }

  if (eventData.start_time !== undefined) {
    updates.push('start_time = ?');
    params.push(new Date(eventData.start_time));
  }

  if (eventData.end_time !== undefined) {
    updates.push('end_time = ?');
    params.push(new Date(eventData.end_time));
  }

  if (updates.length === 0) {
    throw new Error('No fields to update');
  }

  if (eventData.start_time && eventData.end_time) {
    const startTime = new Date(eventData.start_time);
    const endTime = new Date(eventData.end_time);
    if (endTime <= startTime) {
      throw new Error('End time must be after start time');
    }
  }

  params.push(id);

  const query = `
    UPDATE events 
    SET ${updates.join(', ')}
    WHERE id = ?
  `;

  const result = await executeQuery<ResultSetHeader>(query, params);
  return result.affectedRows > 0;
}

export async function deleteEvent(id: number): Promise<boolean> {
  const query = 'DELETE FROM events WHERE id = ?';
  const result = await executeQuery<ResultSetHeader>(query, [id]);
  return result.affectedRows > 0;
}

export async function getEventStats(): Promise<EventStats> {
  const query = `
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN NOW() < start_time THEN 1 ELSE 0 END) as upcoming,
      SUM(CASE WHEN NOW() BETWEEN start_time AND end_time THEN 1 ELSE 0 END) as live,
      SUM(CASE WHEN NOW() > end_time THEN 1 ELSE 0 END) as past
    FROM events
  `;

  const results = await executeQuery<RowDataPacket[]>(query, []);
  const stats = results[0];

  return {
    total: Number(stats.total) || 0,
    upcoming: Number(stats.upcoming) || 0,
    live: Number(stats.live) || 0,
    past: Number(stats.past) || 0,
  };
}
