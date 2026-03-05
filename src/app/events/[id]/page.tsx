'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { getApiUrl } from '@/lib/api/config';
import { formatDateIST } from '@/utils/helpers';

interface EventDetail {
    id: string;
    title: string;
    image_url: string;
    description: string;
    start_time: string;
    end_time: string;
    status: 'UPCOMING' | 'LIVE' | 'PAST';
    location?: string;
    place?: string;
    managed_by?: string[];
    contact_details?: string;
    registration_link?: string;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [event, setEvent] = useState<EventDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Animate the hero image on scroll
    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const imageOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.2]);
    const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/events/${id}`));
                const data = await res.json();

                if (res.ok && data.success) {
                    setEvent(data.data);
                } else {
                    setError(data.error || 'Failed to fetch event details.');
                }
            } catch (err) {
                console.error('Error fetching event details', err);
                setError('Unable to load the event. Please verify your connection.');
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <main className="min-h-screen bg-white">
                <Navigation />
                <div className="h-screen flex items-center justify-center">
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 100 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
                        className="w-1 bg-[#0B3D91]"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="absolute tracking-[0.5em] text-[#0B3D91] font-bold text-xs uppercase ml-12"
                    >
                        Initializing
                    </motion.div>
                </div>
            </main>
        );
    }

    if (error || !event) {
        return (
            <main className="min-h-screen bg-white flex flex-col">
                <Navigation />
                <div className="flex-grow flex items-center justify-center p-6">
                    <div className="border-[0.5rem] border-[#0B3D91] p-12 max-w-2xl w-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A90E2] -translate-y-16 translate-x-16 rotate-45" />
                        <h1 className="text-5xl md:text-7xl font-black text-[#0B3D91] mb-6 tracking-tighter uppercase leading-none">
                            404<br />Void
                        </h1>
                        <p className="text-xl text-[#0A1A2F] mb-12 font-medium max-w-sm">{error || "Signal lost. The requested event coordinates cannot be found in the system."}</p>
                        <Link
                            href="/events"
                            className="group relative inline-flex items-center gap-4 bg-[#0B3D91] text-white px-8 py-4 font-bold tracking-widest uppercase overflow-hidden"
                        >
                            <span className="relative z-10">Abort Mission</span>
                            <div className="absolute inset-0 bg-[#4A90E2] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const isRegistrationOpen = event.status === 'UPCOMING' && event.registration_link;

    // Helper to render infinite scrolling ticker text
    const MarqueeText = () => (
        <div className="flex whitespace-nowrap overflow-hidden bg-[#0A1A2F] text-white py-3 border-y border-[#4A90E2]/30">
            <motion.div
                className="flex gap-8 items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            >
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8">
                        <span className="text-xs font-bold tracking-[0.3em] uppercase">
                            {event.status === 'LIVE' ? 'Broadcast Live / Do Not Miss' : event.status === 'UPCOMING' ? 'Prepare for Impact' : 'Archive Entry'}
                        </span>
                        <div className="w-2 h-2 bg-[#4A90E2] rotate-45" />
                        <span className="text-xs font-bold text-[#4A90E2] tracking-[0.3em] uppercase">IEEE KIIT</span>
                        <div className="w-2 h-2 bg-white rotate-45" />
                    </div>
                ))}
            </motion.div>
        </div>
    );

    const formatTime12Hour = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toUpperCase();
    };

    return (
        <main className="min-h-screen bg-white text-[#0A1A2F] selection:bg-[#0B3D91] selection:text-white" ref={containerRef}>
            <Navigation />

            {/* Split Hero Structure */}
            <div className="relative pt-24 min-h-[90vh] flex flex-col justify-between overflow-hidden">

                {/* Rolling Marquee at top */}
                <div className="absolute top-24 left-0 w-full z-40">
                    <MarqueeText />
                </div>

                {/* Return Button */}
                <div className="absolute top-48 left-6 md:left-12 z-40">
                    <Link
                        href="/events"
                        className="group flex items-center gap-3 text-[#0B3D91] hover:text-[#4A90E2] transition-colors"
                    >
                        <svg className="w-6 h-6 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-bold tracking-[0.2em] uppercase text-sm border-b-2 border-transparent group-hover:border-[#4A90E2] pb-1">Directory</span>
                    </Link>
                </div>

                <div className="flex-1 flex flex-col lg:flex-row mt-24 lg:mt-32 relative z-10 px-6 lg:px-12 w-full max-w-[1600px] mx-auto items-center">

                    {/* Massive Typography Left Side */}
                    <motion.div
                        className="flex-1 flex flex-col justify-center py-12 lg:py-0 pr-6"
                        style={{ y: textY }}
                    >
                        <motion.h1
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="text-6xl md:text-8xl lg:text-[7rem] font-black text-[#0B3D91] leading-[0.85] tracking-tighter uppercase break-words"
                        >
                            {event.title}
                        </motion.h1>

                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="mt-12 flex flex-wrap items-end gap-6"
                        >
                            <div className="bg-[#0B3D91] text-white p-6 font-mono border-l-4 border-[#4A90E2]">
                                <div className="text-xs uppercase tracking-widest opacity-60 mb-2">Initiation Date</div>
                                <div className="text-2xl font-bold">{formatDateIST(event.start_time).split(',')[0]}</div>
                            </div>

                            <div className="bg-white border-2 border-[#0B3D91] text-[#0B3D91] p-6 font-mono flex items-end">
                                <div>
                                    <div className="text-xs uppercase tracking-widest opacity-60 mb-2 font-sans font-bold">Sync Time</div>
                                    <div className="text-2xl font-bold">
                                        {formatTime12Hour(event.start_time)}
                                        {event.start_time !== event.end_time && ` → ${formatTime12Hour(event.end_time)}`}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Image Right Side */}
                    <div className="w-full lg:w-[40%] xl:w-[45%] h-[50vh] lg:h-auto min-h-[400px] relative overflow-hidden bg-[#0A1A2F]">
                        <motion.div
                            initial={{ scale: 1.2, filter: "grayscale(100%)" }}
                            animate={{ scale: 1, filter: "grayscale(0%)" }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="w-full h-full relative"
                        >
                            {/* Grid overlay for strict tech aesthetic */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] z-10 pointer-events-none mix-blend-overlay" />

                            {event.image_url ? (
                                <motion.img
                                    src={getApiUrl(event.image_url)}
                                    alt={event.title}
                                    style={{ scale: imageScale, opacity: imageOpacity }}
                                    className="w-full h-full object-cover object-center"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#0B3D91] flex items-center justify-center">
                                    <svg className="w-32 h-32 text-white/10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 4.6l7.4 14.8H4.6L12 6.6z" /></svg>
                                </div>
                            )}

                            {/* Corner Cutout Accents */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-white z-20" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
                            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white z-20" style={{ clipPath: "polygon(0 100%, 0 0, 100% 100%)" }} />
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Structural Grid Content Area */}
            <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 mt-16 md:mt-32 mb-24 md:mb-32">
                <div className="flex flex-col lg:flex-row border-t-4 border-[#0B3D91]">

                    {/* Meta Sidebar */}
                    <div className="w-full lg:w-1/3 border-b-4 lg:border-b-0 lg:border-r-4 border-[#0B3D91] flex flex-col">

                        {/* Status Block */}
                        <div className="p-8 border-b-2 border-[#0B3D91]/20 bg-[#F0F7FF]">
                            <p className="font-mono text-xs uppercase tracking-widest text-[#4A90E2] mb-3">Event Status</p>
                            <div className="flex items-center gap-4">
                                {event.status === 'LIVE' ? (
                                    <>
                                        <motion.div
                                            animate={{ opacity: [1, 0, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="w-4 h-4 bg-red-600 rounded-sm"
                                        />
                                        <span className="text-2xl font-black uppercase text-red-600">Live</span>
                                    </>
                                ) : event.status === 'UPCOMING' ? (
                                    <>
                                        <div className="w-4 h-4 bg-[#0B3D91] rounded-sm" />
                                        <span className="text-2xl font-black uppercase text-[#0B3D91]">Upcoming</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[#0A1A2F] rounded-sm" />
                                        <span className="text-2xl font-black uppercase text-[#0A1A2F]/50">Terminated</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Location Block */}
                        {(event.location || event.place) && (
                            <div className="p-8 border-b-2 border-[#0B3D91]/20">
                                <p className="font-mono text-xs uppercase tracking-widest text-[#4A90E2] mb-3">Coordinates</p>
                                {event.location && <p className="text-xl font-bold text-[#0A1A2F] mb-1">{event.location}</p>}
                                {event.place && <p className="text-lg text-[#0A1A2F]/80">{event.place}</p>}
                            </div>
                        )}

                        {/* Management Block */}
                        {event.managed_by && event.managed_by.length > 0 && (
                            <div className="p-8 border-b-2 border-[#0B3D91]/20">
                                <p className="font-mono text-xs uppercase tracking-widest text-[#4A90E2] mb-4">Managed By</p>
                                <div className="flex flex-wrap gap-3">
                                    {(Array.isArray(event.managed_by) ? event.managed_by : [event.managed_by]).map((society, idx) => (
                                        <span key={idx} className="px-4 py-2 border-2 border-[#0B3D91] text-[#0B3D91] font-bold uppercase tracking-wider text-sm">
                                            {society}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact Block */}
                        <div className="p-8 border-b-2 border-[#0B3D91]/20 bg-[#0A1A2F] text-white">
                            <p className="font-mono text-xs uppercase tracking-widest text-[#4A90E2] mb-3">Emergency Contact</p>
                            <a href={`tel:${event.contact_details || '7608976946'}`} className="group flex items-center gap-3 w-fit">
                                <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter group-hover:text-[#4A90E2] transition-colors">+91 {event.contact_details || '7608976946'}</span>
                                <svg className="w-8 h-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all group-hover:text-[#4A90E2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Description Body */}
                    <div className="w-full lg:w-2/3 flex flex-col justify-between">

                        <div className="p-8 md:p-16 lg:px-24 relative overflow-hidden h-full">
                            {/* Background Deco Grid */}
                            <div className="absolute top-0 right-0 w-[40%] h-full bg-[linear-gradient(rgba(11,61,145,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(11,61,145,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-[#0B3D91] mb-12 flex items-center gap-6">
                                <span className="w-12 h-1 bg-[#4A90E2] block" />
                                Mission Briefing
                            </h2>

                            <div className="prose prose-xl prose-p:font-serif prose-p:font-medium prose-p:text-[#0A1A2F]/80 prose-p:leading-[1.8] max-w-none prose-a:text-[#4A90E2] prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 relative z-10">
                                {event.description ? (
                                    event.description.split('\n').map((paragraph, idx) => (
                                        <p key={idx}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p className="italic text-gray-400 font-sans">Data completely redacted. Awaiting further instruction.</p>
                                )}
                            </div>
                        </div>

                        {/* Huge Registration Button fixed at bottom of right column */}
                        <div className="mt-8 border-t-2 border-[#0B3D91] border-dashed">
                            {isRegistrationOpen ? (
                                <a
                                    href={event.registration_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-between w-full bg-[#0B3D91] text-white p-8 md:p-12 overflow-hidden"
                                >
                                    {/* Hover sweep background */}
                                    <div className="absolute inset-0 bg-[#4A90E2] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] z-0" />

                                    <div className="relative z-10 flex flex-col items-start gap-2">
                                        <span className="font-mono text-xs uppercase tracking-widest text-[#4A90E2] group-hover:text-white transition-colors duration-500">Access Granted</span>
                                        <span className="text-4xl md:text-5xl font-black uppercase tracking-tight">Register Now</span>
                                    </div>

                                    <div className="relative z-10 w-16 h-16 rounded-full border-2 border-white flex items-center justify-center group-hover:bg-white group-hover:text-[#4A90E2] transition-colors duration-500 delay-100">
                                        <svg className="w-8 h-8 group-hover:translate-x-1 -translate-y-1 group-hover:-translate-y-2 transition-transform drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </a>
                            ) : (
                                <div className="w-full bg-[#E2E8F0] p-8 md:p-12 flex items-center justify-between opacity-60">
                                    <div className="flex flex-col items-start gap-2">
                                        <span className="font-mono text-xs uppercase tracking-widest text-gray-500">Access Denied</span>
                                        <span className="text-4xl md:text-5xl font-black uppercase tracking-tight text-gray-400">Lockdown Initiated</span>
                                    </div>
                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
