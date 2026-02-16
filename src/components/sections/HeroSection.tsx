"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Marquee from "@/components/layout/Marquee";
import gsap from "gsap";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const floatingShapesRef = useRef<Array<HTMLDivElement | null>>([]);

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

    const letters = headlineRef.current.querySelectorAll<HTMLElement>(".hero-letter");
    const cleanupFns: Array<() => void> = [];
    letters.forEach((letter) => {
      const onEnter = () => {
        gsap.to(letter, {
          scale: 1.1,
          textShadow: "0 0 12px rgba(11, 94, 215, 0.6), 0 0 22px rgba(23, 208, 89, 0.45)",
          duration: 0.2,
          ease: "power2.out",
        });
      };
      const onLeave = () => {
        gsap.to(letter, {
          scale: 1,
          textShadow: "none",
          duration: 0.2,
          ease: "power2.out",
        });
      };
      letter.addEventListener("mouseenter", onEnter);
      letter.addEventListener("mouseleave", onLeave);
      cleanupFns.push(() => {
        letter.removeEventListener("mouseenter", onEnter);
        letter.removeEventListener("mouseleave", onLeave);
      });
    });

    // Floating shapes animation
    floatingShapesRef.current.forEach((shape, i) => {
      if (shape) {
        gsap.to(shape, {
          y: "random(-20, 20)",
          x: "random(-15, 15)",
          rotation: "random(-5, 5)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      }
    });

    // Orbital rings animation
    if (orbitRef.current) {
      gsap.to(Array.from(orbitRef.current.children), {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: "none",
        stagger: {
          each: 2,
          from: "start",
        },
      });
    }

    return () => {
      cleanupFns.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] md:min-h-screen flex flex-col justify-center overflow-hidden pt-24 sm:pt-28 pb-6 sm:pb-8 bg-white"
    >
      {/* Sophisticated Background System - Same as Contact Page */}
      <div className="absolute inset-0 md:fixed pointer-events-none overflow-hidden">
        {/* Primary gradient mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[360px] h-[360px] sm:w-[520px] sm:h-[520px] md:w-[600px] md:h-[600px] bg-gradient-radial from-[#E8F1FF] via-transparent to-transparent blur-3xl parallax-slow" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] md:w-[500px] md:h-[500px] bg-gradient-radial from-[#F0F7FF] via-transparent to-transparent blur-3xl parallax-medium" />
          <div className="absolute bottom-0 left-0 w-[420px] h-[420px] sm:w-[580px] sm:h-[580px] md:w-[700px] md:h-[700px] bg-gradient-radial from-[#EBF4FF] via-transparent to-transparent blur-3xl parallax-slow" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          <div
            ref={(el) => {
              floatingShapesRef.current[0] = el;
            }}
            className="absolute top-[15%] left-[8%] w-10 h-10 sm:w-16 sm:h-16 border border-[#4A90E2]/20 rounded-full"
          />
          <div
            ref={(el) => {
              floatingShapesRef.current[1] = el;
            }}
            className="absolute top-[45%] right-[12%] w-8 h-8 sm:w-12 sm:h-12 border-2 border-[#6BA4E7]/15 rotate-45"
          />
          <div
            ref={(el) => {
              floatingShapesRef.current[2] = el;
            }}
            className="absolute bottom-[25%] left-[15%] w-12 h-12 sm:w-20 sm:h-20 border border-[#5A9AE5]/20"
          />
          <div
            ref={(el) => {
              floatingShapesRef.current[3] = el;
            }}
            className="hidden sm:block absolute top-[60%] right-[20%] w-8 h-8 bg-gradient-to-br from-[#7FB3EA]/10 to-transparent rounded-full"
          />
        </div>

        {/* Orbital rings */}
        <div ref={orbitRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-[360px] h-[360px] sm:w-[560px] sm:h-[560px] md:w-[800px] md:h-[800px] border border-[#5A9AE5]/10 rounded-full" />
          <div className="absolute w-[460px] h-[460px] sm:w-[720px] sm:h-[720px] md:w-[1000px] md:h-[1000px] border border-[#4A90E2]/8 rounded-full -translate-x-[50px] -translate-y-[50px] md:-translate-x-[100px] md:-translate-y-[100px]" />
        </div>
      </div>

      {/* Content Container - Flex Column */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        <motion.div
          className="w-full max-w-7xl mx-auto px-5 sm:px-6 text-center"
          style={{ opacity }}
        >
          {/* Headline - Character Animation */}
          <h1
            ref={headlineRef}
            className="text-navy mb-6 sm:mb-8 leading-[0.95] font-bold tracking-tight text-[clamp(2.25rem,14vw,8rem)]"
          >
            <div className="overflow-visible flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="inline-block text-[#00629b]">
                {"IEEE".split("").map((char, i) => (
                  <span key={i} className="char hero-letter inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
              {" "}
              <span className="inline-block text-[#17d059]">
                {"KIIT".split("").map((char, i) => (
                  <span key={i} className="char hero-letter inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
            </div>
            <div className="overflow-visible mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="inline-block">
                {"Student".split("").map((char, i) => (
                  <span key={i} className="char hero-letter inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
              {" "}
              <span className="inline-block">
                {"Branch".split("").map((char, i) => (
                  <span key={i} className="char hero-letter inline-block">{char === " " ? "\u00A0" : char}</span>
                ))}
              </span>
            </div>
          </h1>

          {/* Subtext */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 mb-8 sm:mb-12"
          >
            <p className="text-navy/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal px-2">
              Fostering innovation, technical excellence, and professional development since 2010
            </p>
          </motion.div>

          {/* CTA Button - Gradient Style */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/about"
              className="group relative inline-flex items-center justify-center w-full max-w-xs sm:w-auto px-7 sm:px-10 py-3.5 sm:py-5 text-white rounded-full text-sm sm:text-base font-semibold overflow-hidden bg-gradient-to-br from-[#0B5ED7] to-[#0A1A2F] shadow-[0_8px_30px_rgba(11,94,215,0.4)]"
            >
              <span className="relative z-10">Explore Our Journey</span>

              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#0A1A2F] to-[#0B5ED7]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <Marquee delay={1.55} />
    </section>
  );
};

export default HeroSection;
