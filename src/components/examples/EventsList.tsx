'use client';

import { useEvents, useEventStats } from '@/lib/api/hooks';
import { EventStatus } from '@/lib/api/types';

/**
 * Example component showing how to use the event API
 * 
 * Usage in your components:
 * import { EventsList } from '@/components/examples/EventsList';
 */

export function EventsList() {
  // Fetch all events
  const { events, loading, error } = useEvents();

  // Or fetch only LIVE events
  // const { events, loading, error } = useEvents(EventStatus.LIVE);

  // Or fetch UPCOMING events
  // const { events, loading, error } = useEvents(EventStatus.UPCOMING);

  // Fetch statistics
  const { stats } = useEventStats();

  if (loading) return <div>Loading events...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Events</h2>
      
      {/* Display stats */}
      <div className="stats mb-6">
        <p>Total: {stats.total}</p>
        <p>Live: {stats.live}</p>
        <p>Upcoming: {stats.upcoming}</p>
        <p>Past: {stats.past}</p>
      </div>

      {/* Display events */}
      <div className="events-grid">
        {events.map((event) => {
          const status = event.status ?? EventStatus.UPCOMING;
          const endTime = event.end_time
            ? new Date(event.end_time).toLocaleString()
            : 'TBD';

          return (
            <div key={event.id} className="event-card">
              <span className={`status-badge ${status.toLowerCase()}`}>
                {status}
              </span>
              {event.image_url && (
                <img src={event.image_url} alt={event.title} />
              )}
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div className="time-info">
                <p>Start: {new Date(event.start_time).toLocaleString()}</p>
                <p>End: {endTime}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Example: Create event programmatically
 */
import { eventAPI } from '@/lib/api/eventAPI';

export async function createNewEvent() {
  try {
    const eventId = await eventAPI.createEvent({
      title: 'My New Event',
      description: 'Event description',
      start_time: '2026-03-20T10:00:00',
      end_time: '2026-03-20T18:00:00',
      image_url: 'https://example.com/image.jpg',
    });
    console.log('Event created with ID:', eventId);
  } catch (error) {
    console.error('Failed to create event:', error);
  }
}

/**
 * Example: Update event
 */
export async function updateExistingEvent(id: number) {
  try {
    await eventAPI.updateEvent(id, {
      title: 'Updated Title',
    });
    console.log('Event updated successfully');
  } catch (error) {
    console.error('Failed to update event:', error);
  }
}

/**
 * Example: Delete event
 */
export async function deleteExistingEvent(id: number) {
  try {
    await eventAPI.deleteEvent(id);
    console.log('Event deleted successfully');
  } catch (error) {
    console.error('Failed to delete event:', error);
  }
}
