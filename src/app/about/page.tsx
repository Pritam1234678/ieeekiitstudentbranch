"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const timeline = [
  {
    year: "2011",
    title: "Foundation",
    description:
      "IEEE KIIT Student Branch was established with a vision to create a platform for technical excellence and innovation.",
  },
  {
    year: "2015",
    title: "National Recognition",
    description:
      "Received IEEE India Council's Outstanding Student Branch Award for exceptional activities and member engagement.",
  },
  {
    year: "2019",
    title: "International Collaboration",
    description:
      "Launched collaborative projects with IEEE student branches across the globe, expanding our network and impact.",
  },
  {
    year: "2023",
    title: "Innovation Hub",
    description:
      "Established state-of-the-art innovation lab with cutting-edge equipment for research and development.",
  },
  {
    year: "2026",
    title: "Future Forward",
    description:
      "Leading the charge in emerging technologies with focus on AI, IoT, and sustainable technology solutions.",
  },
];

const values = [
  {
    title: "Excellence",
    description: "Pursuing the highest standards in technical education and professional development.",
  },
  {
    title: "Innovation",
    description: "Fostering creativity and breakthrough thinking in technology solutions.",
  },
  {
    title: "Collaboration",
    description: "Building strong networks and partnerships across academic and industry sectors.",
  },
  {
    title: "Impact",
    description: "Creating meaningful change through technology for society and humanity.",
  },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.2 });
  const isValuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          style={{ opacity, y }}
        >
          <motion.h1
            className="text-6xl md:text-7xl font-bold text-navy mb-8 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            About Us
          </motion.h1>
          <motion.p
            className="text-xl text-navy/70 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            We are a dynamic community of innovators, thinkers, and leaders
            committed to shaping the future of technology through engineering excellence.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-navy">Our Mission</h2>
            <p className="text-lg text-navy/70 leading-relaxed">
              To provide a platform for students to develop technical skills,
              leadership qualities, and professional expertise while contributing
              to technological advancement and societal progress.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-navy">Our Vision</h2>
            <p className="text-lg text-navy/70 leading-relaxed">
              To be the leading student organization that fosters innovation,
              collaboration, and excellence in technology education, preparing
              students to become future leaders in their fields.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section ref={timelineRef} className="py-32 px-6 bg-sky/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={isTimelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-navy mb-6 tracking-tight">
              Our Journey
            </h2>
            <p className="text-lg text-navy/70 max-w-2xl leading-relaxed">
              From our humble beginnings to becoming a recognized leader in student technical organizations.
            </p>
          </motion.div>

          {/* Timeline Items */}
          <div className="relative">
            <motion.div 
              className="absolute top-0 left-0 md:left-20 h-full w-[2px] bg-navy/10"
              initial={{ scaleY: 0 }}
              animate={isTimelineInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top" }}
            />

            <div className="space-y-20">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  className="relative pl-12 md:pl-40"
                  initial={{ opacity: 0, x: -40 }}
                  animate={isTimelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="absolute left-0 md:left-0 top-0">
                    <div className="inline-block px-6 py-2 bg-navy text-white font-bold text-lg">
                      {item.year}
                    </div>
                  </div>

                  <motion.div 
                    className="absolute left-[-5px] md:left-[75px] top-3 w-3 h-3 bg-royal rounded-full"
                    initial={{ scale: 0 }}
                    animate={isTimelineInView ? { scale: 1 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3, ease: "backOut" }}
                  />

                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-navy">{item.title}</h3>
                    <p className="text-navy/70 leading-relaxed max-w-2xl">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section ref={valuesRef} className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-navy mb-6 tracking-tight">
              Our Core Values
            </h2>
            <p className="text-lg text-navy/70 max-w-2xl leading-relaxed">
              The principles that guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="group relative p-8 bg-white border border-navy/10 hover:border-royal/40 transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                animate={isValuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="text-2xl font-semibold text-navy mb-4">{value.title}</h3>
                <p className="text-navy/60 leading-relaxed">{value.description}</p>
                
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-royal group-hover:w-full transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
