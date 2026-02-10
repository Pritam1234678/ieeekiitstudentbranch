"use client";
import Link from "next/link";

const socialLinks = [
  { name: "LinkedIn", url: "#" },
  { name: "Instagram", url: "#" },
  { name: "Twitter", url: "#" },
  { name: "GitHub", url: "#" },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent" />
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-sky-400/10 blur-[120px]" />
      <div className="relative max-w-7xl mx-auto py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.2em] uppercase text-white/70">
              IEEE KIIT Student Branch
            </div>
            <h3 className="mt-6 text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Advancing Technology for Humanity
            </h3>
            <p className="mt-4 text-white/60 text-sm leading-relaxed max-w-md">
              A community of innovators, researchers, and builders shaping the
              future through technology and leadership.
            </p>
            <div className="mt-8 h-px w-24 bg-gradient-to-r from-blue-400 via-sky-300 to-transparent" />
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-white/60">
              Navigate
            </h4>
            <ul className="mt-6 space-y-4">
              {["Home", "About", "Events", "Members", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                  >
                    <span className="h-px w-6 bg-white/20 transition-all group-hover:w-10 group-hover:bg-blue-300" />
                    <span className="underline-animated">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-white/60">
              Connect
            </h4>
            <div className="mt-6 grid grid-cols-2 gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"
                >
                  <span className="h-px w-6 bg-white/20 transition-all group-hover:w-10 group-hover:bg-blue-300" />
                  <span className="underline-animated">{social.name}</span>
                
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} IEEE KIIT Student Branch. All rights reserved.
          </p>
          <div className="flex gap-8 text-xs text-white/50">
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
