'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useSocieties } from '@/lib/api/hooks';
import { Society } from '@/lib/api/types';
import Marquee from '@/components/layout/Marquee';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

function SocietyCard({ society, index }: { society: Society; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
      className="h-full"
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{
          rotateX: useMotionTemplate`${mouseY.get() * -20}deg`,
          rotateY: useMotionTemplate`${mouseX.get() * 20}deg`,
          transformStyle: 'preserve-3d',
        }}
        className="group relative h-full bg-white/40 backdrop-blur-md border border-white/60 rounded-[32px] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_80px_rgba(11,94,215,0.15)] transition-all duration-300"
      >
        {/* Shine Effect */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-0">
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
        </div>

        {/* Gradient Blob Background */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-[#E8F1FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-radial from-[#F0F7FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="relative z-10 flex flex-col h-full transform-style-3d group-hover:translate-z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-[#E6F0FF] p-3 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300 transform-style-3d group-hover:rotate-y-12">
              {society.logo_url ? (
                <img
                  src={society.logo_url}
                  alt={society.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-3xl font-bold bg-gradient-to-br from-[#0B5ED7] to-[#052c65] bg-clip-text text-transparent">
                  {getInitials(society.name)}
                </span>
              )}
            </div>
          </div>

          <h3 className="font-bold text-2xl text-[#0A1A2F] leading-tight mb-3 group-hover:text-[#0B5ED7] transition-colors">
            {society.name}
          </h3>

          <div className="mb-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-xs font-medium text-[#64748B] group-hover:bg-[#E8F1FF] group-hover:border-[#D4E4F7] group-hover:text-[#0B5ED7] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#94A3B8] group-hover:bg-[#0B5ED7] transition-colors"></span>
              Chair: {society.chair_name || 'N/A'}
            </span>
            {society.faculty_name && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-xs font-medium text-[#166534]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                Faculty: {society.faculty_name}
              </span>
            )}
          </div>

          <p className="text-base text-[#64748B] leading-relaxed mb-6 font-light">
            {society.description || 'A vibrant community of tech enthusiasts driving innovation and collaboration.'}
          </p>


        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SocityPage() {
  const { societies, loading, error } = useSocieties();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to('.floating-shape', {
        y: 'random(-30, 30)',
        x: 'random(-20, 20)',
        rotation: 'random(-15, 15)',
        duration: 'random(4, 7)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: 'random',
        },
      });

      gsap.to(".orbital-ring", {
        rotation: 360,
        duration: 50,
        repeat: -1,
        ease: "none",
        stagger: {
          each: 10,
          from: "start",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={containerRef} className="min-h-screen relative overflow-hidden bg-[#F5F9FF] selection:bg-[#0B5ED7]/20">
      <Navigation />

      {/* Background Environment */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-gradient-radial from-[#E8F1FF] via-transparent to-transparent blur-3xl opacity-60" />
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-gradient-radial from-[#F0F7FF] via-transparent to-transparent blur-3xl opacity-60" />

        <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 opacity-30">
          <div className="orbital-ring absolute w-[600px] h-[600px] border border-[#5A9AE5]/10 rounded-full" />
          <div className="orbital-ring absolute w-[900px] h-[900px] border border-[#4A90E2]/5 rounded-full" />
        </div>
        <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 opacity-30">
          <div className="orbital-ring absolute w-[700px] h-[700px] border border-[#5A9AE5]/10 rounded-full" />
        </div>

        <div className="floating-shape absolute top-[20%] right-[15%] w-16 h-16 border border-[#4A90E2]/10 rounded-full" />
        <div className="floating-shape absolute top-[60%] left-[8%] w-12 h-12 bg-[#4A90E2]/5 rounded-full blur-sm" />
        <div className="floating-shape absolute bottom-[20%] right-[25%] w-24 h-24 border border-[#5A9AE5]/10 rounded-full" />
      </div>

      <section className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-[#D4E4F7] text-[#0B5ED7] text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-[#0B5ED7] animate-pulse"></span>
            IEEE KIIT Student Branch
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0A1A2F] mb-6 drop-shadow-sm"
          >
            Our Technical <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0B5ED7] to-[#052c65] relative inline-block">
              Societies
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#0B5ED7]/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-[#64748B] max-w-3xl mx-auto leading-relaxed font-light"
          >
            Explore the diverse technical chapters and affinity groups that drive innovation, research, and professional growth at our student branch.
          </motion.p>
        </div>
      </section>

      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 border-4 border-[#0B5ED7]/30 border-t-[#0B5ED7] rounded-full animate-spin"></div>
              <p className="text-[#64748B] animate-pulse">Loading amazing communities...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-20 px-6 rounded-3xl bg-red-50/50 border border-red-100 max-w-2xl mx-auto">
              <h3 className="text-red-800 font-bold text-lg mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {societies.map((society, index) => (
                <SocietyCard key={society.id} society={society} index={index} />
              ))}
            </div>
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
