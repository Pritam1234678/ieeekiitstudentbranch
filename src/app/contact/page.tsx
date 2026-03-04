"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { getApiUrl } from "@/lib/api/config";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const heroRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const contactCardsRef = useRef<HTMLDivElement | null>(null);
  const orbitRef = useRef<HTMLDivElement | null>(null);
  const floatingShapesRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.from(".hero-badge", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from(".hero-title", {
        opacity: 0,
        y: 50,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.4,
        ease: "power3.out",
      });

      // Floating shapes animation
      floatingShapesRef.current.forEach((shape, i) => {
        if (shape) {
          gsap.to(shape, {
            y: "random(-20, 20)",
            x: "random(-15, 15)",
            rotation: "random(-5, 5)",
            duration: "random(3, 5)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        }
      });

      // Orbital rings animation
      if (orbitRef.current) {
        gsap.to(Array.from(orbitRef.current.children), {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "none",
          stagger: {
            each: 2,
            from: "start",
          },
        });
      }

      // Form elements stagger
      gsap.from(".form-field", {
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });

      // Contact cards animation
      gsap.from(".contact-card", {
        scrollTrigger: {
          trigger: contactCardsRef.current,
          start: "top 85%",
        },
        opacity: 0,
        scale: 0.9,
        y: 30,
        duration: 0.7,
        stagger: 0.15,
        ease: "back.out(1.4)",
      });

      // Parallax background elements
      gsap.to(".parallax-slow", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
        y: 100,
      });

      gsap.to(".parallax-medium", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
        y: 200,
      });
    });

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 429) {
        // Handle Rate Limit specifically
        const errorData = await response.json();
        setToast({ show: true, message: errorData.message || 'You have sent too many messages. Please try again later.', type: 'error' });
        setIsSubmitting(false);
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setToast({ show: true, message: 'Message sent successfully! We will get back to you soon.', type: 'success' });
        setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form

        // Success animation
        gsap.to(".submit-btn", {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      } else {
        setToast({ show: true, message: data.message || 'Failed to send message. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setToast({ show: true, message: 'An error occurred. Please check your connection and try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 5000);
    }
  };

  return (
    <main className="relative bg-white overflow-hidden">
      <Navigation />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-24 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md border ${toast.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800' : 'bg-red-50/90 border-red-200 text-red-800'
              }`}
          >
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span className="font-medium text-sm">{toast.message}</span>
            <button aria-label="Close notification" title="Close" onClick={() => setToast({ ...toast, show: false })} className="ml-2 hover:opacity-70 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sophisticated Background System */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary gradient mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-gradient-radial from-[#E8F1FF] via-transparent to-transparent blur-3xl parallax-slow" />
          <div className="absolute top-1/3 right-1/4 w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-gradient-radial from-[#F0F7FF] via-transparent to-transparent blur-3xl parallax-medium" />
          <div className="absolute bottom-0 left-0 w-[350px] h-[350px] md:w-[700px] md:h-[700px] bg-gradient-radial from-[#EBF4FF] via-transparent to-transparent blur-3xl parallax-slow" />
        </div>

        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          <div
            ref={(el) => {
              floatingShapesRef.current[0] = el;
            }}
            className="absolute top-[15%] left-[8%] w-16 h-16 border border-[#4A90E2]/20 rounded-full"
          />
          <div
            ref={(el) => {
              floatingShapesRef.current[1] = el;
            }}
            className="absolute top-[45%] right-[12%] w-12 h-12 border-2 border-[#6BA4E7]/15 rotate-45"
          />
          <div
            ref={(el) => {
              floatingShapesRef.current[2] = el;
            }}
            className="absolute bottom-[25%] left-[15%] w-20 h-20 border border-[#5A9AE5]/20"
          />
          <div
            ref={(el) => {
              floatingShapesRef.current[3] = el;
            }}
            className="absolute top-[60%] right-[20%] w-8 h-8 bg-gradient-to-br from-[#7FB3EA]/10 to-transparent rounded-full"
          />
        </div>

        {/* Orbital rings */}
        <div ref={orbitRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute w-[800px] h-[800px] border border-[#5A9AE5]/10 rounded-full" />
          <div className="absolute w-[1000px] h-[1000px] border border-[#4A90E2]/8 rounded-full -translate-x-[100px] -translate-y-[100px]" />
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-28 md:pt-40 pb-16 md:pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-5 py-2 border border-[#4A90E2]/30 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase text-[#2E5C8A] mb-8">
            <span className="w-1.5 h-1.5 bg-[#4A90E2] rounded-full animate-pulse" />
            Get In Touch
          </div>

          <h1 className="hero-title text-4xl md:text-6xl lg:text-8xl font-light tracking-tight text-[#0F1419] mb-6 leading-[1.1] md:leading-[0.95]">
            Let&apos;s Create
            <span className="block font-medium bg-gradient-to-r from-[#2E5C8A] via-[#4A90E2] to-[#5A9AE5] bg-clip-text text-transparent mt-2">
              Something Remarkable
            </span>
          </h1>

          <p className="hero-subtitle text-lg md:text-xl text-[#4A5568] max-w-2xl mx-auto font-light leading-relaxed">
            Connect with IEEE KIIT Student Branch. We&apos;re here to collaborate,
            innovate, and build the future together.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">

          {/* Contact Form */}
          <div className="space-y-6">
            <div ref={formRef} className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#E8F1FF] to-[#F0F7FF] rounded-[40px] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700" />

              <div className="relative bg-white/80 backdrop-blur-sm border border-[#D4E4F7]/60 rounded-[32px] p-6 md:p-12 shadow-[0_8px_32px_rgba(74,144,226,0.08)]">
                <div className="form-field">
                  <h2 className="text-3xl md:text-4xl font-light text-[#0F1419] mb-2">
                    Send us a message
                  </h2>
                  <p className="text-[#64748B] font-light">
                    We typically respond within 24-48 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="form-field relative group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder=" "
                        className="peer w-full bg-transparent border-b-2 border-[#D4E4F7] py-3.5 text-[#0F1419] outline-none transition-colors duration-300 focus:border-[#4A90E2] placeholder-transparent"
                      />
                      <label className="absolute left-0 -top-3.5 text-xs font-medium text-[#4A90E2] transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#4A90E2] peer-focus:font-medium">
                        Full Name
                      </label>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#4A90E2] to-[#5A9AE5] transition-all duration-300 peer-focus:w-full" />
                    </div>

                    <div className="form-field relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder=" "
                        className="peer w-full bg-transparent border-b-2 border-[#D4E4F7] py-3.5 text-[#0F1419] outline-none transition-colors duration-300 focus:border-[#4A90E2] placeholder-transparent"
                      />
                      <label className="absolute left-0 -top-3.5 text-xs font-medium text-[#4A90E2] transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#4A90E2] peer-focus:font-medium">
                        Email Address
                      </label>
                      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#4A90E2] to-[#5A9AE5] transition-all duration-300 peer-focus:w-full" />
                    </div>
                  </div>

                  <div className="form-field relative group">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-[#D4E4F7] py-3.5 text-[#0F1419] outline-none transition-colors duration-300 focus:border-[#4A90E2] placeholder-transparent"
                    />
                    <label className="absolute left-0 -top-3.5 text-xs font-medium text-[#4A90E2] transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#4A90E2] peer-focus:font-medium">
                      Subject
                    </label>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#4A90E2] to-[#5A9AE5] transition-all duration-300 peer-focus:w-full" />
                  </div>

                  <div className="form-field relative group">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder=" "
                      rows={5}
                      className="peer w-full bg-transparent border-b-2 border-[#D4E4F7] py-3.5 text-[#0F1419] outline-none transition-colors duration-300 resize-none focus:border-[#4A90E2] placeholder-transparent"
                    />
                    <label className="absolute left-0 -top-3.5 text-xs font-medium text-[#4A90E2] transition-all duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#94A3B8] peer-placeholder-shown:font-light peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#4A90E2] peer-focus:font-medium">
                      Your Message
                    </label>
                    <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-[#4A90E2] to-[#5A9AE5] transition-all duration-300 peer-focus:w-full" />
                  </div>

                  <div className="form-field flex items-center justify-between pt-4">
                    <p className="text-sm text-[#64748B] font-light">
                      Your information is secure and confidential
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`submit-btn group relative px-8 py-4 bg-gradient-to-r from-[#2E5C8A] to-[#4A90E2] text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(74,144,226,0.35)] active:scale-95 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] to-[#5A9AE5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="contact-card group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-3xl p-8 md:p-16 min-h-[240px] md:min-h-[320px] transition-all duration-300 hover:border-[#4A90E2]/40 flex items-center justify-center">
                <Image
                  src="/mainlogo.png"
                  alt="IEEE KIIT Student Branch"
                  width={520}
                  height={210}
                  className="w-full max-w-[520px] h-auto opacity-100"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Sidebar */}
          <div className="space-y-6">
            {/* Contact Cards Grid */}
            <div ref={contactCardsRef} className="grid grid-cols-1 gap-4">
              <div className="contact-card group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-2xl p-6 transition-all duration-300 hover:border-[#4A90E2]/40">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E8F1FF] to-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#4A90E2] mb-2">Email</p>
                  <p className="text-sm font-medium text-[#0F1419] break-all sm:break-normal">support@ieeestudentbranchkiit.in</p>
                </div>
              </div>

              <div className="contact-card group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-2xl p-6 transition-all duration-300 hover:border-[#4A90E2]/40">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E8F1FF] to-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#4A90E2] mb-2">Phone</p>
                  <p className="text-sm font-medium text-[#0F1419]">+91 7608976946 <span className="text-[#64748B] text-xs ml-1">(Ravindu)</span></p>
                </div>
              </div>



              <div className="contact-card group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-2xl p-6 transition-all duration-300 hover:border-[#4A90E2]/40">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E8F1FF] to-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#4A90E2] mb-2">Office Hours</p>
                  <p className="text-sm font-medium text-[#0F1419]">Monday - Friday</p>
                  <p className="text-xs text-[#64748B] mt-1">8:00 AM - 8:00 PM IST</p>
                </div>
              </div>
            </div>

            {/* Campus Map Section */}
            <div className="contact-card group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-3xl p-8 transition-all duration-300 hover:border-[#4A90E2]/40">
                <h3 className="text-2xl font-light text-[#0F1419] mb-2">
                  Visit Our Campus
                </h3>
                <p className="text-[#64748B] text-sm font-light mb-6">
                  Campus 3, KIIT Rd, Chandaka Industrial Estate, K I I T University, Patia, Bhubaneswar, Odisha 751024
                </p>
                <div className="relative h-64 bg-slate-100 rounded-2xl overflow-hidden border border-[#D4E4F7]/50">
                  <iframe
                    src="https://maps.google.com/maps?q=20.35382792860987,85.81651204890484&hl=en&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="KIIT University Map"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-card group relaitve">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-3xl p-8 transition-all duration-300 hover:border-[#4A90E2]/40">
                <h3 className="text-2xl font-light text-[#0F1419] mb-2">
                  Connect With Us
                </h3>
                <p className="text-[#64748B] text-sm font-light mb-6">
                  Follow our journey across platforms
                </p>
                <div className="flex flex-wrap gap-2 pb-4 justify-between sm:justify-start">
                  {[
                    { name: "LinkedIn", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>, url: "https://www.linkedin.com/company/ieee-kiit-student-branch/" },
                    { name: "Instagram", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069v-2.163zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>, url: "https://www.instagram.com/ieee_kiit_student_branch/" },
                    { name: "Twitter", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>, url: "https://x.com/IeeeKiit" },
                    { name: "Facebook", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>, url: "https://www.facebook.com/pages/KIIT%20IEEE%20Student%20Branch/135174326824031/#" },
                    { name: "Youtube", icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>, url: "https://www.youtube.com/@ieeekiitstudentbranch" }
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link flex items-center justify-center relative w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2.5 bg-gradient-to-r from-[#F0F7FF] to-white border border-[#D4E4F7]/50 rounded-full text-[13px] font-medium text-[#2E5C8A] overflow-hidden transition-all duration-300 hover:border-[#4A90E2] hover:shadow-[0_4px_16px_rgba(74,144,226,0.15)] shrink-0"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {social.icon}
                        <span className="hidden sm:block">{social.name}</span>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#E8F1FF] to-[#F0F7FF] opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
