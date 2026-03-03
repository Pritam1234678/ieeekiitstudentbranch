'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Background float animation
            gsap.to('.float-shape', {
                y: 'random(-30, 30)',
                x: 'random(-30, 30)',
                rotation: 'random(-15, 15)',
                duration: 'random(3, 6)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.2
            });

            // Glitch effect on the 404 text
            const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3 });
            glitchTimeline
                .to('.glitch-text', { x: 2, y: -2, opacity: 0.8, duration: 0.05, ease: 'power1.inOut' })
                .to('.glitch-text', { x: -2, y: 1, opacity: 1, duration: 0.05, ease: 'power1.inOut' })
                .to('.glitch-text', { x: 1, y: 2, opacity: 0.9, duration: 0.05, ease: 'power1.inOut' })
                .to('.glitch-text', { x: 0, y: 0, opacity: 1, duration: 0.05, ease: 'power1.inOut' });
        });

        return () => ctx.revert();
    }, []);

    return (
        <main className="min-h-screen relative overflow-hidden bg-white flex flex-col">
            <Navigation />

            <div ref={containerRef} className="relative flex-grow flex items-center justify-center pt-32 pb-20 px-6">

                {/* Background Mesh */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#E8F1FF] via-transparent to-transparent blur-3xl opacity-60" />

                    {/* Floating Shapes */}
                    <div className="absolute inset-0">
                        <div className="float-shape absolute top-[20%] left-[15%] w-24 h-24 rounded-2xl border-2 border-[#4A90E2]/20 rotate-12 backdrop-blur-sm" />
                        <div className="float-shape absolute top-[60%] right-[15%] w-32 h-32 rounded-full border border-[#6BA4E7]/20 -rotate-12" />
                        <div className="float-shape absolute bottom-[25%] left-[25%] w-16 h-16 bg-gradient-to-br from-[#7FB3EA]/10 to-transparent rounded-lg rotate-45" />
                    </div>
                </div>

                {/* Content */}
                <div ref={textRef} className="relative z-10 text-center max-w-3xl mx-auto">

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-8 relative"
                    >
                        {/* The huge 404 text */}
                        <h1 className="glitch-text text-[150px] md:text-[200px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-br from-[#1a365d] via-[#2E5C8A] to-[#4A90E2] select-none tracking-tighter drop-shadow-xl">
                            404
                        </h1>

                        {/* Decorative Overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[2px] bg-white/20 backdrop-blur-md -rotate-3" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-3xl md:text-5xl font-light text-[#0F1419] mb-6 tracking-tight"
                    >
                        Lost in <span className="font-medium text-[#4A90E2]">Cyber-Space</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-[#64748B] text-lg md:text-xl max-w-lg mx-auto font-light mb-12"
                    >
                        The page you are looking for has been moved, deleted, or never existed in the first place.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    >
                        <Link href="/" className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#2E5C8A] to-[#4A90E2] text-white font-medium text-lg rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_8px_32px_rgba(74,144,226,0.3)] hover:-translate-y-1">
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Return Home
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] to-[#5A9AE5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </Link>
                    </motion.div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
