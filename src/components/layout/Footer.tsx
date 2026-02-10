"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const socialLinks = [
  { name: "LinkedIn", url: "#" },
  { name: "Instagram", url: "#" },
  { name: "Twitter", url: "#" },
  { name: "GitHub", url: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-3 tracking-tight">IEEE KIIT</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              Advancing Technology for Humanity
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-6 tracking-wider uppercase text-white/60">Navigate</h4>
            <ul className="space-y-3">
              {["Home", "About", "Events", "Members", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="group inline-block"
                  >
                    <span className="text-white/70 hover:text-white text-sm transition-colors underline-animated">
                      {item}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="text-sm font-semibold mb-6 tracking-wider uppercase text-white/60">Connect</h4>
            <div className="space-y-3">
              {socialLinks.map((social) => (
                <div key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-block"
                  >
                    <span className="text-white/70 hover:text-white text-sm transition-colors underline-animated">
                      {social.name}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} IEEE KIIT Student Branch. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-white/40">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
