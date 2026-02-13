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

  // Get only past events
  let events = allEvents
    .filter(event => event.status === EventStatus.PAST);

  // Duplicate events if few to maintain carousel balance (Center, Left, Right)
  if (events.length === 1) {
    events = [...events, ...events, ...events]; // 1 -> 3
  } else if (events.length === 2) {
    events = [...events, ...events]; // 2 -> 4
  }

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
          <p className="text-blue-200 text-xl">No past events found</p>
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
    <section className="relative min-h-screen bg-[#030712] py-24 overflow-hidden flex flex-col justify-center">
      {/* Dynamic Background Elements - Award Winning Tech Look */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep, rich gradient base */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(17,24,39,1),_rgba(3,7,18,1))]" />

        {/* Animated Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

        {/* Ambient Glows */}
        <motion.div
          animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen"
        />
        <motion.div
          animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen"
        />
      </div>

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        {/* Header - Premium Typography */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/50 mb-6 tracking-tight drop-shadow-2xl">
              Past Events
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6" />
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              A showcase of our <span className="text-blue-400 font-medium">legacy</span> and <span className="text-purple-400 font-medium">impact</span> through technology.
            </p>
          </motion.div>
        </div>

        {/* Cards Container - Centered */}
        <div className="relative h-[420px] flex items-center justify-center mb-16 perspective-1000">
          {events.map((event, index) => {
            let offset = index - activeIndex;
            if (offset > events.length / 2) offset -= events.length;
            if (offset < -events.length / 2) offset += events.length;

            const isActive = offset === 0;
            const isVisible = Math.abs(offset) <= 1; // Max 3 visible (Center + 1 each side)
            const isHovered = hoveredIndex === index;

            // Dynamic spacing based on count to fit within view
            const baseSpacing = events.length > 3 ? 420 : 500;
            const shift = offset * baseSpacing;

            const scale = isActive ? 1 : 0.85;
            const opacity = isVisible ? (isActive ? 1 : 0.4) : 0;
            const zIndex = isActive ? 50 : 40 - Math.abs(offset);
            const rotateY = offset * -15; // 3D rotation effect

            return (
              <motion.div
                key={`${event.id}-${index}`}
                className="absolute"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  x: shift,
                  scale: scale,
                  opacity: opacity,
                  zIndex: zIndex,
                  rotateY: rotateY,
                }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 25,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  pointerEvents: isVisible ? "auto" : "none",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className={`w-[360px] h-[380px] bg-[#0f172a]/80 backdrop-blur-xl rounded-[2rem] p-8 border transition-all duration-500 relative overflow-hidden group
                    ${isActive
                      ? "border-blue-500/30 shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)]"
                      : "border-white/5"
                    } ${isHovered && isActive
                      ? "!border-blue-400/50 shadow-[0_0_80px_-20px_rgba(59,130,246,0.8)] scale-[1.02]"
                      : ""
                    }`}
                >
                  {/* Glass Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />

                  {/* Glow Effect */}
                  <div className={`absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : ''}`} />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* Status Badge and Date */}
                    <div className="flex justify-between items-start mb-8">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 border ${isActive
                          ? "bg-blue-500/10 border-blue-500/50 text-blue-400"
                          : "bg-slate-800/50 border-slate-700 text-slate-400"
                          }`}
                      >
                        {event.status}
                      </span>
                      <span className="text-slate-400 text-xs font-medium tracking-wide">
                        {formatDate(event.start_time)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl font-bold text-white mb-4 leading-tight group-hover:text-blue-200 transition-colors">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-4">
                      {event.description}
                    </p>

                    {/* Learn More - Only on Active */}
                    <div className={`mt-auto pt-6 flex items-center text-sm font-semibold text-blue-400 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <span>View Details</span>
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dots Navigation - Premium Pills */}
        <div className="flex justify-center gap-2 mb-12">
          {events.map((event, index) => (
            <button
              key={`${event.id}-dot-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`transition-all duration-500 h-1.5 rounded-full ${index === activeIndex
                ? "w-16 bg-gradient-to-r from-blue-500 to-purple-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
              aria-label={`Go to event ${index + 1}`}
            />
          ))}
        </div>

        {/* View All Link - Minimalist */}
        <div className="text-center">
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all duration-300 group hover:scale-105 backdrop-blur-md"
          >
            <span>Explore All Events</span>
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <svg
                className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>

  );
};

export default EventsPreview;
