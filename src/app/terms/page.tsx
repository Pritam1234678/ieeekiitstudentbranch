"use client";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
    { id: "agreement", number: "01", title: "Agreement to Terms" },
    { id: "intellectual-property", number: "02", title: "Intellectual Property" },
    { id: "user-representations", number: "03", title: "User Representations" },
    { id: "event-conduct", number: "04", title: "Event Registrations & Conduct" },
    { id: "modifications", number: "05", title: "Modifications & Interruptions" },
    { id: "contact", number: "06", title: "Contact Us" },
];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1A2F] via-[#0E2A50] to-[#0B3A7A] pt-36 pb-24 px-6">
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#0B5ED7]/30 blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div {...fadeUp(0)}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Legal Document
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-none">
                            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200">Service</span>
                        </h1>
                        <p className="text-white/60 text-base mt-4">
                            Last updated: March 5, 2025 &nbsp;·&nbsp; IEEE KIIT Student Branch
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Body ── */}
            <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">

                {/* Sticky sidebar TOC */}
                <motion.aside {...fadeUp(0.1)} className="hidden lg:block w-64 shrink-0">
                    <div className="sticky top-28 bg-[#F8FAFC] rounded-2xl border border-slate-100 p-6">
                        <p className="text-xs font-bold text-[#0B5ED7] uppercase tracking-widest mb-4">Contents</p>
                        <ul className="space-y-1">
                            {sections.map((s) => (
                                <li key={s.id}>
                                    <a
                                        href={`#${s.id}`}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-[#0A1A2F] hover:bg-[#EEF4FF] transition-colors group"
                                    >
                                        <span className="text-[10px] font-bold text-[#0B5ED7]/60 group-hover:text-[#0B5ED7] w-5">{s.number}</span>
                                        {s.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <Link href="/privacy" className="flex items-center gap-2 text-sm text-[#0B5ED7] hover:underline">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Privacy Policy →
                            </Link>
                        </div>
                    </div>
                </motion.aside>

                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-8">

                    {[
                        {
                            id: "agreement",
                            number: "01",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                            title: "Agreement to Terms",
                            content: (
                                <div className="space-y-4 text-slate-600 leading-relaxed">
                                    <p>
                                        These Terms of Service constitute a legally binding agreement made between <strong className="text-[#0A1A2F]">you</strong> and <strong className="text-[#0A1A2F]">IEEE KIIT Student Branch</strong> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), concerning your access to and use of our website and any related media forms or channels.
                                    </p>
                                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 text-amber-800 text-sm">
                                        ⚠️ By accessing this site, you have read, understood, and agree to be bound by all of these Terms. If you do not agree, you must discontinue use immediately.
                                    </div>
                                </div>
                            ),
                        },
                        {
                            id: "intellectual-property",
                            number: "02",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />,
                            title: "Intellectual Property Rights",
                            content: (
                                <div className="space-y-4 text-slate-600 leading-relaxed">
                                    <p>Unless otherwise indicated, all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics (collectively, the <strong className="text-[#0A1A2F]">&quot;Content&quot;</strong>) and trademarks, service marks, and logos (the <strong className="text-[#0A1A2F]">&quot;Marks&quot;</strong>) are owned or controlled by us and protected by copyright and trademark laws.</p>
                                    <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4 text-red-700 text-sm">
                                        <svg className="w-5 h-5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" /></svg>
                                        No part of the Site may be copied, reproduced, distributed, sold, or exploited for any commercial purpose without our express prior written permission.
                                    </div>
                                </div>
                            ),
                        },
                        {
                            id: "user-representations",
                            number: "03",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
                            title: "User Representations",
                            content: (
                                <>
                                    <p className="text-slate-600 leading-relaxed mb-4">By using the Site, you represent and warrant that:</p>
                                    <ul className="space-y-3">
                                        {[
                                            "All registration information you submit will be true, accurate, current, and complete.",
                                            "You will maintain the accuracy of such information and promptly update it as necessary.",
                                            "You have the legal capacity and you agree to comply with these Terms of Service.",
                                            "You will not use the Site for any illegal or unauthorized purpose.",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#0B5ED7]/10 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-[#0B5ED7]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </span>
                                                <span className="text-slate-600 text-sm leading-relaxed">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ),
                        },
                        {
                            id: "event-conduct",
                            number: "04",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
                            title: "Event Registrations & Conduct",
                            content: (
                                <div className="bg-gradient-to-br from-[#EEF4FF] to-[#F0F9FF] border border-[#C7DEFF] rounded-2xl p-6">
                                    <p className="text-[#0A1A2F] leading-relaxed">
                                        Additional terms may apply to event registrations, hackathons, and workshops. The <strong>IEEE Code of Ethics</strong> and standard code of conduct rules strictly apply to all organized events. We reserve the right to revoke participation without refund for any malicious behavior, cheating, or violation of IEEE standards.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            id: "modifications",
                            number: "05",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
                            title: "Modifications & Interruptions",
                            content: (
                                <p className="text-slate-600 leading-relaxed">
                                    We reserve the right to change, modify, or remove the contents of the Site at any time for any reason at our sole discretion without notice. We have no obligation to update any information on our Site and may modify or discontinue all or part of the Site at any time.
                                </p>
                            ),
                        },
                        {
                            id: "contact",
                            number: "06",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                            title: "Contact Us",
                            content: (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#0A1A2F] rounded-2xl p-6">
                                    <p className="text-white/80 text-sm leading-relaxed flex-1">
                                        To resolve a complaint or receive further information about our Terms of Service, reach out through our official contact channels.
                                    </p>
                                    <Link
                                        href="/contact"
                                        className="shrink-0 px-5 py-2.5 bg-[#0B5ED7] hover:bg-[#094bb3] text-white text-sm font-semibold rounded-xl transition-colors"
                                    >
                                        Contact Us →
                                    </Link>
                                </div>
                            ),
                        },
                    ].map((section, i) => (
                        <motion.div
                            key={section.id}
                            id={section.id}
                            {...fadeUp(0.1 + i * 0.07)}
                            className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow scroll-mt-28"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B5ED7] to-[#0A1A2F] flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {section.icon}
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-[#0B5ED7] uppercase tracking-widest">{section.number}</span>
                                    <h2 className="text-xl font-bold text-[#0A1A2F]">{section.title}</h2>
                                </div>
                            </div>
                            {section.content}
                        </motion.div>
                    ))}

                </div>
            </section>

            <Footer />
        </main>
    );
}
