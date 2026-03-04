"use client";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function TermsOfService() {
    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navigation />

            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 right-10 w-96 h-96 bg-sky/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-royal/10 rounded-full blur-3xl" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 tracking-tight">
                            Terms of Service
                        </h1>
                        <p className="text-lg text-slate-600 mb-12">
                            Last updated: {new Date().toLocaleDateString()}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="prose prose-lg prose-slate max-w-none prose-headings:text-navy prose-a:text-sky-600"
                    >
                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 mb-12 space-y-8 text-slate-700">

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">1. Agreement to Terms</h2>
                                <p>
                                    These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and IEEE KIIT Student Branch ("we," "us," or "our"), concerning your access to and use of our website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
                                </p>
                                <p className="mt-4">
                                    You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the site and you must discontinue use immediately.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">2. Intellectual Property Rights</h2>
                                <p>
                                    Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                                </p>
                                <p className="mt-4">
                                    Except as expressly provided in these Terms of Service, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">3. User Representations</h2>
                                <p>
                                    By using the Site, you represent and warrant that:
                                </p>
                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>All registration information you submit will be true, accurate, current, and complete.</li>
                                    <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                                    <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                                    <li>You will not use the Site for any illegal or unauthorized purpose.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">4. Event Registrations and Conduct</h2>
                                <p>
                                    Additional terms and conditions may apply to event registrations, hackathons, workshops, and other activities. Standard code of conduct rules strictly apply to all organized events. We reserve the right to revoke participation or access without refund for any malicious behavior, cheating, or violation of IEEE Code of Ethics.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">5. Modifications and Interruptions</h2>
                                <p>
                                    We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">6. Contact Us</h2>
                                <p>
                                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us utilizing the options provided on our Contact page.
                                </p>
                            </section>

                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
