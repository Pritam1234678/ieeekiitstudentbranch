'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api/config';
import { motion } from 'framer-motion';

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
    { href: '/admin/societies', label: 'Societies', startsWith: '/admin/societies' },
    { href: '/admin/events', label: 'Events', startsWith: '/admin/events' },
    { href: '/admin/members', label: 'Members', startsWith: '/admin/members' },
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

    return (
        <div className="min-h-screen bg-[#f4f8ff] text-[#10284d]">
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

            <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
                <aside className="w-full border-b border-[#d8e7ff] bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:shrink-0 lg:flex-col lg:self-start lg:border-r lg:border-b-0">
                    <div className="border-b border-[#e4efff] px-6 py-6">
                        <p className="text-2xl font-semibold tracking-tight text-[#0a2f66]">IEEE Admin</p>
                        <p className="text-xs uppercase tracking-[0.16em] text-[#5c7aa6]">Student Branch</p>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:block lg:space-y-2 lg:overflow-visible">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.startsWith);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`inline-flex min-w-[9.5rem] items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition lg:flex lg:min-w-0 ${isActive
                                            ? 'bg-[#0b5ed7] text-white shadow-[0_10px_25px_rgba(11,94,215,0.25)]'
                                            : 'bg-[#f4f8ff] text-[#355988] hover:bg-[#e8f1ff] hover:text-[#0b5ed7]'
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-[#e4efff] px-6 py-5 lg:mt-auto">
                        {user ? (
                            <div className="mb-4 rounded-xl border border-[#d8e7ff] bg-[#f8fbff] p-3">
                                <p className="truncate text-sm font-semibold text-[#12366b]">{user.name}</p>
                                <p className="truncate text-xs text-[#5d79a3]">{user.email}</p>
                            </div>
                        ) : null}

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
                </aside>

                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
