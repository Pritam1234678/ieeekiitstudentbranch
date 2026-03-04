'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api/config';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminUser {
    id: string;
    name: string;
    email: string;
}

interface AuthMeResponse {
    success?: boolean;
    user?: AdminUser;
    error?: string;
}

const navItems = [
    {
        href: '/admin/societies', label: 'Societies', startsWith: '/admin/societies', icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        )
    },
    {
        href: '/admin/events', label: 'Events', startsWith: '/admin/events', icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        href: '/admin/members', label: 'Members', startsWith: '/admin/members', icon: (
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useState<AdminUser | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (pathname === '/admin/login') {
            setAuthorized(true);
            return;
        }

        const checkAuth = async () => {
            try {
                const res = await fetch(getApiUrl('/api/auth/me'), {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                const rawResponse = await res.text();
                let data: AuthMeResponse = {};

                if (rawResponse) {
                    try {
                        data = JSON.parse(rawResponse) as AuthMeResponse;
                    } catch {
                        data = { error: rawResponse };
                    }
                }

                if (res.ok && data.success && data.user) {
                    setAuthorized(true);
                    setUser(data.user);
                    return;
                }
            } catch (error) {
                console.error('Auth check failed', error);
            }

            setAuthorized(false);
            setUser(null);
            router.replace('/admin/login');
        };

        checkAuth();
    }, [pathname, router]);

    if (!authorized) {
        if (pathname !== '/admin/login') {
            return (
                <div className="grid min-h-screen place-items-center bg-[#f4f8ff]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#d6e8ff] border-t-[#0b5ed7]" />
                        <p className="text-sm font-medium text-[#4f6281]">Checking session...</p>
                    </div>
                </div>
            );
        }
        return null;
    }

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="border-b border-[#e4efff] px-6 py-6">
                <p className="text-2xl font-semibold tracking-tight text-[#0a2f66]">IEEE Admin</p>
                <p className="text-xs uppercase tracking-[0.16em] text-[#5c7aa6]">Student Branch</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 px-4 py-4">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.startsWith);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${isActive
                                    ? 'bg-[#0b5ed7] text-white shadow-[0_10px_25px_rgba(11,94,215,0.25)]'
                                    : 'text-[#355988] hover:bg-[#e8f1ff] hover:text-[#0b5ed7]'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User + Sign Out */}
            <div className="border-t border-[#e4efff] px-6 py-5">
                {user && (
                    <div className="mb-4 rounded-xl border border-[#d8e7ff] bg-[#f8fbff] p-3">
                        <p className="truncate text-sm font-semibold text-[#12366b]">{user.name}</p>
                        <p className="truncate text-xs text-[#5d79a3]">{user.email}</p>
                    </div>
                )}
                <button
                    onClick={async () => {
                        try {
                            await fetch(getApiUrl('/api/auth/logout'), { method: 'POST', credentials: 'include' });
                        } catch (error) {
                            console.error(error);
                        }
                        router.push('/admin/login');
                        setAuthorized(false);
                        setUser(null);
                    }}
                    className="w-full rounded-xl border border-[#bcd7ff] bg-[#eef5ff] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#0b5ed7] transition hover:bg-[#e3efff]"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f4f8ff] text-[#10284d]">
            {/* Decorative blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-24 -left-20 h-80 w-80 rounded-full bg-[#dbeaff]"
                    animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute top-48 -right-24 h-72 w-72 rounded-full bg-[#e8f2ff]"
                    animate={{ x: [0, -16, 0], y: [0, 14, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                />
            </div>

            <div className="relative z-10 flex min-h-screen">
                {/* ── Desktop sidebar ── */}
                <aside className="hidden lg:flex lg:w-72 lg:shrink-0 lg:flex-col lg:sticky lg:top-0 lg:h-screen border-r border-[#d8e7ff] bg-white">
                    <SidebarContent />
                </aside>

                {/* ── Mobile: top bar with hamburger ── */}
                <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-[#d8e7ff] bg-white/95 backdrop-blur-md px-4 py-3 shadow-sm">
                    <div>
                        <p className="text-lg font-semibold tracking-tight text-[#0a2f66] leading-tight">IEEE Admin</p>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-[#5c7aa6]">Student Branch</p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Open menu"
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e7ff] bg-[#f4f8ff] text-[#0b5ed7] transition hover:bg-[#e3efff]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* ── Mobile drawer overlay ── */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="backdrop"
                                className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                onClick={() => setSidebarOpen(false)}
                            />
                            {/* Drawer */}
                            <motion.aside
                                key="drawer"
                                className="lg:hidden fixed left-0 top-0 bottom-0 z-50 w-72 bg-white border-r border-[#d8e7ff] shadow-2xl flex flex-col"
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            >
                                {/* Close button inside drawer */}
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close menu"
                                    className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#d8e7ff] bg-[#f4f8ff] text-[#0b5ed7] transition hover:bg-[#e3efff]"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <SidebarContent />
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>

                {/* ── Main content ── */}
                <main className="flex-1 min-w-0 px-4 pt-20 pb-6 sm:px-6 lg:pt-8 lg:px-10 lg:py-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
