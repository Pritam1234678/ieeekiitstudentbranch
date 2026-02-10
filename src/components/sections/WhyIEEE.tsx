"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const benefits = [
  {
    title: "Global Network",
    description:
      "Connect with 400,000+ members across 160 countries and access exclusive IEEE resources.",
  },
  {
    title: "Technical Excellence",
    description:
      "Gain hands-on experience through cutting-edge workshops, projects, and research opportunities.",
  },
  {
    title: "Career Development",
    description:
      "Access mentorship programs, industry connections, and professional development resources.",
  },
  {
    title: "Innovation Hub",
    description:
      "Collaborate on groundbreaking projects and participate in international competitions.",
  },
];

const WhyIEEE = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-royal/15 via-sky/70 to-white" />
      <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-royal/25 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[520px] h-[520px] rounded-full bg-royal/20 blur-3xl" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-end mb-10">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-royal/20 text-royal text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-royal" />
              Member Advantages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-navy leading-tight tracking-tight">
              Why students choose <span className="text-gradient">IEEE KIIT</span>
            </h2>
            <p className="text-base text-navy/70 leading-relaxed max-w-2xl">
              Become part of the world&apos;s largest technical professional
              organization dedicated to advancing technology.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-3 text-xs font-semibold text-navy/70"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {["400K+ global members", "160+ countries", "15+ years at KIIT"].map((item) => (
              <span
                key={item}
                className="px-3 py-1.5 rounded-full bg-white/70 border border-royal/20 shadow-sm"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="group relative rounded-3xl border border-royal/20 bg-white/75 backdrop-blur-xl p-6 md:p-7 shadow-lg shadow-royal/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-royal/40"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-royal/15 via-white/60 to-sky/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-0 rounded-3xl border border-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 [mask:linear-gradient(#fff,transparent)]" />
              <div className="absolute inset-0 rounded-3xl border border-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[linear-gradient(120deg,rgba(11,94,215,0.55),rgba(230,240,255,0.8),rgba(10,26,47,0.55))] [mask:linear-gradient(#fff_0_0) content-box,linear-gradient(#fff_0_0)] [mask-composite:exclude]" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-royal/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative text-5xl md:text-6xl font-bold text-royal/20 mb-3 leading-none transition-colors duration-500 group-hover:text-royal/40">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="relative text-lg md:text-xl font-semibold text-navy mb-2 tracking-tight transition-colors duration-500 group-hover:text-royal">
                {benefit.title}
              </h3>
              <p className="relative text-sm text-navy/70 leading-relaxed transition-colors duration-500 group-hover:text-navy/80">
                {benefit.description}
              </p>
              <div className="relative mt-4 flex items-center gap-3 text-royal font-semibold text-xs">
                <span className="transition-transform duration-500 group-hover:translate-x-1">
                  Explore
                </span>
                <span className="h-[1px] w-10 bg-royal transition-all duration-500 group-hover:w-16" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyIEEE;
