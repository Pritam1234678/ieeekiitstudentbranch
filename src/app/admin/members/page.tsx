'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getApiUrl } from '@/lib/api/config';

interface Member {
    _id: string;
    fullname: string;
    email: string;
    linkedin?: string;
    photo_url?: string;
    position: string;
    domain?: string;
}

const positionColorMap: Record<string, string> = {
    'Chair': 'bg-[#eef5ff] border-[#c8ddff] text-[#0b5ed7]',
    'Vice Chair': 'bg-[#eef5ff] border-[#c8ddff] text-[#0b5ed7]',
    'Secretary': 'bg-[#e9f2ff] border-[#bdd7ff] text-[#0a4db4]',
    'Treasurer': 'bg-[#e9f2ff] border-[#bdd7ff] text-[#0a4db4]',
    'Joint Secretary': 'bg-[#f4f8ff] border-[#d7e7ff] text-[#5a78a4]',
    'Joint Treasurer': 'bg-[#f4f8ff] border-[#d7e7ff] text-[#5a78a4]',
    'Webmaster': 'bg-[#eef5ff] border-[#c8ddff] text-[#0b5ed7]',
    'Advisor': 'bg-[#fff5f5] border-[#ffd6d6] text-[#d70b0b]',
    'Counselor': 'bg-[#fff5f5] border-[#ffd6d6] text-[#d70b0b]',
    'Member': 'bg-[#f8f9fa] border-[#e9ecef] text-[#495057]',
};

function MemberCard({
    member,
    onDelete,
}: {
    member: Member;
    onDelete: (id: string) => void;
}) {
    const defaultColor = 'bg-[#f8f9fa] border-[#e9ecef] text-[#495057]';
    const tagStyle = positionColorMap[member.position] || defaultColor;

    return (
        <motion.article
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
            className="group flex h-full flex-col rounded-[28px] border border-[#d9e8ff] bg-white p-6 shadow-[0_14px_30px_rgba(16,40,77,0.08)] transition duration-300 hover:-translate-y-2 hover:border-[#b9d7ff] hover:shadow-[0_22px_45px_rgba(16,40,77,0.14)]"
        >
            <div className="mb-4 flex items-start justify-between gap-3">
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${tagStyle}`}>
                    {member.position}
                </span>
                {member.domain && (
                    <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#3b82f6]">
                        {member.domain}
                    </span>
                )}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onDelete(member._id)}
                        className="rounded-lg border border-[#d6e8ff] bg-[#f7fbff] px-3 py-1.5 text-xs font-semibold text-[#4f73a5] transition hover:border-[#a4cbff] hover:bg-[#edf5ff] hover:text-[#0b5ed7]"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-5">
                <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#d9e8ff] bg-gray-100 shrink-0">
                    {member.photo_url ? (
                        <img
                            src={getApiUrl(member.photo_url)}
                            alt={member.fullname}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#e8f1ff] text-xl font-bold text-[#0b5ed7]">
                            {member.fullname.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-semibold leading-[1.14] tracking-tight text-[#0f2f5d] line-clamp-1">
                        {member.fullname}
                    </h3>
                    <p className="mt-1 text-sm text-[#5b76a0] line-clamp-1">{member.email}</p>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-[#e5f0ff] pt-5">
                <span className="text-xs font-medium text-[#7a93b9]">
                    {member.linkedin ? (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[#0b5ed7] underline">
                            LinkedIn Profile
                        </a>
                    ) : 'No LinkedIn'}
                </span>
                <Link
                    href={`/admin/members/${member._id}/edit`}
                    className="rounded-lg bg-[#0b5ed7] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#084bad]"
                >
                    Manage
                </Link>
            </div>
        </motion.article>
    );
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [positionFilter, setPositionFilter] = useState<string>('ALL');
    const [error, setError] = useState('');

    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(getApiUrl('/api/members'), { credentials: 'include' });
            const raw = await res.text();
            const data = raw ? JSON.parse(raw) : {};

            if (res.ok && data.success) {
                setMembers(Array.isArray(data.data) ? data.data : []);
            } else {
                setError(data.error || 'Failed to load members');
            }
        } catch (err) {
            console.error('Failed to fetch members', err);
            setError('Unable to connect. Please refresh.');
        } finally {
            setLoading(false);
        }
    };

    const filteredMembers = useMemo(() => {
        const value = query.trim().toLowerCase();

        return members.filter((member) => {
            const matchesText = !value || member.fullname.toLowerCase().includes(value) || member.email.toLowerCase().includes(value);
            const matchesPosition = positionFilter === 'ALL' || member.position === positionFilter;
            return matchesText && matchesPosition;
        });
    }, [members, query, positionFilter]);

    const uniquePositions = useMemo(() => {
        const pos = new Set<string>();
        members.forEach(m => pos.add(m.position));
        return Array.from(pos).sort();
    }, [members]);

    const handleDeleteClick = (id: string) => {
        setMemberToDelete(id);
    };

    const confirmDelete = async () => {
        if (!memberToDelete) return;

        try {
            const res = await fetch(getApiUrl(`/api/members/${memberToDelete}`), {
                method: 'DELETE',
                credentials: 'include',
            });

            if (res.ok) {
                setMembers((prev) => prev.filter((m) => m._id !== memberToDelete));
                setMemberToDelete(null);
                return;
            }

            alert('Failed to delete member');
        } catch (err) {
            console.error('Error deleting member', err);
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
                        <div key={item} className="h-64 animate-pulse rounded-2xl bg-white" />
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
                        <h1 className="mt-1 text-4xl font-semibold tracking-tight text-[#0e2f5e]">Members</h1>
                        <p className="mt-2 text-sm text-[#5d79a3]">
                            Manage the organizational directory, core board, and student members.
                        </p>
                    </div>

                    <Link
                        href="/admin/members/create"
                        className="inline-flex items-center justify-center rounded-xl bg-[#0b5ed7] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#084bad] hover:shadow-[0_12px_22px_rgba(11,94,215,0.25)]"
                    >
                        Add Member
                    </Link>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <div className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 xl:col-span-1 grow max-w-xs">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">Total Members</p>
                        <p className="mt-1 text-2xl font-semibold text-[#0b5ed7]">{members.length}</p>
                    </div>

                    <label className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 transition focus-within:border-[#9ec6ff] grow max-w-sm flex-1">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">Filter by Position</p>
                        <select
                            value={positionFilter}
                            onChange={(e) => setPositionFilter(e.target.value)}
                            className="mt-1 w-full bg-transparent text-sm text-[#10386f] outline-none"
                        >
                            <option value="ALL">All Positions</option>
                            {uniquePositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                        </select>
                    </label>

                    <label className="rounded-xl border border-[#d9e8ff] bg-[#f7fbff] px-4 py-3 transition focus-within:border-[#9ec6ff] grow flex-[2]">
                        <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b88b2]">Search Name or Email</p>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Type to search..."
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

            {filteredMembers.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-[#c9ddff] bg-white px-6 py-16 text-center"
                >
                    <h3 className="text-2xl font-semibold text-[#0e2f5e]">
                        {members.length === 0 ? 'No members added yet' : 'No matching members'}
                    </h3>
                    <p className="mx-auto mt-2 max-w-xl text-sm text-[#5d79a3]">
                        {members.length === 0 ? 'Click "Add Member" to populate the directory.' : 'Adjust your search filters to see more results.'}
                    </p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3">
                    {filteredMembers.map((member) => (
                        <MemberCard key={member._id} member={member} onDelete={handleDeleteClick} />
                    ))}
                </div>
            )}

            {memberToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0e2f5e]/40 px-4 backdrop-blur-sm">
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
                            <h3 className="text-xl font-bold text-gray-900">Remove Member</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Are you sure you want to permanently remove this member? Their profile and picture will be deleted and removed from the public directory.
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3 bg-gray-50 px-6 py-4">
                            <button
                                onClick={() => setMemberToDelete(null)}
                                className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
}
