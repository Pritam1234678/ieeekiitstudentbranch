"use client";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <Navigation />

            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-royal/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky/20 rounded-full blur-3xl" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6 tracking-tight">
                            Privacy Policy
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
                                <h2 className="text-2xl font-semibold text-navy mb-4">1. Introduction</h2>
                                <p>
                                    Welcome to the IEEE KIIT Student Branch website. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">2. The Data We Collect</h2>
                                <p>
                                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                                </p>
                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                                    <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                                    <li><strong>Profile Data</strong> includes your interests, preferences, feedback and survey responses.</li>
                                    <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">3. How We Use Your Data</h2>
                                <p>
                                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                </p>
                                <ul className="list-disc pl-6 mt-4 space-y-2">
                                    <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., event registration).</li>
                                    <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                                    <li>Where we need to comply with a legal or regulatory obligation.</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">4. Data Security</h2>
                                <p>
                                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those members, agents, contractors, and other third parties who have a need to know.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-semibold text-navy mb-4">5. Contact Us</h2>
                                <p>
                                    If you have any questions about this privacy policy or our privacy practices, please contact us at our official contact avenues specified on the Contact page.
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
