'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDateTimeIST } from '@/utils/helpers';
import { getApiUrl } from '@/lib/api/config';

interface Event {
    id: string;
    title: string;
    image_url: string;
    description: string;
    start_time: string;
    end_time: string;
    status: 'UPCOMING' | 'LIVE' | 'PAST';
}

const statusStyles: Record<Event['status'], string> = {
    UPCOMING: 'bg-[#eef5ff] border-[#c8ddff] text-[#0b5ed7]',
    LIVE: 'bg-[#e9f2ff] border-[#bdd7ff] text-[#0a4db4]',
    PAST: 'bg-[#f4f8ff] border-[#d7e7ff] text-[#5a78a4]',
};

function EventCard({
    event,
    onDelete,
}: {
    event: Event;
    onDelete: (id: string) => void;
}) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
            className="group flex h-full flex-col rounded-[28px] border border-[#d9e8ff] bg-white p-6 shadow-[0_14px_30px_rgba(16,40,77,0.08)] transition duration-300 hover:-translate-y-2 hover:border-[#b9d7ff] hover:shadow-[0_22px_45px_rgba(16,40,77,0.14)]"
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${statusStyles[event.status]}`}>
                    {event.status}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDelete(event.id)}
                        className="rounded-lg border border-[#d6e8ff] bg-[#f7fbff] px-3 py-1.5 text-xs font-semibold text-[#4f73a5] transition hover:border-[#a4cbff] hover:bg-[#edf5ff] hover:text-[#0b5ed7]"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <h3 className="mb-3 text-[1.95rem] font-semibold leading-[1.14] tracking-tight text-[#0f2f5d] line-clamp-2">
                {event.title}
            </h3>

            <div className="mb-4 space-y-2.5 text-[1rem]">
                <p className="rounded-xl bg-[#f4f8ff] px-4 py-2.5 text-[#2c4f81]">
                    <span className="font-semibold text-[#11386e]">Starts:</span> {formatDateTimeIST(event.start_time)}
                </p>
                <p className="rounded-xl bg-[#f4f8ff] px-4 py-2.5 text-[#2c4f81]">
                    <span className="font-semibold text-[#11386e]">Ends:</span> {formatDateTimeIST(event.end_time)}
                </p>
            </div>

            <p className="line-clamp-3 text-[1.03rem] leading-relaxed text-[#5b76a0]">
                {event.description || 'No description provided.'}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-[#e5f0ff] pt-5">
                <span className="text-xs font-medium text-[#7a93b9]">ID: {event.id}</span>
                <Link
                    href={`/admin/events/${event.id}/edit`}
                    className="rounded-lg bg-[#0b5ed7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#084bad]"
                >
                    Manage
                </Link>
            </div>
        </motion.article>
    );
}

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | Event['status']>('ALL');
    const [error, setError] = useState('');

    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(getApiUrl('/api/events'), { credentials: 'include' });
            const raw = await res.text();
            const data = raw ? JSON.parse(raw) : {};

            if (res.ok && data.success) {
                setEvents(Array.isArray(data.data) ? data.data : []);
            } else {
                setError(data.error || 'Failed to load events');
            }
        } catch (err) {
            console.error('Failed to fetch events', err);
            setError('Unable to connect. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = useMemo(() => {
        const value = query.trim().toLowerCase();

        return events.filter((event) => {
            const matchesText = !value || event.title.toLowerCase().includes(value) || (event.description || '').toLowerCase().includes(value);
            const matchesStatus = statusFilter === 'ALL' || event.status === statusFilter;
            return matchesText && matchesStatus;
        });
    }, [events, query, statusFilter]);

    const stats = useMemo(() => {
        const upcoming = events.filter((event) => event.status === 'UPCOMING').length;
        const live = events.filter((event) => event.status === 'LIVE').length;
        const past = events.filter((event) => event.status === 'PAST').length;
        return [
            { label: 'Total Events', value: events.length },
            { label: 'Upcoming', value: upcoming },
            { label: 'Live', value: live },
            { label: 'Past', value: past },
        ];
    }, [events]);

    const handleDeleteClick = (id: string) => {
        setEventToDelete(id);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;

        try {
            const res = await fetch(getApiUrl(`/api/events/${eventToDelete}`), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setEvents((prev) => prev.filter((event) => event.id !== eventToDelete));
                setEventToDelete(null);
                return;
            }

            alert('Failed to delete event');
        } catch (err) {
            console.error('Error deleting event', err);
            alert('Delete failed');
        }
    };

    if (loading) {
        return (
            <div className="space-y-5">
                <div className="rounded-2xl border border-[#d9e8ff] bg-white p-6">
                    <div className="mb-5 h-8 w-48 animate-pulse rounded bg-[#eaf3ff]" />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        {[0, 1, 2, 3].map((item) => (
                            <div key={item} className="h-20 animate-pulse rounded-xl bg-[#eff6ff]" />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                    {[0, 1, 2, 3, 4, 5].map((item) => (
                        <div key={item} className="h-72 animate-pulse rounded-2xl bg-white" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <section className="space-y-6 pb-8">
            <motion.header
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="rounded-2xl border border-[#d9e8ff] bg-white p-6 shadow-[0_12px_30px_rgba(16,40,77,0.05)]"
            >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b88b2]">Admin Workspace</p>
                        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#0e2f5e]">Events</h1>
                        <p className="mt-2 text-sm text-[#5d79a3]">
                            Manage upcoming, live, and past events in one clean workflow.
                        </p>
                    </div>

                    <Link
                        href="/admin/events/create"
                        className="inline-flex items-center justify-center rounded-xl bg-[#0b5ed7] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#084bad] hover:shadow-[0_12px_22px_rgba(11,94,215,0.25)]"
                    >
                        Create Event
                    </Link>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    {stats.map((item) => (
                        <div key={item.label} className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 transition hover:border-[#b9d7ff] hover:bg-[#f2f8ff] xl:col-span-1">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">{item.label}</p>
                            <p className="mt-1 text-2xl font-semibold text-[#0b5ed7]">{item.value}</p>
                        </div>
                    ))}

                    <label className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 transition focus-within:border-[#9ec6ff] xl:col-span-1">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">Status</p>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as 'ALL' | Event['status'])}
                            className="mt-1 w-full bg-transparent text-sm text-[#10386f] outline-none"
                        >
                            <option value="ALL">All</option>
                            <option value="UPCOMING">Upcoming</option>
                            <option value="LIVE">Live</option>
                            <option value="PAST">Past</option>
                        </select>
                    </label>

                    <label className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 transition focus-within:border-[#9ec6ff] xl:col-span-1">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">Search</p>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search title or description"
                            className="mt-1 w-full bg-transparent text-sm text-[#10386f] placeholder:text-[#8aa2c5] outline-none"
                        />
                    </label>
                </div>
            </motion.header>

            {error ? (
                <div className="rounded-xl border border-[#d8e7ff] bg-white px-4 py-3 text-sm text-[#2f4f80]">
                    {error}
                </div>
            ) : null}

            {filteredEvents.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-[#c9ddff] bg-white px-6 py-16 text-center"
                >
                    <h3 className="text-2xl font-semibold text-[#0e2f5e]">
                        {events.length === 0 ? 'No events yet' : 'No matching events'}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-[#5d79a3]">
                        {events.length === 0 ? 'Create your first event to populate this dashboard.' : 'Try another search or status filter.'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                    {filteredEvents.map((event) => (
                        <EventCard key={event.id} event={event} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {eventToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e2f5e]/40 px-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="p-6">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Delete Event</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to permanently delete this event? This action cannot be undone and will remove all associated data, including gallery images.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 bg-gray-50 px-6 py-4">
                            <button
                                onClick={() => setEventToDelete(null)}
                                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
}
