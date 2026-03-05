"use client";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
    { id: "introduction", number: "01", title: "Introduction" },
    { id: "data-we-collect", number: "02", title: "Data We Collect" },
    { id: "how-we-use", number: "03", title: "How We Use Your Data" },
    { id: "data-security", number: "04", title: "Data Security" },
    { id: "contact", number: "05", title: "Contact Us" },
];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-white">
            <Navigation />

            {/* ── Hero ── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#0A1A2F] via-[#0B3A7A] to-[#0B5ED7] pt-36 pb-24 px-6">
                {/* decorative circles */}
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-[#0B5ED7]/30 blur-3xl pointer-events-none" />
                {/* grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div {...fadeUp(0)}>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-6 backdrop-blur-sm">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            Legal Document
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight leading-none">
                            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-blue-200">Policy</span>
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
                            <Link href="/terms" className="flex items-center gap-2 text-sm text-[#0B5ED7] hover:underline">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                Terms of Service →
                            </Link>
                        </div>
                    </div>
                </motion.aside>

                {/* Main content */}
                <div className="flex-1 min-w-0 space-y-8">

                    {[
                        {
                            id: "introduction",
                            number: "01",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                            title: "Introduction",
                            content: (
                                <p className="text-slate-600 leading-relaxed">
                                    Welcome to the <strong className="text-[#0A1A2F]">IEEE KIIT Student Branch</strong> website. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                </p>
                            ),
                        },
                        {
                            id: "data-we-collect",
                            number: "02",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />,
                            title: "Data We Collect",
                            content: (
                                <>
                                    <p className="text-slate-600 leading-relaxed mb-4">We may collect, use, store and transfer different kinds of personal data about you:</p>
                                    <div className="grid sm:grid-cols-2 gap-3">
                                        {[
                                            { label: "Identity Data", desc: "First name, last name, username or similar identifier" },
                                            { label: "Contact Data", desc: "Email address and telephone numbers" },
                                            { label: "Technical Data", desc: "IP address, browser type, time zone & location" },
                                            { label: "Profile Data", desc: "Interests, preferences, feedback and survey responses" },
                                            { label: "Usage Data", desc: "How you use our website, products and services" },
                                        ].map((item) => (
                                            <div key={item.label} className="bg-[#F8FAFC] rounded-xl p-4 border border-slate-100">
                                                <p className="font-semibold text-[#0A1A2F] text-sm mb-1">{item.label}</p>
                                                <p className="text-slate-500 text-sm">{item.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ),
                        },
                        {
                            id: "how-we-use",
                            number: "03",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
                            title: "How We Use Your Data",
                            content: (
                                <>
                                    <p className="text-slate-600 leading-relaxed mb-4">We will only use your personal data when the law allows us to:</p>
                                    <ul className="space-y-3">
                                        {[
                                            "To perform or enter into a contract with you (e.g., event registration).",
                                            "Where it is necessary for our legitimate interests and your fundamental rights do not override those interests.",
                                            "Where we need to comply with a legal or regulatory obligation.",
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
                            id: "data-security",
                            number: "04",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                            title: "Data Security",
                            content: (
                                <div className="bg-gradient-to-br from-[#EEF4FF] to-[#F0F9FF] border border-[#C7DEFF] rounded-2xl p-6">
                                    <p className="text-[#0A1A2F] leading-relaxed">
                                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. We limit access to your personal data to those members, agents, and contractors who have a legitimate need to know.
                                    </p>
                                </div>
                            ),
                        },
                        {
                            id: "contact",
                            number: "05",
                            icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
                            title: "Contact Us",
                            content: (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#0A1A2F] rounded-2xl p-6">
                                    <p className="text-white/80 text-sm leading-relaxed flex-1">
                                        Have questions about this privacy policy or our privacy practices? Reach out through our official contact channels.
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
