import {
  EventWithStatus,
  EventStatus,
  CreateEventDTO,
  UpdateEventDTO,
  EventStats,
  ApiResponse,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class EventAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch all events with optional filters
   */
  async getEvents(
    status?: EventStatus,
    limit: number = 100,
    offset: number = 0
  ): Promise<EventWithStatus[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());
    params.append('offset', offset.toString());

    const response = await fetch(
      `${this.baseUrl}/api/events?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }

    const data: ApiResponse<EventWithStatus[]> = await response.json();
    return data.data || [];
  }

  /**
   * Fetch a single event by ID
   */
  async getEventById(id: number): Promise<EventWithStatus | null> {
    const response = await fetch(`${this.baseUrl}/api/events/${id}`);

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    const data: ApiResponse<EventWithStatus> = await response.json();
    return data.data || null;
  }

  /**
   * Create a new event
   */
  async createEvent(eventData: CreateEventDTO): Promise<number> {
    const response = await fetch(`${this.baseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create event');
    }

    const data: ApiResponse<{ id: number }> = await response.json();
    return data.data?.id || 0;
  }

  /**
   * Update an existing event
   */
  async updateEvent(id: number, eventData: UpdateEventDTO): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update event');
    }

    return true;
  }

  /**
   * Delete an event
   */
  async deleteEvent(id: number): Promise<boolean> {
    const response = await fetch(`${this.baseUrl}/api/events/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete event');
    }

    return true;
  }

  /**
   * Get event statistics
   */
  async getEventStats(): Promise<EventStats> {
    const response = await fetch(`${this.baseUrl}/api/events/stats`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`);
    }

    const data: ApiResponse<EventStats> = await response.json();
    return (
      data.data || {
        total: 0,
        upcoming: 0,
        live: 0,
        past: 0,
      }
    );
  }
}

// Export singleton instance
export const eventAPI = new EventAPI();

// Export class for custom instances
export default EventAPI;
