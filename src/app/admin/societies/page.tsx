'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface Society {
    id: number;
    name: string;
    logo_url: string;
    chair_name: string;
    description: string;
    faculty_name: string;
}

function SocietyCard({ society, index, onDelete }: { society: Society, index: number, onDelete: (id: number) => void }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            style={{ perspective: 1000 }}
        >
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => { x.set(0); y.set(0); }}
                style={{
                    rotateX: useMotionTemplate`${mouseY.get() * -20}deg`, // Reverse axis for tilt
                    rotateY: useMotionTemplate`${mouseX.get() * 20}deg`,
                    transformStyle: "preserve-3d"
                }}
                className="group relative h-full bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(11,94,215,0.15)] transition-all duration-300 pointer-events-auto"
            >
                {/* Gradient Blob Background */}
                <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-[#E8F1FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-[#F0F7FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="relative z-10 flex flex-col h-full transform-style-3d group-hover:translate-z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#E6F0FF] p-2 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                            {society.logo_url ? (
                                <img src={society.logo_url} alt={society.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="text-2xl font-bold bg-gradient-to-br from-[#0B5ED7] to-[#052c65] bg-clip-text text-transparent">{society.name.charAt(0)}</span>
                            )}
                        </div>

                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                            <button
                                onClick={() => onDelete(society.id)}
                                className="w-8 h-8 rounded-full bg-white border border-[#E6F0FF] flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                title="Delete"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>

                    <h3 className="font-bold text-xl text-[#0A1A2F] leading-tight mb-2 group-hover:text-[#0B5ED7] transition-colors">{society.name}</h3>

                    <div className="mb-4 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-medium text-[#64748B] group-hover:bg-[#E8F1FF] group-hover:border-[#D4E4F7] group-hover:text-[#0B5ED7] transition-colors">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] group-hover:bg-[#0B5ED7] transition-colors"></span>
                            Chair: {society.chair_name || 'N/A'}
                        </span>

                        {society.faculty_name && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-xs font-medium text-[#166534]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                                Faculty: {society.faculty_name}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-[#64748B] line-clamp-2 mb-6 flex-grow font-light">
                        {society.description || 'No description provided for this society.'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-[#E6F0FF] flex justify-between items-center">
                        <span className="text-[10px] font-mono text-[#94A3B8] overflow-hidden">ID: {society.id}</span>
                        <Link
                            href={`/admin/societies/${society.id}/edit`}
                            className="text-xs font-semibold text-[#0B5ED7] flex items-center gap-1 group/link hover:underline"
                        >
                            Manage Society
                            <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function SocietiesPage() {
    const [societies, setSocieties] = useState<Society[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSocieties();
    }, []);

    const fetchSocieties = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/societies');
            const data = await res.json();
            if (data.success) {
                setSocieties(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch societies', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this society?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:5000/api/societies/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setSocieties(societies.filter(society => society.id !== id));
            } else {
                alert('Failed to delete society');
            }
        } catch (error) {
            console.error('Error deleting society', error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-[#E8F1FF] rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-[#0B5ED7] rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="text-[#64748B] font-medium animate-pulse">Loading Dashboard...</p>
            </div>
        </div>
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl font-bold tracking-tight text-[#0A1A2F]">
                        Societies
                    </h2>
                    <p className="text-[#64748B] mt-2 font-light text-lg">
                        Manage all IEEE student branch chapters
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <Link
                        href="/admin/societies/create"
                        className="relative group overflow-hidden bg-[#0A1A2F] text-white px-8 py-4 rounded-xl font-medium shadow-[0_10px_20px_rgba(10,26,47,0.15)] hover:shadow-[0_15px_30px_rgba(11,94,215,0.25)] transition-all duration-300 flex items-center gap-3"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0B5ED7] to-[#0A1A2F] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 text-xl font-light leading-none mb-0.5">+</span>
                        <span className="relative z-10">Add New Society</span>
                    </Link>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {societies.map((society, index) => (
                    <SocietyCard
                        key={society.id}
                        society={society}
                        index={index}
                        onDelete={handleDelete}
                    />
                ))}

                {societies.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="col-span-full py-32 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-sm border border-dashed border-[#D4E4F7] rounded-[40px]"
                    >
                        <div className="w-24 h-24 rounded-full bg-[#E8F1FF] flex items-center justify-center mb-6">
                            <svg className="w-10 h-10 text-[#0B5ED7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#0A1A2F] mb-2">No Societies Yet</h3>
                        <p className="text-[#64748B] max-w-md mx-auto mb-8">Get started by adding your first technical society to the student branch.</p>
                        <Link
                            href="/admin/societies/create"
                            className="text-[#0B5ED7] font-medium hover:underline"
                        >
                            Create a Society &rarr;
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
