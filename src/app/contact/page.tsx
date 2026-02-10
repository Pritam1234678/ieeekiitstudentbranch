"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [focused, setFocused] = useState({
    name: false,
    email: false,
    subject: false,
    message: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
  };

  return (
    <main className="min-h-screen bg-app-gradient">
      <Navigation />

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-gradient mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Get In Touch
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-primary-dark/70 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Have questions? Want to join IEEE KIIT? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section ref={sectionRef} className="py-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="relative">
                <motion.input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocused({ ...focused, name: true })}
                  onBlur={() =>
                    setFocused({ ...focused, name: formData.name !== "" })
                  }
                  required
                  className="w-full bg-transparent border-b-2 border-secondary-gray focus:border-primary outline-none py-4 text-lg text-primary-dark transition-all"
                />
                <motion.label
                  className={`absolute left-0 text-primary-dark/60 pointer-events-none transition-all ${
                    focused.name || formData.name
                      ? "top-0 text-sm text-primary"
                      : "top-4 text-lg"
                  }`}
                  animate={{
                    y: focused.name || formData.name ? -24 : 0,
                    scale: focused.name || formData.name ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Your Name
                </motion.label>
              </div>

              {/* Email Field */}
              <div className="relative">
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocused({ ...focused, email: true })}
                  onBlur={() =>
                    setFocused({ ...focused, email: formData.email !== "" })
                  }
                  required
                  className="w-full bg-transparent border-b-2 border-secondary-gray focus:border-primary outline-none py-4 text-lg text-primary-dark transition-all"
                />
                <motion.label
                  className={`absolute left-0 text-primary-dark/60 pointer-events-none transition-all ${
                    focused.email || formData.email
                      ? "top-0 text-sm text-primary"
                      : "top-4 text-lg"
                  }`}
                  animate={{
                    y: focused.email || formData.email ? -24 : 0,
                    scale: focused.email || formData.email ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Email Address
                </motion.label>
              </div>

              {/* Subject Field */}
              <div className="relative">
                <motion.input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onFocus={() => setFocused({ ...focused, subject: true })}
                  onBlur={() =>
                    setFocused({ ...focused, subject: formData.subject !== "" })
                  }
                  required
                  className="w-full bg-transparent border-b-2 border-secondary-gray focus:border-primary outline-none py-4 text-lg text-primary-dark transition-all"
                />
                <motion.label
                  className={`absolute left-0 text-primary-dark/60 pointer-events-none transition-all ${
                    focused.subject || formData.subject
                      ? "top-0 text-sm text-primary"
                      : "top-4 text-lg"
                  }`}
                  animate={{
                    y: focused.subject || formData.subject ? -24 : 0,
                    scale: focused.subject || formData.subject ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Subject
                </motion.label>
              </div>

              {/* Message Field */}
              <div className="relative">
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocused({ ...focused, message: true })}
                  onBlur={() =>
                    setFocused({ ...focused, message: formData.message !== "" })
                  }
                  required
                  rows={5}
                  className="w-full bg-transparent border-b-2 border-secondary-gray focus:border-primary outline-none py-4 text-lg text-primary-dark transition-all resize-none"
                />
                <motion.label
                  className={`absolute left-0 text-primary-dark/60 pointer-events-none transition-all ${
                    focused.message || formData.message
                      ? "top-0 text-sm text-primary"
                      : "top-4 text-lg"
                  }`}
                  animate={{
                    y: focused.message || formData.message ? -24 : 0,
                    scale: focused.message || formData.message ? 0.85 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Your Message
                </motion.label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full text-lg font-medium transition-all magnetic relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Send Message</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            className="space-y-12"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Info Cards */}
            <div className="space-y-6">
              <InfoCard
                title="Email"
                content="ieee@kiit.ac.in"
                delay={0}
              />
              <InfoCard
                title="Phone"
                content="+91 1234567890"
                delay={0.1}
              />
              <InfoCard
                title="Location"
                content="KIIT University, Bhubaneswar, Odisha, India"
                delay={0.2}
              />
              <InfoCard
                title="Office Hours"
                content="Monday - Friday: 10:00 AM - 6:00 PM"
                delay={0.3}
              />
            </div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="bg-card-gradient border border-secondary-gray/70 rounded-2xl p-8"
            >
              <h3 className="text-2xl font-bold text-primary-dark mb-6">
                Connect With Us
              </h3>
              <div className="flex flex-wrap gap-4">
                {["LinkedIn", "Instagram", "Twitter", "GitHub"].map((social, index) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="px-6 py-3 bg-white/80 border border-secondary-gray/70 rounded-full text-primary-dark hover:border-primary hover:text-primary transition-all"
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                  >
                    {social}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoCard({
  title,
  content,
  delay,
}: {
  title: string;
  content: string;
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      className="bg-card-gradient border border-secondary-gray/70 rounded-2xl p-6 hover:border-primary transition-all group"
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02, x: 10 }}
    >
      <h4 className="text-sm font-semibold text-primary mb-2 uppercase tracking-wide">
        {title}
      </h4>
      <p className="text-lg text-primary-dark group-hover:text-primary transition-colors">
        {content}
      </p>
    </motion.div>
  );
}
