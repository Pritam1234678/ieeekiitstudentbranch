"use client";

import { motion, useScroll } from "framer-motion";
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
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-200/50' : 'bg-white'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={() => setIsOpen(false)}>
            <motion.div
              className="relative z-50"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/mainlogo.png"
                alt="IEEE KIIT Student Branch"
                width={180}
                height={60}
                priority
                className="h-8 sm:h-10 md:h-12 w-auto max-w-[145px] sm:max-w-[170px] md:max-w-[180px]"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navItems.map((item, index) => (
              <NavItem
                key={item.path}
                item={item}
                isActive={pathname === item.path}
                index={index}
              />
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden lg:block">
            <MagneticButton href="/contact">
              Get Involved
            </MagneticButton>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden relative z-[110] w-9 h-9 sm:w-10 sm:h-10 flex flex-col items-center justify-center gap-1.5 group"
            aria-label="Toggle Menu"
          >
            <motion.span
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 8 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="w-8 h-0.5 bg-slate-800 block"
            />
            <motion.span
              animate={{
                opacity: isOpen ? 0 : 1,
                x: isOpen ? -20 : 0
              }}
              transition={{ duration: 0.3 }}
              className="w-8 h-0.5 bg-slate-800 block"
            />
            <motion.span
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -8 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="w-8 h-0.5 bg-slate-800 block"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        items={navItems}
        pathname={pathname}
      />
    </>
  );
};

// Individual Nav Item with Magnetic Effect
const NavItem = ({
  item,
  isActive,
  index
}: {
  item: { name: string; path: string };
  isActive: boolean;
  index: number;
}) => {
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
        style={{ x: position.x, y: position.y }}
        className={`text-sm font-medium tracking-wide relative inline-block transition-colors duration-300 ${isActive
          ? "text-blue-600 font-semibold"
          : "text-slate-600 hover:text-blue-600"
          }`}
      >
        {item.name}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-600"
            transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </motion.span>
    </Link>
  );
};

const MagneticButton = ({
  children,
  href
}: {
  children: React.ReactNode;
  href: string;
}) => {
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
        style={{ x: position.x, y: position.y }}
        className="relative px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    </Link>
  );
};

const MobileMenu = ({
  isOpen,
  setIsOpen,
  items,
  pathname
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  items: typeof navItems;
  pathname: string;
}) => {
  return (
    <motion.div
      initial={false}
      animate={{
        clipPath: isOpen
          ? "circle(150% at calc(100% - 40px) 40px)"
          : "circle(0% at calc(100% - 40px) 40px)",
      }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors z-50"
        aria-label="Close Menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Solid Background with Subtle Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px]" />

      {/* Menu Content */}
      <div className="relative flex flex-col gap-5 sm:gap-6 md:gap-8 text-center z-10 px-6 sm:px-8">
        {items.map((item, index) => (
          <Link
            key={item.path}
            href={item.path}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              custom={index}
              initial={{ opacity: 0, y: 40 }}
              animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{
                duration: 0.5,
                delay: isOpen ? index * 0.1 : 0,
                ease: [0.16, 1, 0.3, 1]
              }}
              className={`text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-300 ${pathname === item.path
                ? "text-blue-600"
                : "text-slate-800 active:text-blue-600"
                }`}
            >
              {item.name}
              {pathname === item.path && (
                <motion.div
                  layoutId="activeMobileNav"
                  className="h-1 bg-blue-600 rounded-full mx-auto mt-2"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default Navigation;
