'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api/config';
import { motion } from 'framer-motion';

interface Society {
    id: string;
    name: string;
    logo_url: string;
    chair_name: string;
    description: string;
    faculty_name: string;
}

function SocietyCard({
    society,
    onDelete,
}: {
    society: Society;
    onDelete: (id: string) => void;
}) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="group flex h-full flex-col rounded-[28px] border border-[#d9e8ff] bg-white p-6 shadow-[0_14px_30px_rgba(16,40,77,0.08)] transition duration-300 hover:-translate-y-2 hover:border-[#b9d7ff] hover:shadow-[0_22px_45px_rgba(16,40,77,0.14)]"
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-2xl border border-[#d7e7ff] bg-[#f4f8ff]">
                        {society.logo_url ? (
                            <img src={society.logo_url} alt={society.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-lg font-bold text-[#0b5ed7]">{society.name.charAt(0)}</span>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">Society</p>
                        <p className="text-sm font-semibold text-[#11386e]">IEEE KIIT</p>
                    </div>
                </div>

                <button
                    onClick={() => onDelete(society.id)}
                    className="rounded-lg border border-[#d6e8ff] bg-[#f7fbff] px-3 py-1.5 text-xs font-semibold text-[#4f73a5] transition hover:border-[#a4cbff] hover:bg-[#edf5ff] hover:text-[#0b5ed7]"
                >
                    Delete
                </button>
            </div>

            <h3 className="mb-4 text-[2rem] font-semibold leading-[1.15] tracking-tight text-[#0f2f5d]">
                {society.name}
            </h3>

            <div className="space-y-2.5 text-[1.05rem]">
                <p className="rounded-xl bg-[#f4f8ff] px-4 py-2.5 text-[#2c4f81]">
                    <span className="font-semibold text-[#11386e]">Chair:</span> {society.chair_name || 'N/A'}
                </p>
                <p className="rounded-xl bg-[#f4f8ff] px-4 py-2.5 text-[#2c4f81]">
                    <span className="font-semibold text-[#11386e]">Faculty:</span> {society.faculty_name || 'N/A'}
                </p>
            </div>

            <p className="mt-5 line-clamp-3 text-[1.04rem] leading-relaxed text-[#5b76a0]">
                {society.description || 'No description provided.'}
            </p>

            <div className="mt-auto flex items-center justify-between border-t border-[#e5f0ff] pt-5">
                <span className="text-xs font-medium text-[#7a93b9]">ID: {society.id}</span>
                <Link
                    href={`/admin/societies/${society.id}/edit`}
                    className="rounded-lg bg-[#0b5ed7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#084bad]"
                >
                    Manage
                </Link>
            </div>
        </motion.article>
    );
}

export default function SocietiesPage() {
    const [societies, setSocieties] = useState<Society[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [error, setError] = useState('');
    const [societyToDelete, setSocietyToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchSocieties();
    }, []);

    const fetchSocieties = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(getApiUrl('/api/societies'), { credentials: 'include' });
            const raw = await res.text();
            const data = raw ? JSON.parse(raw) : {};

            if (res.ok && data.success) {
                setSocieties(Array.isArray(data.data) ? data.data : []);
            } else {
                setError(data.error || 'Failed to load societies');
            }
        } catch (err) {
            console.error('Failed to fetch societies', err);
            setError('Unable to connect. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const filteredSocieties = useMemo(() => {
        const value = query.trim().toLowerCase();
        if (!value) return societies;

        return societies.filter((society) => {
            return (
                society.name.toLowerCase().includes(value) ||
                (society.chair_name || '').toLowerCase().includes(value) ||
                (society.faculty_name || '').toLowerCase().includes(value)
            );
        });
    }, [societies, query]);

    const stats = useMemo(() => {
        const withFaculty = societies.filter((item) => !!item.faculty_name?.trim()).length;
        const withDescription = societies.filter((item) => !!item.description?.trim()).length;
        return [
            { label: 'Total Societies', value: societies.length },
            { label: 'With Faculty', value: withFaculty },
            { label: 'Completed Profiles', value: withDescription },
        ];
    }, [societies]);

    const handleDeleteClick = (id: string) => {
        setSocietyToDelete(id);
    };

    const confirmDelete = async () => {
        if (!societyToDelete) return;

        try {
            const res = await fetch(getApiUrl(`/api/societies/${societyToDelete}`), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setSocieties((prev) => prev.filter((society) => society.id !== societyToDelete));
                setSocietyToDelete(null);
                return;
            }

            alert('Failed to delete society');
        } catch (err) {
            console.error('Error deleting society', err);
            alert('Delete failed');
        }
    };

    if (loading) {
        return (
            <div className="space-y-5">
                <div className="rounded-2xl border border-[#d9e8ff] bg-white p-6">
                    <div className="mb-5 h-8 w-48 animate-pulse rounded bg-[#eaf3ff]" />
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        {[0, 1, 2].map((item) => (
                            <div key={item} className="h-20 animate-pulse rounded-xl bg-[#eff6ff]" />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#0e2f5e]">Societies</h1>
                        <p className="mt-2 text-sm text-[#5d79a3]">
                            Manage all IEEE student branch chapters with a clean and consistent structure.
                        </p>
                    </div>

                    <Link
                        href="/admin/societies/create"
                        className="inline-flex items-center justify-center rounded-xl bg-[#0b5ed7] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#084bad] hover:shadow-[0_12px_22px_rgba(11,94,215,0.25)]"
                    >
                        Add New Society
                    </Link>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.map((item) => (
                        <div key={item.label} className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 transition hover:border-[#b9d7ff] hover:bg-[#f2f8ff]">
                            <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">{item.label}</p>
                            <p className="mt-1 text-2xl font-semibold text-[#0b5ed7]">{item.value}</p>
                        </div>
                    ))}

                    <label className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 transition focus-within:border-[#9ec6ff]">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">Search</p>
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search society, chair, faculty"
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

            {filteredSocieties.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-[#c9ddff] bg-white px-6 py-16 text-center"
                >
                    <h3 className="text-2xl font-semibold text-[#0e2f5e]">
                        {societies.length === 0 ? 'No societies yet' : 'No matching societies'}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-[#5d79a3]">
                        {societies.length === 0
                            ? 'Create your first society to start managing chapter data.'
                            : 'Try a different search term.'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                    {filteredSocieties.map((society) => (
                        <SocietyCard key={society.id} society={society} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {societyToDelete && (
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
                            <h3 className="text-xl font-bold text-gray-900">Delete Society</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to permanently delete this society? This action cannot be undone and will remove all associated data and references.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 bg-gray-50 px-6 py-4">
                            <button
                                onClick={() => setSocietyToDelete(null)}
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
