"use client";

import { useRef, useState } from "react";
import { motion, useInView, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Custom Icons with Animation ---

const NetworkIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <circle cx="24" cy="24" r="3" fill="currentColor" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="36" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="36" r="2" fill="currentColor" />
      <circle cx="36" cy="36" r="2" fill="currentColor" />
      <motion.line
        x1="22" y1="22" x2="14" y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
      <motion.line
        x1="26" y1="22" x2="34" y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
      <motion.line
        x1="22" y1="26" x2="14" y2="34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      />
      <motion.line
        x1="26" y1="26" x2="34" y2="34"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
    </motion.g>
  </svg>
);

const TechnicalIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.rect
        x="8" y="8" width="14" height="14" rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
      <motion.rect
        x="26" y="8" width="14" height="14" rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
      <motion.rect
        x="8" y="26" width="14" height="14" rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      />
      <motion.rect
        x="26" y="26" width="14" height="14" rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      />
    </motion.g>
  </svg>
);

const CareerIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.path
        d="M24 6L27.708 17.292L39 21L27.708 24.708L24 36L20.292 24.708L9 21L20.292 17.292L24 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.circle
        cx="24" cy="21" r="4"
        fill="currentColor"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    </motion.g>
  </svg>
);

const InnovationIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.path
        d="M24 8C24 8 16 14 16 22C16 26.4 19.6 30 24 30C28.4 30 32 26.4 32 22C32 14 24 8 24 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />
      <motion.path
        d="M20 34H28M22 38H26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      <motion.path
        d="M24 18V26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      />
    </motion.g>
  </svg>
);

// --- Data ---

const benefits = [
  {
    icon: NetworkIcon,
    title: "Global Network",
    description: "Connect with 400,000+ members across 160 countries. Access exclusive IEEE resources and a worldwide community of innovators.",
    stat: "400K+",
    statLabel: "Members",
    color: "from-blue-600 to-indigo-600",
  },
  {
    icon: TechnicalIcon,
    title: "Technical Excellence",
    description: "Gain hands-on experience through cutting-edge workshops. Participate in research opportunities and technical projects.",
    stat: "50+",
    statLabel: "Workshops",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: CareerIcon,
    title: "Career Acceleration",
    description: "Access mentorship programs and industry connections. Fast-track your professional development with verified credentials.",
    stat: "95%",
    statLabel: "Placement",
    color: "from-indigo-600 to-violet-600",
  },
  {
    icon: InnovationIcon,
    title: "Innovation Hub",
    description: "Collaborate on groundbreaking projects. Participate in international competitions and hackathons.",
    stat: "25+",
    statLabel: "Projects",
    color: "from-violet-600 to-fuchsia-600",
  },
];

// --- Components ---

const BenefitCard = ({ benefit, index, isInView }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = benefit.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt Effect Logic
  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct * 10); // Rotate Y
    y.set(yPct * -10); // Rotate X (inverted)
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className="group relative h-full perspective-1000"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX: y, rotateY: x }}
        className="relative h-full bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
      >
        {/* Animated Gradient Border Overlay */}
        <div className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none",
          isHovered ? "opacity-100" : ""
        )}
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,130,246,0.1), transparent 40%)`
          }}
        />

        {/* Glow Element */}
        <div className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          `bg-gradient-to-br ${benefit.color}`
        )} />

        <div className="relative p-6 sm:p-8 h-full flex flex-col z-10">

          <div className="flex justify-between items-start mb-6">
            <motion.div
              className={cn("w-14 h-14 text-slate-700 p-3 rounded-2xl bg-white shadow-sm border border-slate-100", isHovered ? "text-blue-600" : "")}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon />
            </motion.div>

            <div className={cn("text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500 transition-colors duration-300", isHovered ? "bg-blue-50 text-blue-600" : "")}>
              0{index + 1}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors">
            {benefit.title}
          </h3>

          <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
            {benefit.description}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100/50">
            <div>
              <span className="block text-3xl font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-500 transition-all">
                {benefit.stat}
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {benefit.statLabel}
              </span>
            </div>

            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 transition-all duration-300",
              isHovered ? "bg-blue-600 border-blue-600 text-white -rotate-45" : ""
            )}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
};

const ShootingStar = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ x: -100, y: -100, opacity: 0 }}
    animate={{ x: "120vw", y: "120vh", opacity: [0, 1, 1, 0] }}
    transition={{
      duration: Math.random() * 2 + 2,
      repeat: Infinity,
      delay: delay,
      ease: "linear",
      repeatDelay: Math.random() * 10
    }}
    className="absolute w-[2px] h-[2px] bg-blue-400 rounded-full z-0"
  >
    <div className="absolute top-0 right-0 w-[100px] h-[1px] bg-gradient-to-l from-blue-400 to-transparent -rotate-45 origin-right translate-x-[50px] -translate-y-[50px]" />
  </motion.div>
);

const WhyIEEE = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden bg-slate-50"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <ShootingStar key={i} delay={i * 2} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 mb-14 sm:mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-50 border border-blue-100 mb-5 sm:mb-6 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-semibold text-blue-900 uppercase tracking-wider">
                Member Benefits
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              Why students <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 animate-gradient-x bg-[length:200%_auto]">
                choose IEEE
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="pb-2"
          >
            <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-lg ml-auto">
              Join the world&apos;s largest technical professional organization.
              Unlock opportunities, build your network, and shape the future of technology.
            </p>
          </motion.div>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              benefit={benefit}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyIEEE;
