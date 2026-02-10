"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Success animation
    gsap.to(".submit-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        // Add your form submission logic here
      },
    });
  };

  return (
    <main className="relative bg-white overflow-hidden">
      <Navigation />

      {/* Sophisticated Background System */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary gradient mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-[#E8F1FF] via-transparent to-transparent blur-3xl parallax-slow" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-radial from-[#F0F7FF] via-transparent to-transparent blur-3xl parallax-medium" />
          <div className="absolute bottom-0 left-0 w-[700px] h-[700px] bg-gradient-radial from-[#EBF4FF] via-transparent to-transparent blur-3xl parallax-slow" />
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
      <section ref={heroRef} className="relative pt-40 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="hero-badge inline-flex items-center gap-2 px-5 py-2 border border-[#4A90E2]/30 rounded-full text-[11px] font-medium tracking-[0.2em] uppercase text-[#2E5C8A] mb-8">
            <span className="w-1.5 h-1.5 bg-[#4A90E2] rounded-full animate-pulse" />
            Get In Touch
          </div>

          <h1 className="hero-title text-6xl md:text-8xl font-light tracking-tight text-[#0F1419] mb-6 leading-[0.95]">
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
              
              <div className="relative bg-white/80 backdrop-blur-sm border border-[#D4E4F7]/60 rounded-[32px] p-12 shadow-[0_8px_32px_rgba(74,144,226,0.08)]">
                <div className="form-field">
                  <h2 className="text-4xl font-light text-[#0F1419] mb-2">
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
                      className="submit-btn group relative px-8 py-4 bg-gradient-to-r from-[#2E5C8A] to-[#4A90E2] text-white font-medium rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_8px_24px_rgba(74,144,226,0.35)] active:scale-95"
                    >
                      <span className="relative z-10">Send Message</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#4A90E2] to-[#5A9AE5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="contact-card group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-3xl p-16 min-h-[320px] transition-all duration-300 hover:border-[#4A90E2]/40 flex items-center justify-center">
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
            <div ref={contactCardsRef} className="grid grid-cols-2 gap-4">
              <div className="contact-card group relative">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-2xl p-6 transition-all duration-300 hover:border-[#4A90E2]/40">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E8F1FF] to-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#4A90E2] mb-2">Email</p>
                  <p className="text-sm font-medium text-[#0F1419]">ieee@kiit.ac.in</p>
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
                  <p className="text-sm font-medium text-[#0F1419]">+91 1234567890</p>
                </div>
              </div>

              <div className="contact-card group relative col-span-2">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-2xl p-6 transition-all duration-300 hover:border-[#4A90E2]/40">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E8F1FF] to-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#4A90E2] mb-2">Location</p>
                  <p className="text-sm font-medium text-[#0F1419]">KIIT University, Bhubaneswar</p>
                  <p className="text-xs text-[#64748B] mt-1">Odisha, India</p>
                </div>
              </div>

              <div className="contact-card group relative col-span-2">
                <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-2xl p-6 transition-all duration-300 hover:border-[#4A90E2]/40">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E8F1FF] to-[#F0F7FF] rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-5 h-5 text-[#4A90E2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#4A90E2] mb-2">Office Hours</p>
                  <p className="text-sm font-medium text-[#0F1419]">Monday - Friday</p>
                  <p className="text-xs text-[#64748B] mt-1">10:00 AM - 6:00 PM IST</p>
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
                  Founders Hall, KIIT Deemed University
                </p>
                <div className="relative h-48 bg-gradient-to-br from-[#F0F7FF] via-white to-[#E8F1FF] rounded-2xl overflow-hidden border border-[#D4E4F7]/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-[#4A90E2] mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="text-xs font-medium text-[#4A90E2]">Interactive Map</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-card group relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-[#E8F1FF] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              <div className="relative bg-white/90 backdrop-blur-sm border border-[#D4E4F7]/50 rounded-3xl p-8 transition-all duration-300 hover:border-[#4A90E2]/40">
                <h3 className="text-2xl font-light text-[#0F1419] mb-2">
                  Connect With Us
                </h3>
                <p className="text-[#64748B] text-sm font-light mb-6">
                  Follow our journey across platforms
                </p>
                <div className="flex flex-wrap gap-3">
                  {["LinkedIn", "Instagram", "Twitter", "GitHub"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="group/link relative px-5 py-2.5 bg-gradient-to-r from-[#F0F7FF] to-white border border-[#D4E4F7]/50 rounded-full text-sm font-medium text-[#2E5C8A] overflow-hidden transition-all duration-300 hover:border-[#4A90E2] hover:shadow-[0_4px_16px_rgba(74,144,226,0.15)]"
                    >
                      <span className="relative z-10">{social}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-[#E8F1FF] to-[#F0F7FF] opacity-0 group-hover/link:opacity-100 transition-opacity duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 w-full">
        <div className="marquee w-full border-t border-[#4A90E2]/15 bg-white/70 backdrop-blur-md shadow-[0_-18px_60px_rgba(74,144,226,0.12)]">
          <div className="marquee__inner">
            {[0, 1].map((track) => (
              <div key={track} className="marquee__track gap-12 px-10 py-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`${track}-${i}`} className="flex items-center gap-3">
                    <span className="text-[12px] md:text-sm font-semibold tracking-[0.22em] uppercase">
                      <span style={{ color: "#00629b" }}>IEEE</span>{" "}
                      <span style={{ color: "#17d059" }}>KIIT</span>{" "}
                      <span className="text-black">Student Branch</span>
                    </span>
                    <span className="text-black/20 text-xs tracking-[0.2em]">•</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
