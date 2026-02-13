export interface Event {
  id: number;
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  location: string;
  image_url: string;
  registration_link: string;
  created_at?: string;
  updated_at?: string;
  status?: EventStatus;
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  LIVE = 'LIVE',
  PAST = 'PAST',
}

export interface EventWithStatus extends Event {
  displayStatus: EventStatus;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  start_time: string;
  end_time?: string;
  location?: string;
  image_url?: string;
  registration_link?: string;
  status?: EventStatus;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {}

export interface EventStats {
  total: number;
  upcoming: number;
  live: number;
  past: number;
}

export interface Society {
  id: number;
  name: string;
  logo_url: string;
  chair_name: string;
  description: string;
  faculty_name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
