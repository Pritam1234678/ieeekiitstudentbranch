"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Societies", path: "/socity" },
  { name: "Members", path: "/members" },
  { name: "Contact", path: "/contact" },
];

const Navigation = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500`}
      style={{
        background: isScrolled 
          ? 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(230,240,255,0.90) 100%)'
          : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        boxShadow: isScrolled ? '0 4px 20px rgba(11, 94, 215, 0.08)' : 'none'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-1 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="/mainlogo.png"
              alt="IEEE KIIT Student Branch"
              width={480}
              height={140}
              priority
              className="h-28 w-auto"
            />
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-12">
          {navItems.map((item, index) => (
            <NavItem 
              key={item.path} 
              item={item} 
              isActive={pathname === item.path}
              index={index}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <MagneticButton href="/contact">
            Get Involved
          </MagneticButton>
        </div>
      </div>
    </motion.nav>
  );
};

// Individual Nav Item with Magnetic Effect
const NavItem = ({ item, isActive, index }: { item: { name: string; path: string }, isActive: boolean, index: number }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  return (
    <Link 
      ref={linkRef}
      href={item.path}
      onMouseMove={handleMouse}
      onMouseLeave={resetPosition}
    >
      <motion.span
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          x: position.x,
          y: position.y,
        }}
        className={`text-sm font-medium tracking-wide relative inline-block transition-colors duration-300 ${
          isActive
            ? "text-navy"
            : "text-navy/60 hover:text-navy"
        }`}
      >
        {item.name}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-royal"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </motion.span>
    </Link>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, href }: { children: React.ReactNode, href: string }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.5, y: y * 0.5 });
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  return (
    <Link 
      ref={buttonRef}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={resetPosition}
    >
      <motion.div
        style={{
          x: position.x,
          y: position.y,
          background: 'linear-gradient(135deg, #0B5ED7 0%, #0A1A2F 100%)',
          boxShadow: '0 4px 20px rgba(11, 94, 215, 0.3)'
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        className="group relative px-6 py-3 text-white text-sm font-semibold rounded-full overflow-hidden"
      >
        <span className="relative z-10">{children}</span>
        <motion.div 
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0A1A2F 0%, #0B5ED7 100%)' }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>
    </Link>
  );
};

export default Navigation;
