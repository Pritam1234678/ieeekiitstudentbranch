"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const stats = [
  { label: "Active Members", value: "240+" },
  { label: "Annual Events", value: "35+" },
  { label: "Awards Won", value: "18" },
  { label: "Innovation Labs", value: "3" },
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

const aboutCards = [
  {
    title: "About IEEE KIIT",
    subtitle: "Student Branch",
    description:
      "A student-led community focused on engineering excellence, real-world innovation, and professional growth.",
    points: ["Technical mentorship", "Research culture", "Career readiness"],
  },
  {
    title: "Programs & Labs",
    subtitle: "Hands-on Impact",
    description:
      "Workshops, projects, and labs that translate classroom learning into meaningful, applied outcomes.",
    points: ["Flagship workshops", "Prototype sprints", "Industry sessions"],
  },
  {
    title: "Community & Reach",
    subtitle: "Beyond Campus",
    description:
      "Collaborations with chapters worldwide to give members a global perspective and network.",
    points: ["Global partnerships", "Speaker series", "Alumni network"],
  },
  {
    title: "Student Growth",
    subtitle: "Lead & Build",
    description:
      "Leadership programs and peer-to-peer learning that build confidence, clarity, and impact.",
    points: ["Leadership tracks", "Team projects", "Public showcases"],
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineSectionRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const cleanupFns: Array<() => void> = [];
    cards.forEach((card) => {
      const glow = card.querySelector(".about-card-glow");
      const border = card.querySelector(".about-card-border");
      const onEnter = () => {
        gsap.to(card, { y: -8, duration: 0.35, ease: "power3.out" });
        gsap.to(glow, { opacity: 0.35, duration: 0.35, ease: "power3.out" });
        gsap.to(border, { opacity: 1, duration: 0.35, ease: "power3.out" });
      };
      const onLeave = () => {
        gsap.to(card, { y: 0, duration: 0.35, ease: "power3.out" });
        gsap.to(glow, { opacity: 0, duration: 0.35, ease: "power3.out" });
        gsap.to(border, { opacity: 0, duration: 0.35, ease: "power3.out" });
      };
      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanupFns.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });
    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  // Enhanced Timeline GSAP Animation with Progress Bar
  useEffect(() => {
    if (!timelineSectionRef.current || !progressLineRef.current) return;
    
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const section = timelineSectionRef.current;
      const progressLine = progressLineRef.current;
      const heading = section?.querySelector(".about-timeline-heading");
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");
      const circles = gsap.utils.toArray<HTMLElement>(".timeline-circle");
      const cards = gsap.utils.toArray<HTMLElement>(".timeline-card");
      const connectors = gsap.utils.toArray<HTMLElement>(".timeline-connector");

      // Set initial states
      gsap.set(heading, { opacity: 0, y: 40 });
      gsap.set(circles, { scale: 0, opacity: 0 });
      gsap.set(cards, { opacity: 0, x: 100, rotationY: 15 });
      gsap.set(connectors, { scaleY: 0, transformOrigin: "top" });

      // Animate heading
      gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      });

      // Animate progress line with scroll
      gsap.to(progressLine, {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1,
        },
      });

      // Animate each timeline item sequentially
      items.forEach((item, index) => {
        const circle = circles[index];
        const card = cards[index];
        const connector = connectors[index];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });

        // Circle pop in
        tl.to(circle, {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
        });

        // Card slide and fade in
        tl.to(card, {
          opacity: 1,
          x: 0,
          rotationY: 0,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.3");

        // Glow pulse on circle
        tl.to(circle, {
          boxShadow: "0 0 30px rgba(11, 94, 215, 0.6), 0 0 60px rgba(11, 94, 215, 0.3)",
          duration: 0.4,
          ease: "power2.inOut",
          yoyo: true,
          repeat: 1,
        }, "-=0.5");

        // Connector line grows
        if (connector) {
          tl.to(connector, {
            scaleY: 1,
            duration: 0.6,
            ease: "power2.inOut",
          }, "-=0.6");
        }
      });

    }, timelineSectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!cardsSectionRef.current) return;
    const ctx = gsap.context(() => {
      const headings = gsap.utils.toArray<HTMLElement>(".about-card-heading");
      gsap.set(headings, { opacity: 1, x: -40 });
      headings.forEach((heading) => {
        gsap.to(heading, {
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, cardsSectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-white">
      <Navigation />

      {/* Hero Section */}
      <section 
        ref={heroRef} 
        className="relative min-h-[85vh] overflow-hidden px-6 pt-32 pb-20"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #EBF4FF 30%, #D6E8FF 70%, #C1DCFF 100%)'
        }}
      >
        {/* Animated Orbs */}
        <motion.div 
          className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-40"
          style={{ background: 'radial-gradient(circle, #0B5ED7 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, #00629B 0%, transparent 70%)' }}
          animate={{ scale: [1.1, 1, 1.1], x: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
            <motion.div 
              className="max-w-4xl"
              style={{ opacity, y }}
            >
            <motion.div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-blue-200 bg-white/80 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-sm font-semibold text-blue-900 tracking-wider uppercase">
                About IEEE KIIT
              </span>
            </motion.div>

            <motion.h1
              className="mt-8 text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]"
              style={{ color: '#0A1A2F' }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="block " style={{ color: '#00629b' }}>IEEE</span>
             
              <span className="block mt-1 tracking-[0.35em] text-[0.95em]" style={{ color: '#17d059' }}>
                KIIT
              </span>
              <span className="block" style={{ color: '#0A1A2F' }}>
                STUDENT
              </span>
              <span className="block" style={{ color: '#0A1A2F' }}>
                BRANCH
              </span>
            </motion.h1>

            <motion.p
              className="mt-8 text-xl md:text-2xl leading-relaxed"
              style={{ color: '#0A1A2F', opacity: 0.7 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              From research labs to global collaborations, we empower students to
              build, lead, and innovate with purpose.
            </motion.p>
            </motion.div>

            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.35 }}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-300/30 via-transparent to-transparent blur-3xl" />
              <div className="relative rounded-[2.5rem] border border-blue-200/60 bg-white/70 backdrop-blur-md p-10 shadow-[0_24px_80px_rgba(11,94,215,0.18)]">
                <Image
                  src="/mainlogo.png"
                  alt="IEEE KIIT Student Branch"
                  width={520}
                  height={520}
                  className="w-[320px] md:w-[380px] lg:w-[420px] h-auto"
                  priority
                />
              </div>
            </motion.div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="group relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-sm p-8 border-2 border-blue-100 hover:border-blue-300 transition-all duration-500"
                style={{ boxShadow: '0 8px 32px rgba(11, 94, 215, 0.1)' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(11, 94, 215, 0.2)' }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div 
                    className="text-5xl md:text-6xl font-bold mb-3"
                    style={{ 
                      background: 'linear-gradient(135deg, #0B5ED7 0%, #00629B 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold uppercase tracking-widest text-blue-900/60">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={cardsSectionRef} className="relative px-6 py-28 bg-white">
        <div className="absolute -top-20 right-0 h-[420px] w-[420px] rounded-full bg-blue-50 blur-[140px] opacity-80" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-xs uppercase tracking-[0.35em] text-blue-700/70">
              About Focus
            </div>
            <h2 className="mt-4 text-5xl md:text-6xl font-bold" style={{ color: "#0A1A2F" }}>
              Designed for builders, thinkers, and leaders.
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "#0A1A2F", opacity: 0.7 }}>
              Four pillars that define our community and how we grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {aboutCards.map((card, index) => (
              <div
                key={card.title}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="relative rounded-[2rem] bg-white border-2 border-blue-100 p-10 transition-shadow"
                style={{ boxShadow: "0 18px 60px rgba(11, 94, 215, 0.08)" }}
              >
                <div className="about-card-glow pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-600/20 via-blue-200/10 to-transparent opacity-0" />
                <div className="about-card-border pointer-events-none absolute inset-0 rounded-[2rem] border-2 border-blue-400/70 opacity-0" />
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.35em] text-blue-700/60">
                      {card.subtitle}
                    </div>
                    <h3 className="about-card-heading mt-3 text-3xl font-bold" style={{ color: "#0A1A2F" }}>
                      {card.title}
                    </h3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 text-sm font-semibold text-blue-700">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
                <p className="mt-4 text-base leading-relaxed" style={{ color: "#0A1A2F", opacity: 0.7 }}>
                  {card.description}
                </p>
                <div className="mt-6 space-y-2 text-sm text-blue-900/70">
                  {card.points.map((point) => (
                    <div key={point} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Timeline Section - Year beside line */}
      <section 
        ref={timelineSectionRef}
        className="px-6 py-32 bg-gradient-to-b from-white via-blue-50/60 to-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-blue-100/60 blur-[120px] opacity-80" />
        
        <div className="relative max-w-6xl mx-auto">
          <div className="about-timeline-heading text-center mb-24">
            <div className="text-xs uppercase tracking-[0.35em] text-blue-700/70">
              Timeline
            </div>
            <h2 className="mt-4 text-5xl md:text-6xl font-bold" style={{ color: '#0A1A2F' }}>
              Our Journey
            </h2>
            <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: '#0A1A2F', opacity: 0.7 }}>
              Milestones that shaped our growth and community impact.
            </p>
            <div className="mt-6 w-20 h-1.5 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
          </div>

          {/* Timeline Container with Centered Progress Line */}
          <div className="relative max-w-4xl mx-auto">
            {/* Animated Progress Line - Centered */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-200 via-blue-100 to-blue-200 rounded-full opacity-30" />
              <div 
                ref={progressLineRef}
                className="absolute inset-0 bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 rounded-full origin-top"
                style={{ 
                  scaleY: 0,
                  boxShadow: '0 0 20px rgba(11, 94, 215, 0.5)'
                }}
              />
            </div>

            <div className="space-y-20">
              {timeline.map((item, index) => (
                <div key={item.year} className="timeline-item relative">
                  {/* Year Circle on line */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10">
                    <div 
                      className="timeline-circle relative w-[100px] h-[100px] rounded-full flex items-center justify-center border-4 border-blue-600 bg-white"
                      style={{ boxShadow: '0 8px 32px rgba(11, 94, 215, 0.2)' }}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-transparent" />
                      <span className="relative text-2xl font-bold" style={{ color: '#0B5ED7' }}>
                        {item.year}
                      </span>
                    </div>
                  </div>

                  {/* Content Card - Alternating sides */}
                  <div className="grid grid-cols-2 gap-8 items-center pt-2">
                    <div className={index % 2 === 0 ? 'pr-16' : 'col-start-2 pl-16'}>
                      <div 
                        className="timeline-card rounded-3xl bg-white px-10 py-8 border-2 border-blue-100 relative overflow-hidden"
                        style={{ 
                          boxShadow: '0 12px 48px rgba(11, 94, 215, 0.12)',
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {/* Card background gradient */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-2xl opacity-60" />
                        
                        <div className="relative">
                          <h3 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#0A1A2F' }}>
                            {item.title}
                          </h3>
                          <p className="text-lg leading-relaxed" style={{ color: '#0A1A2F', opacity: 0.75 }}>
                            {item.description}
                          </p>
                          
                          {/* Decorative line */}
                          <div className="mt-6 h-1 w-16 rounded-full bg-gradient-to-r from-blue-600 to-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Connector Line between circles */}
                  {index < timeline.length - 1 && (
                    <div className="timeline-connector absolute left-1/2 -bottom-10 w-0.5 h-20 -translate-x-1/2 bg-gradient-to-b from-blue-400 to-transparent origin-top z-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className=" bg-white">
        <div className="marquee w-screen border-y border-blue-100 bg-white/90 backdrop-blur-md shadow-[0_24px_60px_rgba(11,94,215,0.12)] relative left-1/2 -translate-x-1/2">
          <div className="marquee__inner">
            {[0, 1].map((track) => (
              <div key={track} className="marquee__track gap-16 px-10 py-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm md:text-base font-semibold tracking-[0.26em] uppercase">
                      <span style={{ color: "#00629b" }}>IEEE</span>{" "}
                      <span style={{ color: "#17d059" }}>KIIT</span>{" "}
                      <span className="text-black">Student Branch</span>
                    </span>
                    <span className="text-black/20 text-sm tracking-[0.2em]">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
