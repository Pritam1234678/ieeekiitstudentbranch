'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    // 3D Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;
        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    useEffect(() => {
        // Floating shapes animation using GSAP
        const ctx = gsap.context(() => {
            gsap.to(".floating-shape", {
                y: "random(-20, 20)",
                x: "random(-15, 15)",
                rotation: "random(-10, 10)",
                duration: "random(3, 5)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: {
                    amount: 1.5,
                    from: "random"
                }
            });

            gsap.to(".orbital-ring", {
                rotation: 360,
                duration: 25,
                repeat: -1,
                ease: "none",
                stagger: {
                    each: 2,
                    from: "start",
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                // Success Animation
                gsap.to(formRef.current, {
                    scale: 0.95,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => router.push('/admin/societies')
                });
            } else {
                setError(data.error || 'Login failed');
                // Shake animation on error
                gsap.fromTo(formRef.current, { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="min-h-screen flex items-center justify-center bg-[#F5F9FF] relative overflow-hidden p-6 perspective-1000"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Sophisticated Background Environment */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient Mesh */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-[#E8F1FF] via-transparent to-transparent blur-3xl opacity-60" />
                <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-radial from-[#F0F7FF] via-transparent to-transparent blur-3xl opacity-60" />

                {/* Orbital Rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="orbital-ring absolute w-[600px] h-[600px] border border-[#5A9AE5]/10 rounded-full" />
                    <div className="orbital-ring absolute w-[800px] h-[800px] border border-[#4A90E2]/5 rounded-full" />
                    <div className="orbital-ring absolute w-[1000px] h-[1000px] border border-[#2E5C8A]/5 rounded-full" />
                </div>

                {/* Floating Geometric Elements */}
                <div className="floating-shape absolute top-[15%] left-[10%] w-16 h-16 border border-[#4A90E2]/20 rounded-full" />
                <div className="floating-shape absolute bottom-[20%] right-[15%] w-24 h-24 border border-[#5A9AE5]/15 rounded-full" />
                <div className="floating-shape absolute top-[30%] right-[25%] w-8 h-8 bg-[#4A90E2]/10 rounded-full blur-sm" />
                <div className="floating-shape absolute bottom-[40%] left-[20%] w-12 h-12 border-2 border-[#6BA4E7]/10 rotate-45" />
            </div>


            <motion.div
                ref={formRef}
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-[440px] relative z-10"
            >
                {/* Glassmorphism Card */}
                <div className="relative bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(8,112,184,0.1)] rounded-[40px] p-10 overflow-hidden group">
                    {/* Inner sheen effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E8F1FF] to-[#D4E4F7] text-[#0B5ED7] mb-5 shadow-inner"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </motion.div>
                            <h1 className="text-3xl font-bold text-[#0A1A2F] tracking-tight mb-2">Welcome Back</h1>
                            <p className="text-[#64748B] text-sm">Enter your credentials to access the secure area</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50/80 backdrop-blur-sm text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 text-center border border-red-100 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Email Input */}
                            <div className="relative group/input">
                                <div className="absolute left-0 top-3.5 text-[#94A3B8] transition-colors duration-300 group-focus-within/input:text-[#0B5ED7]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="peer w-full bg-transparent border-b border-[#D4E4F7] py-3 pl-8 text-[#0A1A2F] outline-none transition-all duration-300 focus:border-[#0B5ED7] placeholder-transparent font-medium"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-8 -top-3.5 text-xs text-[#0B5ED7] font-medium transition-all duration-300 
                                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal 
                                    peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#0B5ED7] peer-focus:font-medium
                                    peer-[:autofill]:-top-3.5 peer-[:autofill]:text-xs peer-[:autofill]:text-[#0B5ED7] peer-[:autofill]:font-medium"
                                >
                                    Email Address
                                </label>
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#0B5ED7] to-[#2E5C8A] transition-all duration-500 peer-focus:w-full" />
                            </div>

                            {/* Password Input */}
                            <div className="relative group/input">
                                <div className="absolute left-0 top-3.5 text-[#94A3B8] transition-colors duration-300 group-focus-within/input:text-[#0B5ED7]">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="peer w-full bg-transparent border-b border-[#D4E4F7] py-3 pl-8 text-[#0A1A2F] outline-none transition-all duration-300 focus:border-[#0B5ED7] placeholder-transparent font-medium"
                                    placeholder=" "
                                    required
                                />
                                <label
                                    htmlFor="password"
                                    className="absolute left-8 -top-3.5 text-xs text-[#0B5ED7] font-medium transition-all duration-300 
                                    peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-normal 
                                    peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#0B5ED7] peer-focus:font-medium
                                    peer-[:autofill]:-top-3.5 peer-[:autofill]:text-xs peer-[:autofill]:text-[#0B5ED7] peer-[:autofill]:font-medium"
                                >
                                    Password
                                </label>
                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#0B5ED7] to-[#2E5C8A] transition-all duration-500 peer-focus:w-full" />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full relative overflow-hidden group bg-[#0A1A2F] text-white font-medium py-4 px-4 rounded-2xl shadow-[0_10px_30px_rgba(10,26,47,0.2)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0B5ED7] to-[#2E5C8A] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </form>
                    </div>
                </div>

                <p className="text-center text-[#94A3B8]/80 text-xs mt-8 font-medium">
                    &copy; {new Date().getFullYear()} IEEE KIIT Student Branch. <br /> Secured Admin Portal.
                </p>
            </motion.div>
        </div>
    );
}
