"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEvents } from "@/lib/api/hooks";
import { EventStatus } from "@/lib/api/types";
import { getApiUrl } from "@/lib/api/config";

const EventsPreview = () => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Fetch events from backend API
  const { events: allEvents, loading, error } = useEvents();

  // Get only past events, limit to 4 for the best accordion layout
  const events = allEvents
    .filter(event => event.status === EventStatus.PAST)
    .slice(0, 4);

  // Set initial active event once loaded
  useEffect(() => {
    if (events.length > 0 && !activeId) {
      setActiveId(events[0].id);
    }
  }, [events, activeId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Generate deterministic gradient based on ID string
  const getGradient = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 20%), hsl(${hue2}, 80%, 10%))`;
  };

  const handleHoverActivate = (id: string) => {
    if (typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setActiveId(id);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-[80vh] bg-[#020617] py-20 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-[#020617] to-[#020617]" />
        <div className="text-center relative z-10">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200/50 text-sm tracking-widest uppercase">Loading Archives...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative min-h-[50vh] bg-[#020617] flex items-center justify-center">
        <p className="text-red-400/50">Details unavailable</p>
      </section>
    );
  }

  // No events state
  if (events.length === 0) {
    return null;
  }

  return (
    <section className="relative min-h-screen bg-[#020617] py-16 sm:py-20 md:py-24 overflow-hidden flex flex-col justify-center">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6"
        >
          <div>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white tracking-tight leading-none mb-4">
              Past <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Events</span>
            </h2>
            <p className="text-blue-200/60 text-base sm:text-lg max-w-xl leading-relaxed">
              Explore our history of innovation, workshops, and technical breakthroughs.
            </p>
          </div>

          <Link
            href="/events"
            className="group flex items-center gap-3 text-white/80 hover:text-white transition-colors pb-2"
          >
            <span className="text-sm font-medium tracking-widest uppercase">View Archive</span>
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
              <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </Link>
        </motion.div>

        {/* Interactive Gallery */}
        <LayoutGroup>
          <div className="flex flex-col md:flex-row gap-3 h-[620px] sm:h-[700px] md:h-[600px] w-full">
            {events.map((event, index) => {
              const isActive = activeId === event.id;

              return (
                <motion.div
                  key={event.id}
                  layout
                  tabIndex={0}
                  aria-expanded={isActive}
                  onClick={() => setActiveId(event.id)}
                  onMouseEnter={() => handleHoverActivate(event.id)}
                  onFocus={() => setActiveId(event.id)}
                  className={`relative rounded-[28px] overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]
                                        ${isActive
                      ? 'flex-[3] opacity-100'
                      : 'flex-[1] md:flex-[0.5] opacity-80 hover:opacity-100 md:hover:flex-[0.8]'
                    }
                                    `}
                >
                  {/* Event Image / Gradient */}
                  <div className="absolute inset-0 z-0">
                    {event.image_url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={getApiUrl(event.image_url)}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-1000 ease-out"
                          style={{ transform: isActive ? 'scale(1.05)' : 'scale(1.5)' }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 35vw"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ background: getGradient(event.id) }}
                      />
                    )}
                    {/* Cinematic overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/20 to-transparent transition-opacity duration-500 ${isActive ? 'opacity-90' : 'opacity-60'}`} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-5 sm:p-8">
                    {/* Index Number */}
                    <div className={`absolute top-4 left-4 sm:top-6 sm:left-6 text-3xl sm:text-4xl font-bold tracking-tighter text-white/10 transition-all duration-500
                                            ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
                                        `}>
                      0{index + 1}
                    </div>

                    <motion.div layout="position" className="space-y-4">
                      {/* Date Badge */}
                      <div className={`flex items-center gap-3 transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0 md:opacity-0 md:translate-y-4'}`}>
                        <div className="h-[1px] w-8 bg-blue-500/50" />
                        <span className="text-blue-300 font-mono text-xs tracking-widest uppercase">
                          {formatDate(event.start_time)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className={`font-bold text-white leading-tight transition-all duration-500 origin-left whitespace-normal md:whitespace-nowrap
                                                ${isActive ? 'text-2xl sm:text-3xl md:text-5xl mb-2 translate-x-0 rotate-0' : 'text-lg sm:text-xl md:text-2xl md:-rotate-90 md:translate-x-[-50%] md:absolute md:bottom-24 md:left-8'}
                                            `}>
                        {event.title}
                      </h3>

                      {/* Expanded Details */}
                      <div className={`overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${isActive ? 'max-h-[260px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-white/70 text-sm sm:text-base md:text-lg mb-5 sm:mb-6 line-clamp-3 max-w-lg">
                          {event.description}
                        </p>
                        <Link
                          href={`/events/${event.id}`}
                          className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-xs sm:text-sm font-medium transition-colors border border-white/10"
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          View Details
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
};

export default EventsPreview;
