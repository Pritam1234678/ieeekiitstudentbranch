"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    if (!headlineRef.current) return;

    const chars = headlineRef.current.querySelectorAll(".char");
    
    gsap.fromTo(
      chars,
      {
        opacity: 0,
        y: 100,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.03,
        ease: "expo.out",
        delay: 0.3,
      }
    );
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex flex-col justify-center overflow-hidden pt-20"
      style={{
        background: 'linear-gradient(180deg, #FFFFFF 0%, #EBF3FF 20%, #D6E4FF 50%, #C1D9FF 100%)'
      }}
    >
      {/* Animated Gradient Orbs */}
      <motion.div 
        className="absolute top-10 right-10 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, rgba(11, 94, 215, 0.25) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 50, 0],
          y: [0, 30, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, rgba(11, 94, 215, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
          x: [0, -40, 0],
          y: [0, -20, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div 
        className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full blur-3xl"
        style={{ 
          background: 'radial-gradient(circle, rgba(193, 217, 255, 0.6) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Content Container - Flex Column */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <motion.div 
          className="w-full max-w-7xl mx-auto px-6 text-center"
          style={{ opacity }}
        >
          {/* Headline - Character Animation */}
          <h1
            ref={headlineRef}
            className="text-navy mb-8 leading-[0.95] font-bold tracking-tighter"
            style={{ fontSize: "clamp(3rem, 10vw, 8rem)" }}
          >
            <div className="overflow-hidden">
              <span className="inline-block" style={{ color: '#00629b' }}>
                {"IEEE".split("").map((char, i) => (
                  <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
              {" "}
              <span className="inline-block" style={{ color: '#17d059' }}>
                {"KIIT".split("").map((char, i) => (
                  <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
            </div>
            <div className="overflow-hidden mt-2">
              <span className="inline-block">
                {"Student".split("").map((char, i) => (
                  <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
              {" "}
              <span className="inline-block">
                {"Branch".split("").map((char, i) => (
                  <span key={i} className="char inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
            </div>
          </h1>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 mb-12"
          >
            <p className="text-navy/60 text-base md:text-lg max-w-2xl mx-auto font-normal">
              Fostering innovation, technical excellence, and professional development since 2010
            </p>
          </motion.div>

          {/* CTA Button - Gradient Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="group relative px-10 py-5 text-white rounded-full text-base font-semibold overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0B5ED7 0%, #0A1A2F 100%)',
                boxShadow: '0 8px 30px rgba(11, 94, 215, 0.4)'
              }}>
              <span className="relative z-10">Explore Our Journey</span>
              <motion.div 
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #0B5ED7 100%)' }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee - At Bottom, Inside Viewport */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full mt-auto"
      >
        <div className="marquee w-full border-t border-royal/15 bg-white/65 backdrop-blur-md shadow-[0_-18px_60px_rgba(11,94,215,0.1)]">
          <div className="marquee__inner">
            {[0, 1].map((track) => (
              <div key={track} className="marquee__track gap-12 px-10 py-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[12px] md:text-sm font-semibold tracking-[0.22em] uppercase">
                      <span style={{ color: "#00629b" }}>IEEE</span>{" "}
                      <span style={{ color: "#17d059" }}>KIIT</span>{" "}
                      <span className="text-black">Student Branch</span>
                    </span>
                    <span className="text-black/20 text-xs tracking-[0.2em]">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;