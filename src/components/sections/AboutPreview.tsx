"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const stats = [
  { value: 500, label: "Active Members", suffix: "+" },
  { value: 120, label: "Events Conducted", suffix: "+" },
  { value: 15, label: "Years of Excellence", suffix: "+" },
];

const AboutPreview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [counts, setCounts] = useState(stats.map(() => 0));

  useEffect(() => {
    if (!isInView) return;

    stats.forEach((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[index] = stat.value;
            return newCounts;
          });
          clearInterval(timer);
        } else {
          setCounts((prev) => {
            const newCounts = [...prev];
            newCounts[index] = Math.floor(current);
            return newCounts;
          });
        }
      }, duration / steps);
    });
  }, [isInView]);

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-sky/50 to-white" />
      <div className="absolute -top-24 right-0 w-72 h-72 bg-royal/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[360px] h-[360px] bg-sky/70 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-royal/10 text-royal text-xs font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-royal" />
              About IEEE KIIT
            </div>
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-navy leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Building leaders in <span className="text-gradient">technology</span>
            </motion.h2>
            <motion.p
              className="text-base text-navy/70 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              IEEE KIIT Student Branch is a vibrant community of technology
              enthusiasts, innovators, and future leaders committed to advancing
              technology for the betterment of humanity.
            </motion.p>
            <motion.p
              className="text-base text-navy/70 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              We foster innovation through technical workshops, research
              collaborations, and hands-on projects that shape the next
              generation of engineers.
            </motion.p>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-navy/70"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {[
                "Industry-backed workshops",
                "Hands-on research culture",
                "Global IEEE community",
                "Leadership & mentorship",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-royal/80" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/about"
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-royal to-navy text-white text-sm font-semibold shadow-lg shadow-royal/20 hover:shadow-royal/30 transition-all"
              >
                Discover Our Story
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12H19M19 12L13 6M19 12L13 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-royal/10 via-white to-sky/80 blur-2xl" />
            <div className="relative grid gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`relative rounded-3xl border border-royal/10 px-6 py-5 shadow-lg shadow-royal/10 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-royal/20 ${
                    index === 0
                      ? "bg-gradient-to-br from-white via-white to-sky/70"
                      : "bg-white/80"
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl md:text-5xl font-bold text-navy tracking-tight">
                      {counts[index]}
                    </span>
                    <span className="text-2xl md:text-3xl font-bold text-royal">
                      {stat.suffix}
                    </span>
                  </div>
                  <p className="text-sm text-navy/60 font-medium">{stat.label}</p>
                  <div className="mt-4 h-1 w-10 rounded-full bg-royal/60" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
