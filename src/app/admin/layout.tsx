'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

interface AdminUser {
    id: number;
    name: string;
    email: string;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useState<AdminUser | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setAuthorized(true);
            return;
        }

        const checkAuth = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/admin/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await res.json();

                if (data.success) {
                    setAuthorized(true);
                    setUser(data.user);
                } else {
                    localStorage.removeItem('adminToken');
                    router.push('/admin/login');
                }
            } catch (error) {
                console.error('Auth check failed', error);
                // Optionally allow them to stay on page if it's just a network error, 
                // but safer to redirect or show error. For now, strict:
                localStorage.removeItem('adminToken');
                router.push('/admin/login');
            }
        };

        checkAuth();
    }, [pathname, router]);

    useEffect(() => {
        if (!containerRef.current || pathname === '/admin/login') return;

        const ctx = gsap.context(() => {
            // Floating shapes animation
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

            // Orbital rings animation
            gsap.to(".orbital-ring", {
                rotation: 360,
                duration: 40, // Slower for dashboard
                repeat: -1,
                ease: "none",
                stagger: {
                    each: 5,
                    from: "start",
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [pathname]);

    if (!authorized) {
        // Show a loading state instead of null when checking auth to prevent flash
        if (pathname !== '/admin/login') {
            return (
                <div className="min-h-screen flex items-center justify-center bg-[#F5F9FF]">
                    <div className="w-10 h-10 border-4 border-[#0B5ED7] border-t-transparent rounded-full animate-spin"></div>
                </div>
            );
        }
        return null;
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div ref={containerRef} className="flex min-h-screen bg-[#F5F9FF] text-[#0A1A2F] overflow-hidden relative selection:bg-[#0B5ED7]/20">
            {/* Sophisticated Background Environment */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                {/* Gradient Mesh */}
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-radial from-[#E8F1FF] via-transparent to-transparent blur-3xl opacity-60" />
                <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-gradient-radial from-[#F0F7FF] via-transparent to-transparent blur-3xl opacity-60" />

                {/* Orbital Rings - Positioned subtly */}
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 opacity-40">
                    <div className="orbital-ring absolute w-[600px] h-[600px] border border-[#5A9AE5]/10 rounded-full" />
                    <div className="orbital-ring absolute w-[800px] h-[800px] border border-[#4A90E2]/5 rounded-full" />
                </div>
                <div className="absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3 opacity-40">
                    <div className="orbital-ring absolute w-[500px] h-[500px] border border-[#5A9AE5]/10 rounded-full" />
                    <div className="orbital-ring absolute w-[700px] h-[700px] border border-[#4A90E2]/5 rounded-full" />
                </div>

                {/* Floating Geometric Elements */}
                <div className="floating-shape absolute top-[10%] right-[10%] w-12 h-12 border border-[#4A90E2]/10 rounded-full" />
                <div className="floating-shape absolute bottom-[15%] left-[15%] w-16 h-16 border border-[#5A9AE5]/10 rounded-full" />
                <div className="floating-shape absolute top-[40%] left-[5%] w-6 h-6 bg-[#4A90E2]/5 rounded-full blur-sm" />
            </div>

            <aside className="w-72 bg-white/70 backdrop-blur-xl border-r border-white/50 p-6 flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="mb-12 px-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B5ED7] to-[#052c65] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-[#0A1A2F]">
                            IEEE <span className="text-[#0B5ED7]">Admin</span>
                        </h1>
                        <p className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">Student Branch</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link
                        href="/admin/societies"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${pathname.startsWith('/admin/societies')
                            ? 'bg-gradient-to-r from-[#0B5ED7] to-[#052c65] text-white shadow-lg shadow-blue-500/30'
                            : 'text-[#64748B] hover:bg-white/50 hover:text-[#0B5ED7]'
                            }`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${pathname.startsWith('/admin/societies') ? 'bg-white/20' : 'bg-white group-hover:bg-blue-50'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <span className="font-medium">Societies</span>
                    </Link>

                    <Link
                        href="/admin/events"
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${pathname.startsWith('/admin/events')
                            ? 'bg-gradient-to-r from-[#0B5ED7] to-[#052c65] text-white shadow-lg shadow-blue-500/30'
                            : 'text-[#64748B] hover:bg-white/50 hover:text-[#0B5ED7]'
                            }`}
                    >
                        <div className={`p-2 rounded-lg transition-colors ${pathname.startsWith('/admin/events') ? 'bg-white/20' : 'bg-white group-hover:bg-blue-50'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="font-medium">Events</span>
                    </Link>
                </nav>

                <div className="mt-auto pt-6 border-t border-[#D4E4F7]/60">
                    {user ? (
                        <div className="flex items-center gap-3 px-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E6F0FF] to-white border border-[#D4E4F7] flex items-center justify-center text-[#0B5ED7] font-bold text-xs ring-2 ring-white shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#0A1A2F] truncate">{user.name}</p>
                                <p className="text-xs text-[#64748B] truncate" title={user.email}>{user.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-12 flex items-center gap-3 px-2 mb-4 animate-pulse">
                            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-slate-200 rounded w-20"></div>
                                <div className="h-2 bg-slate-200 rounded w-28"></div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            localStorage.removeItem('adminToken');
                            router.push('/admin/login');
                            setAuthorized(false);
                            setUser(null);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 bg-red-50/50 hover:bg-red-50 border border-red-100/50 hover:border-red-100 rounded-xl transition-all duration-200"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 p-8 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
