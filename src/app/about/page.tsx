"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const stats = [
  { label: "Active Members", value: "240+" },
  { label: "Annual Events", value: "35+" },
  { label: "Awards Won", value: "18" },
  { label: "Innovation Labs", value: "3" },
];

const highlights = [
  {
    title: "Research-Driven Culture",
    description:
      "Hands-on labs, project sprints, and IEEE-backed challenges that turn ideas into working prototypes.",
  },
  {
    title: "Leadership & Impact",
    description:
      "We shape confident leaders through mentoring, outreach, and community-building initiatives.",
  },
  {
    title: "Global Collaboration",
    description:
      "Partnerships with IEEE chapters worldwide create opportunities beyond campus boundaries.",
  },
];

const timeline = [
  {
    year: "2011",
    title: "Foundation",
    description:
      "IEEE KIIT Student Branch was established with a vision to create a platform for technical excellence and innovation.",
  },
  {
    year: "2015",
    title: "National Recognition",
    description:
      "Received IEEE India Council's Outstanding Student Branch Award for exceptional activities and member engagement.",
  },
  {
    year: "2019",
    title: "International Collaboration",
    description:
      "Launched collaborative projects with IEEE student branches across the globe, expanding our network and impact.",
  },
  {
    year: "2023",
    title: "Innovation Hub",
    description:
      "Established state-of-the-art innovation lab with cutting-edge equipment for research and development.",
  },
  {
    year: "2026",
    title: "Future Forward",
    description:
      "Leading the charge in emerging technologies with focus on AI, IoT, and sustainable technology solutions.",
  },
];

const values = [
  {
    title: "Excellence",
    description: "Pursuing the highest standards in technical education and professional development.",
  },
  {
    title: "Innovation",
    description: "Fostering creativity and breakthrough thinking in technology solutions.",
  },
  {
    title: "Collaboration",
    description: "Building strong networks and partnerships across academic and industry sectors.",
  },
  {
    title: "Impact",
    description: "Creating meaningful change through technology for society and humanity.",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.2 });
  const isValuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navigation />

      <section ref={heroRef} className="relative min-h-[80vh] overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-700/25 via-blue-950 to-slate-950" />
        <div className="absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[520px] w-[520px] rounded-full bg-sky-400/15 blur-[160px]" />
        <div className="relative max-w-7xl mx-auto pt-28 pb-20">
          <motion.div className="max-w-3xl" style={{ opacity, y }}>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.3em] uppercase text-white/70">
              About IEEE KIIT
            </div>
            <motion.h1
              className="mt-6 text-5xl md:text-7xl font-semibold tracking-tight leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              A modern community shaping tomorrow’s technology leaders.
            </motion.h1>
            <motion.p
              className="mt-6 text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              From research labs to global collaborations, we empower students to
              build, lead, and innovate with purpose.
            </motion.p>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="text-2xl md:text-3xl font-semibold text-white">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-[0.25em] text-white/50 mt-2">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-500 hover:border-blue-400/40 hover:bg-white/10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
              <p className="text-white/65 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div
            className="rounded-3xl border border-blue-400/20 bg-gradient-to-br from-blue-900/60 via-blue-950/70 to-slate-950 p-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold">Our Mission</h2>
            <p className="mt-4 text-white/70 leading-relaxed text-lg">
              To provide a platform for students to build technical depth,
              leadership confidence, and professional impact through real-world
              engineering experiences.
            </p>
          </motion.div>

          <motion.div
            className="rounded-3xl border border-sky-300/20 bg-gradient-to-br from-slate-950 via-blue-950/70 to-blue-900/60 p-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold">Our Vision</h2>
            <p className="mt-4 text-white/70 leading-relaxed text-lg">
              To be the most future-forward student community that bridges
              research, industry, and social good through technology.
            </p>
          </motion.div>
        </div>
      </section>

      <section ref={timelineRef} className="px-6 py-28 bg-gradient-to-b from-slate-950 via-blue-950/60 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">
              Timeline
            </div>
            <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
              A decade of momentum.
            </h2>
            <p className="mt-4 text-white/65 max-w-2xl leading-relaxed">
              From a focused campus initiative to a nationally recognized IEEE
              chapter with global reach.
            </p>
          </motion.div>

          <div className="relative">
            <motion.div
              className="absolute left-4 md:left-1/2 top-0 h-full w-px bg-white/10"
              initial={{ scaleY: 0 }}
              animate={isTimelineInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top" }}
            />
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  className={`relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${
                    index % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className={index % 2 === 0 ? "md:pr-16" : "md:order-2 md:pl-16"}>
                    <div className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                      {item.year}
                    </div>
                    <h3 className="mt-3 text-2xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-white/65 leading-relaxed">{item.description}</p>
                  </div>
                  <div className={index % 2 === 0 ? "md:order-2 md:pl-16" : "md:pr-16"}>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                      <div className="h-24 w-full rounded-2xl bg-gradient-to-r from-blue-600/30 via-sky-400/20 to-transparent" />
                    </div>
                  </div>
                  <div className="absolute left-2 md:left-1/2 top-6 h-3 w-3 -translate-x-1/2 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,0.8)]" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section ref={valuesRef} className="px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-xs uppercase tracking-[0.3em] text-white/60">
              Core Values
            </div>
            <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight">
              What drives every decision.
            </h2>
            <p className="mt-4 text-white/65 max-w-2xl leading-relaxed">
              The principles that keep our community ambitious, inclusive, and
              deeply innovative.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all duration-500 hover:border-blue-400/40 hover:bg-white/10"
                initial={{ opacity: 0, y: 24 }}
                animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-white/65 leading-relaxed">{value.description}</p>
                <div className="mt-6 h-px w-12 bg-gradient-to-r from-blue-400 to-transparent transition-all group-hover:w-20" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
