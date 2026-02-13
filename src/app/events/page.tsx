"use client";

import { useState, useRef, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { useEvents } from "@/lib/api/hooks";
import { EventStatus } from "@/lib/api/types";
import { formatDateIST } from "@/utils/helpers";
import Marquee from "@/components/layout/Marquee";

const statuses = ["All", "Upcoming", "Live", "Past"];

export default function EventsPage() {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const eventsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(eventsRef, { once: true, amount: 0.1 });

  // Fetch events from backend API
  const { events: allEvents, loading, error } = useEvents();

  // Filter events by status
  const filteredEvents = useMemo(() => {
    if (selectedStatus === "All") return allEvents;
    return allEvents.filter(
      (event) => event.status === selectedStatus.toUpperCase()
    );
  }, [allEvents, selectedStatus]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return formatDateIST(dateString);
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case EventStatus.LIVE:
        return "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-pulse";
      case EventStatus.UPCOMING:
        return "bg-gradient-to-r from-royal to-navy text-white shadow-lg";
      case EventStatus.PAST:
        return "bg-navy/90 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

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
            <span className="text-royal font-semibold text-sm">EVENTS & INITIATIVES</span>
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
                {selectedStatus} <span className="text-royal ml-4">Events</span>
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
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            {/* Status Filter */}
            <div className="flex gap-3">
              {statuses.map((status) => (
                <motion.button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${selectedStatus === status
                    ? "bg-navy text-white shadow-lg"
                    : "bg-white/90 text-navy/70 border border-royal/20 hover:border-royal/40 hover:bg-white"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section ref={eventsRef} className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="text-center py-32">
              <div className="inline-block p-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-royal/20">
                <div className="w-16 h-16 border-4 border-royal/30 border-t-royal rounded-full animate-spin mx-auto mb-4" />
                <p className="text-xl font-semibold text-navy/70">Loading Events...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-32">
              <div className="inline-block p-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-red-200">
                <p className="text-2xl font-bold text-red-600 mb-2">⚠️ Error Loading Events</p>
                <p className="text-navy/60">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-royal text-white rounded-full font-semibold hover:bg-navy transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {!loading && !error && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              layout
            >
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group relative rounded-3xl overflow-hidden"
                  whileHover={{ y: -12 }}
                >
                  {/* Glass Card */}
                  <div className="relative h-full bg-white/70 backdrop-blur-xl border border-royal/20 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-royal/20 transition-all duration-500">
                    {/* Status Badge */}
                    <div
                      className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-bold z-10 backdrop-blur-sm ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </div>

                    {/* Image Section with Event Image or Gradient */}
                    <motion.div
                      className="relative h-56 overflow-hidden"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-royal via-navy to-royal">
                          {/* Animated Pattern */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-full animate-spin-slow" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-full animate-spin-reverse" />
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-black opacity-20 tracking-tighter">
                            IEEE
                          </div>
                        </div>
                      )}

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                    </motion.div>

                    {/* Content */}
                    <div className="p-7">
                      {/* Date */}
                      <p className="text-sm text-navy/50 font-medium mb-3 tracking-wide">
                        📅 {formatDate(event.start_time)}
                        {event.end_time && event.start_time !== event.end_time &&
                          ` - ${formatDate(event.end_time)}`
                        }
                      </p>

                      {/* Title */}
                      <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-royal transition-colors leading-tight">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="text-navy/70 leading-relaxed mb-6 line-clamp-3">
                        {event.description || "Join us for this exciting event!"}
                      </p>

                      {/* Learn More Link */}
                      <div className="flex items-center gap-2 text-royal font-semibold group-hover:gap-4 transition-all">
                        <span>Explore Event</span>
                        <svg
                          className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Hover Gradient Border Effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-royal/20 via-transparent to-navy/20" />
                    </div>
                  </div>
                </motion.div>
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
              <div className="inline-block p-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-royal/20">
                <p className="text-3xl font-bold text-navy/40 mb-2">No Events Found</p>
                <p className="text-navy/50">
                  {selectedStatus !== "All"
                    ? `No ${selectedStatus.toLowerCase()} events at the moment`
                    : "No events available"}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
      <section className="bg-white">
        <Marquee />
      </section>
      <Footer />
    </main>
  );
}
