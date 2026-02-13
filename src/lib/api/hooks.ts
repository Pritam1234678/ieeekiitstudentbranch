'use client';

import { useState, useEffect } from 'react';
import { eventAPI } from './eventAPI';
import { societyAPI } from './societyAPI';
import { EventWithStatus, EventStatus, EventStats, Society } from './types';

/**
 * React hook to fetch events with optional status filter
 */
export function useEvents(status?: EventStatus) {
  const [events, setEvents] = useState<EventWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventAPI.getEvents(status);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [status]);

  return { events, loading, error };
}

/**
 * React hook to fetch a single event by ID
 */
export function useEvent(id: number) {
  const [event, setEvent] = useState<EventWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventAPI.getEventById(id);
        setEvent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  return { event, loading, error };
}

/**
 * React hook to fetch event statistics
 */
export function useEventStats() {
  const [stats, setStats] = useState<EventStats>({
    total: 0,
    upcoming: 0,
    live: 0,
    past: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await eventAPI.getEventStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
}

export function useSocieties() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await societyAPI.getSocieties();
        setSocieties(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch societies');
      } finally {
        setLoading(false);
      }
    };

    fetchSocieties();
  }, []);

  return { societies, loading, error };
}
