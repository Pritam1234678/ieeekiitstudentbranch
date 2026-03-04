"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { useEvents } from "@/lib/api/hooks";
import { formatDateIST } from "@/utils/helpers";
import Marquee from "@/components/layout/Marquee";
import GalleryCarousel from "@/components/ui/GalleryCarousel";
import HoverCarousel from "@/components/ui/HoverCarousel";
import { getApiUrl } from "@/lib/api/config";

const statuses = ["All", "Upcoming", "Live", "Past"];

export default function EventsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [galleryEvent, setGalleryEvent] = useState<{ id: string; title: string } | null>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(eventsRef, { once: true, amount: 0.1 });

  const { events: allEvents, loading, error } = useEvents();

  // Prefetch all images as soon as events are available — fires before render
  useEffect(() => {
    if (!allEvents || allEvents.length === 0) return;

    // Use a single batch to avoid flooding the network
    const preloadQueue: string[] = [];

    allEvents.forEach((event) => {
      // 1. Queue cover image
      if (event.image_url) {
        preloadQueue.push(getApiUrl(event.image_url));
      }
      // 2. Prefetch event gallery images in the background
      fetch(getApiUrl(`/api/events/${event.id}`))
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.images?.length > 0) {
            data.data.images.forEach((imgData: any) => {
              const img = new window.Image();
              img.src = getApiUrl(imgData.url);
            });
          }
        })
        .catch(() => { });
    });

    // Batch-load cover images using Image objects so browser caches them
    preloadQueue.forEach((src, i) => {
      const img = new window.Image();
      // Give first few images high priority so they show instantly
      (img as any).fetchpriority = i < 4 ? 'high' : 'low';
      img.src = src;
    });
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (selectedStatus === "All") return allEvents;
    return allEvents.filter(
      (event) => event.status === selectedStatus.toUpperCase()
    );
  }, [allEvents, selectedStatus]);

  const formatDate = (dateString: string) => formatDateIST(dateString);

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-white via-sky to-white -z-10" />

      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-royal/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky/40 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 px-6 py-2 bg-white/80 backdrop-blur-sm border border-royal/20 rounded-full"
          >
            <span className="text-royal font-semibold text-sm">EVENTS &amp; INITIATIVES</span>
          </motion.div>

          <div className="h-24 md:h-32 mb-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1
                key={selectedStatus}
                className="text-6xl md:text-8xl font-bold text-navy tracking-tight absolute inset-0 flex justify-center items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {selectedStatus}&nbsp;<span className="text-royal">Events</span>
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            className="text-xl md:text-2xl text-navy/60 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Technical workshops, hackathons, and competitions crafted to elevate your engineering journey
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 sticky top-24 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-3 justify-center flex-wrap">
            {statuses.map((status) => (
              <motion.button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedStatus === status
                  ? "bg-[#0F1419] text-white shadow-lg shadow-[#0F1419]/20"
                  : "bg-white text-[#4A90E2] border border-[#D4E4F7] hover:border-[#4A90E2] hover:bg-[#F0F7FF]"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {status}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section ref={eventsRef} className="py-16 px-6 relative">
        <div className="max-w-7xl mx-auto">

          {/* Loading */}
          {loading && (
            <div className="text-center py-32">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-[#D4E4F7] border-t-[#4A90E2] rounded-full animate-spin" />
                <p className="text-[#64748B] text-sm tracking-widest uppercase">Loading Events</p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-32">
              <div className="inline-block p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-red-400/20">
                <p className="text-2xl font-bold text-red-400 mb-2">⚠️ Error Loading Events</p>
                <p className="text-white/40">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              layout
            >
              {filteredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={index}
                  isInView={isInView}
                  formatDate={formatDate}
                  setGalleryEvent={setGalleryEvent}
                />
              ))}
            </motion.div>
          )}

          {/* No Results */}
          {!loading && !error && filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="inline-block p-10 bg-white/90 backdrop-blur-xl rounded-3xl border border-[#D4E4F7]/50 shadow-[0_8px_32px_rgba(74,144,226,0.1)]">
                <p className="text-3xl font-light text-[#0F1419] mb-3">No Events Found</p>
                <p className="text-[#64748B] text-lg font-light">
                  {selectedStatus !== "All"
                    ? `No ${selectedStatus.toLowerCase()} events at the moment`
                    : "No events available"}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />

      {/* Gallery Carousel */}
      <AnimatePresence>
        {galleryEvent && (
          <GalleryCarousel
            key={galleryEvent.id}
            eventId={galleryEvent.id}
            eventTitle={galleryEvent.title}
            onClose={() => setGalleryEvent(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// Separate component to safely use hooks inside mapped items
function EventCard({ event, index, isInView, formatDate, setGalleryEvent }: any) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden"
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Full-bleed card */}
      <div className="relative h-[440px] w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl shadow-black/40 group-hover:border-white/15 group-hover:shadow-royal/20 transition-all duration-500">

        {/* Background layer */}
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Base Image or Placeholder */}
          <div className="absolute inset-0">
            {event.image_url ? (
              <img
                src={getApiUrl(event.image_url)}
                alt={event.title}
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
                fetchPriority={index < 4 ? 'high' : 'low'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#0B3D91] via-[#0a1628] to-[#041024] flex items-center justify-center">
                <span className="text-white/5 text-[120px] font-black tracking-tighter select-none">IEEE</span>
              </div>
            )}
          </div>

          {/* Hover Sliding Image Carousel */}
          <HoverCarousel
            eventId={event.id}
            isHovered={isHovered}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-royal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status badge */}
        <div className="absolute top-4 left-4 z-20">
          {event.status === "LIVE" ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[11px] font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              Live Now
            </div>
          ) : event.status === "UPCOMING" ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-royal/20 backdrop-blur-md border border-royal/30 text-blue-200 text-[11px] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300" />
              Upcoming
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/50 text-[11px] font-bold tracking-widest uppercase">
              Past
            </div>
          )}
        </div>

        {/* View Details External Link */}
        {event.status !== "UPCOMING" && (
          <Link
            href={`/events/${event.id}`}
            className="absolute top-4 right-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white hover:bg-white hover:text-[#0B3D91] hover:scale-110 transition-all duration-300 group/link"
            aria-label={`View details for ${event.title}`}
          >
            <svg className="w-4 h-4 group-hover/link:translate-x-[2px] group-hover/link:-translate-y-[2px] transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        )}

        {/* Index watermark (Moved slightly down) */}
        <div className="absolute top-16 right-5 z-20 font-black text-white/10 text-sm tabular-nums tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
          {/* Thin accent line */}
          <div className="w-8 h-px bg-white/30 group-hover:w-16 group-hover:bg-royal transition-all duration-500 mb-4" />

          {/* Date */}
          <p className="text-white/40 text-[11px] font-semibold tracking-[0.2em] uppercase mb-2">
            {formatDate(event.start_time)}
            {event.end_time && event.start_time !== event.end_time &&
              ` — ${formatDate(event.end_time)}`}
          </p>

          {/* Title */}
          <h3 className="text-white text-[1.35rem] font-bold leading-snug mb-4 line-clamp-2 group-hover:text-sky-200 transition-colors duration-300">
            {event.title}
          </h3>

          {/* CTA */}
          {event.status === "UPCOMING" ? (
            <Link
              href={`/events/${event.id}`}
              className="relative w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white/8 backdrop-blur-md border border-white/12 text-white text-sm font-semibold overflow-hidden group/btn hover:border-white/30 transition-colors duration-300"
              aria-label="View Details"
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 bg-gradient-to-r from-royal/30 to-sky-500/20 transition-transform duration-500 ease-out" />
              <span className="relative flex items-center gap-2 text-white/80 group-hover/btn:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                View Details
              </span>
              <svg className="relative w-4 h-4 text-white/40 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                setGalleryEvent({ id: event.id, title: event.title });
              }}
              className="relative w-full flex items-center justify-between px-5 py-3 rounded-xl bg-white/8 backdrop-blur-md border border-white/12 text-white text-sm font-semibold overflow-hidden group/btn hover:border-white/30 transition-colors duration-300"
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              aria-label="View gallery"
            >
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 bg-gradient-to-r from-royal/30 to-sky-500/20 transition-transform duration-500 ease-out" />
              <span className="relative flex items-center gap-2 text-white/80 group-hover/btn:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Gallery
              </span>
              <svg className="relative w-4 h-4 text-white/40 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
