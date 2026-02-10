"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const allEvents = [
  {
    id: 1,
    title: "TechXcelerate 2026",
    date: "March 15, 2026",
    description:
      "Annual technical symposium featuring workshops, competitions, and keynote speakers from industry leaders. Experience cutting-edge technology demonstrations and networking opportunities.",
    category: "Symposium",
    status: "upcoming",
  },
  {
    id: 2,
    title: "AI/ML Workshop Series",
    date: "February 20, 2026",
    description:
      "Comprehensive hands-on workshop covering fundamentals of artificial intelligence and machine learning with real-world applications and project development.",
    category: "Workshop",
    status: "upcoming",
  },
  {
    id: 3,
    title: "HackIEEE 48hr",
    date: "April 5, 2026",
    description:
      "48-hour hackathon challenging students to build innovative solutions for real-world problems. Team collaboration, mentorship, and exciting prizes await.",
    category: "Hackathon",
    status: "upcoming",
  },
  {
    id: 4,
    title: "IoT Innovation Lab",
    date: "March 1, 2026",
    description:
      "Explore the Internet of Things with practical projects covering sensors, connectivity, and cloud integration using industry-standard tools.",
    category: "Lab Session",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Robotics Championship 2025",
    date: "November 20, 2025",
    description:
      "National level robotics competition with over 500 participants. Teams built autonomous robots to solve complex challenges.",
    category: "Competition",
    status: "past",
  },
  {
    id: 6,
    title: "Web Development Bootcamp",
    date: "December 10, 2025",
    description:
      "Intensive 3-day bootcamp on modern web development technologies including React, Node.js, and cloud deployment strategies.",
    category: "Bootcamp",
    status: "past",
  },
  {
    id: 7,
    title: "IEEE Day Celebration",
    date: "October 1, 2025",
    description:
      "Global IEEE Day celebrations featuring technical talks, cultural activities, and community outreach programs.",
    category: "Celebration",
    status: "past",
  },
  {
    id: 8,
    title: "Quantum Computing Seminar",
    date: "January 15, 2026",
    description:
      "Expert-led seminar on quantum computing fundamentals, current research, and future applications in various industries.",
    category: "Seminar",
    status: "upcoming",
  },
];

const categories = ["All", "Symposium", "Workshop", "Hackathon", "Competition", "Bootcamp", "Seminar"];
const statuses = ["All", "Upcoming", "Past"];

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const eventsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(eventsRef, { once: true, amount: 0.1 });

  const filteredEvents = allEvents.filter((event) => {
    const categoryMatch =
      selectedCategory === "All" || event.category === selectedCategory;
    const statusMatch =
      selectedStatus === "All" ||
      event.status === selectedStatus.toLowerCase();
    return categoryMatch && statusMatch;
  });

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

          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-8 text-navy tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Upcoming <span className="text-royal">Events</span>
          </motion.h1>
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
      <section className="py-8 px-6 sticky top-24 z-40 backdrop-blur-xl bg-white/60 border-b border-royal/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-royal to-navy text-white shadow-lg shadow-royal/25"
                      : "bg-white/90 text-navy/70 border border-royal/20 hover:border-royal/40 hover:bg-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-3">
              {statuses.map((status) => (
                <motion.button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    selectedStatus === status
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
                    className={`absolute top-5 right-5 px-4 py-1.5 rounded-full text-xs font-bold z-10 backdrop-blur-sm ${
                      event.status === "upcoming"
                        ? "bg-gradient-to-r from-royal to-navy text-white shadow-lg"
                        : "bg-navy/90 text-white"
                    }`}
                  >
                    {event.status.toUpperCase()}
                  </div>

                  {/* Image Section with Gradient */}
                  <motion.div
                    className="relative h-56 bg-gradient-to-br from-royal via-navy to-royal overflow-hidden"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Animated Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-full animate-spin-slow" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-white rounded-full animate-spin-reverse" />
                    </div>
                    
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-black opacity-20 tracking-tighter">
                      IEEE
                    </div>
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  </motion.div>

                  {/* Content */}
                  <div className="p-7">
                    {/* Category Badge */}
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-sky to-royal/10 text-royal text-xs font-bold rounded-full mb-4 border border-royal/20">
                      {event.category}
                    </div>

                    {/* Date */}
                    <p className="text-sm text-navy/50 font-medium mb-3 tracking-wide">
                      {event.date}
                    </p>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-royal transition-colors leading-tight">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="text-navy/70 leading-relaxed mb-6 line-clamp-3">
                      {event.description}
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

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <div className="inline-block p-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-royal/20">
                <p className="text-3xl font-bold text-navy/40 mb-2">No Events Found</p>
                <p className="text-navy/50">Try adjusting your filters</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
