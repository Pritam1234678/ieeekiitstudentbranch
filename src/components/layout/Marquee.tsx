"use client";

import { motion } from "framer-motion";

interface MarqueeProps {
    className?: string;
    delay?: number;
}

const Marquee = ({ className = "", delay = 0 }: MarqueeProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: delay, ease: [0.16, 1, 0.3, 1] }}
            className={`relative z-10 w-full mt-auto ${className}`}
        >
            <div className="marquee w-full border-t border-royal/15 bg-white/65 backdrop-blur-md shadow-[0_-18px_60px_rgba(11,94,215,0.1)]">
                <div className="marquee__inner">
                    {[0, 1].map((track) => (
                        <div key={track} className="marquee__track gap-12 px-10 py-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="text-[12px] md:text-sm font-semibold tracking-[0.22em] uppercase">
                                        <span className="text-[#00629b]">IEEE</span>{" "}
                                        <span className="text-[#17d059]">KIIT</span>{" "}
                                        <span className="text-black">Student Branch</span>
                                    </span>
                                    <span className="text-black/20 text-xs tracking-[0.2em]">•</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Marquee;
