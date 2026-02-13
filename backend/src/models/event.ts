export enum EventStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  PAST = 'PAST'
}

export interface Event {
  id: number;
  title: string;
  image_url: string | null;
  description: string | null;
  start_time: Date | string;
  end_time: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface EventWithStatus extends Event {
  status: EventStatus;
}

export interface CreateEventDTO {
  title: string;
  image_url?: string;
  description?: string;
  start_time: string | Date;
  end_time: string | Date;
}

export interface UpdateEventDTO {
  title?: string;
  image_url?: string;
  description?: string;
  start_time?: string | Date;
  end_time?: string | Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface EventStats {
  total: number;
  upcoming: number;
  live: number;
  past: number;
}
