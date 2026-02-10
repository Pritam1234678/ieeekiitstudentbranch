"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const members = [
  {
    name: "Aarav Sharma",
    role: "Chair",
    department: "Computer Science",
    year: "Final Year",
  },
  {
    name: "Diya Patel",
    role: "Vice Chair",
    department: "Electronics & Communication",
    year: "Third Year",
  },
  {
    name: "Rohan Gupta",
    role: "Secretary",
    department: "Information Technology",
    year: "Third Year",
  },
  {
    name: "Ananya Singh",
    role: "Treasurer",
    department: "Computer Science",
    year: "Second Year",
  },
  {
    name: "Arjun Mehta",
    role: "Technical Lead",
    department: "Computer Science",
    year: "Final Year",
  },
  {
    name: "Priya Desai",
    role: "Events Coordinator",
    department: "Electronics & Telecom",
    year: "Third Year",
  },
  {
    name: "Vikram Reddy",
    role: "Web Development Lead",
    department: "Information Technology",
    year: "Third Year",
  },
  {
    name: "Sneha Iyer",
    role: "Content Head",
    department: "Computer Science",
    year: "Second Year",
  },
  {
    name: "Aditya Kumar",
    role: "AI/ML Team Lead",
    department: "Computer Science",
    year: "Final Year",
  },
  {
    name: "Kavya Nair",
    role: "Design Lead",
    department: "Computer Science",
    year: "Third Year",
  },
  {
    name: "Ishaan Joshi",
    role: "Marketing Head",
    department: "Electronics & Communication",
    year: "Second Year",
  },
  {
    name: "Riya Bansal",
    role: "Social Media Manager",
    department: "Information Technology",
    year: "Second Year",
  },
];

const teams = [
  {
    name: "Executive Board",
    members: members.slice(0, 4),
    color: "from-primary to-primary-dark",
  },
  {
    name: "Technical Team",
    members: members.slice(4, 9),
    color: "from-primary-dark to-primary",
  },
  {
    name: "Operations Team",
    members: members.slice(9),
    color: "from-primary to-primary-dark",
  },
];

export default function MembersPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <main className="min-h-screen bg-app-gradient">
      <Navigation />

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="pt-32 pb-20 px-6 bg-app-gradient"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-gradient mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            Our Team
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-primary-dark/70 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Meet the passionate individuals driving innovation and excellence at
            IEEE KIIT Student Branch.
          </motion.p>
        </div>
      </section>

      {/* Teams Sections */}
      {teams.map((team, teamIndex) => (
        <TeamSection
          key={team.name}
          team={team}
          index={teamIndex}
        />
      ))}

      {/* Join Us CTA */}
      <section className="py-32 px-6 bg-deep-gradient text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Join Our Team
          </motion.h2>
          <motion.p
            className="text-xl text-white/80 mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            We&apos;re always looking for talented and passionate individuals to join
            our community. Be part of something bigger.
          </motion.p>
          <motion.button
            className="px-8 py-4 bg-white/90 text-primary-dark rounded-full font-medium hover:bg-white transition-all magnetic"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Get In Touch
          </motion.button>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TeamSection({
  team,
  index,
}: {
  team: { name: string; members: typeof members; color: string };
  index: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-6 ${index % 2 === 0 ? "bg-white/70" : "bg-secondary/60"}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Team Title */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
            {team.name}
          </h2>
          <motion.div
            className="w-24 h-1 bg-primary"
            initial={{ width: 0 }}
            animate={isInView ? { width: 96 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.members.map((member, memberIndex) => (
            <motion.div
              key={member.name}
              className="group relative bg-card-gradient backdrop-blur-sm border border-secondary-gray/70 rounded-2xl p-6 hover:border-primary transition-all overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: memberIndex * 0.05 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Avatar Placeholder */}
              <motion.div
                className={`w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br ${team.color} flex items-center justify-center text-white text-3xl font-bold`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </motion.div>

              {/* Member Info */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-primary-dark mb-1 group-hover:text-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-primary text-sm font-semibold mb-2">
                  {member.role}
                </p>
                <p className="text-primary-dark/60 text-sm">{member.department}</p>
                <p className="text-primary-dark/50 text-xs mt-1">{member.year}</p>
              </div>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  boxShadow: "0 0 40px rgba(30, 79, 255, 0.2)",
                }}
              />

              {/* Blue Light Border on Hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ scale: 0.95 }}
                whileHover={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
