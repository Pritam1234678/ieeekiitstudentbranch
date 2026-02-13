"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useEvents } from "@/lib/api/hooks";
import { EventStatus } from "@/lib/api/types";
import { formatDateIST } from "@/utils/helpers";

const EventsPreview = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Fetch events from backend API
  const { events: allEvents, loading, error } = useEvents();

  // Get only upcoming events, limit to 3 for preview
  const events = allEvents
    .filter(event => event.status === EventStatus.UPCOMING)
    .slice(0, 3);

  // Format date for display
  const formatDate = (dateString: string) => {
    return formatDateIST(dateString);
  };

  useEffect(() => {
    if (events.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % events.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [events.length]);

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-blue-200 text-xl">Loading Events...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Failed to load events</p>
          <p className="text-blue-200">{error}</p>
        </div>
      </section>
    );
  }

  // No events state
  if (events.length === 0) {
    return (
      <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-blue-200 text-xl">No upcoming events at the moment</p>
          <Link
            href="/events"
            className="inline-block mt-4 text-blue-400 hover:text-blue-300 font-semibold"
          >
            View All Events
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Join us for cutting-edge workshops, hackathons, and technical events
            that push the boundaries of innovation.
          </p>
        </motion.div>

        {/* Cards Container - Centered */}
        <div className="relative h-[380px] flex items-center justify-center mb-12">
          {events.map((event, index) => {
            let offset = index - activeIndex;
            if (offset > events.length / 2) offset -= events.length;
            if (offset < -events.length / 2) offset += events.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1;
            const isHovered = hoveredIndex === index;

            const shift = offset * 360;
            const scale = isActive ? 1 : 0.88;
            const opacity = isActive ? 1 : 0.6;
            const zIndex = isActive ? 20 : 10 - Math.abs(offset);

            return (
              <motion.div
                key={event.id}
                className="absolute"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: shift,
                  scale: scale,
                  opacity: isVisible ? opacity : 0,
                  zIndex: zIndex,
                }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  pointerEvents: isVisible ? "auto" : "none",
                }}
              >
                <div
                  className={`w-[340px] h-[340px] bg-gradient-to-br from-blue-900/95 via-blue-800/90 to-blue-950/95 backdrop-blur-lg rounded-3xl p-8 border flex flex-col justify-between transition-all duration-500 relative overflow-hidden ${isActive
                    ? "border-blue-500/40"
                    : "border-blue-700/30"
                    } ${isHovered
                      ? "!border-blue-400/70 shadow-[0_0_50px_rgba(59,130,246,0.5)]"
                      : ""
                    }`}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-blue-900/20 rounded-3xl" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Status Badge and Date */}
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${isHovered
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50"
                          : "bg-blue-800/60 text-blue-200"
                          }`}
                      >
                        {event.status}
                      </span>
                      <span className="text-blue-200/80 text-sm font-medium">
                        {formatDate(event.start_time)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-blue-100/90 text-base leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Decorative corner element */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dots Navigation - Centered */}
        <div className="flex justify-center gap-3 mb-8">
          {events.map((event, index) => (
            <button
              key={event.id}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-300 rounded-full ${index === activeIndex
                ? "w-12 h-3 bg-blue-500 shadow-lg shadow-blue-500/50"
                : "w-3 h-3 bg-slate-600 hover:bg-slate-500"
                }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Link - Centered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-lg transition-colors duration-200 group"
          >
            View All Events
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EventsPreview;
