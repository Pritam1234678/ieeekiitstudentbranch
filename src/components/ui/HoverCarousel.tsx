'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getApiUrl } from "@/lib/api/config";

interface HoverCarouselProps {
    eventId: string;
    isHovered: boolean;
    fallbackImageUrl?: string;
}

export default function HoverCarousel({ eventId, isHovered }: { eventId: string; isHovered: boolean }) {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (isHovered && !hasFetched) {
            setHasFetched(true);
            fetch(getApiUrl(`/api/events/${eventId}`))
                .then((res) => res.json())
                .then((data) => {
                    if (data.success && data.data?.images?.length > 0) {
                        setImages(data.data.images.map((img: any) => img.url));
                    }
                })
                .catch((err) => console.error("Failed to fetch images for hover carousel", err));
        }
    }, [isHovered, eventId, hasFetched]);

    useEffect(() => {
        if (!isHovered || images.length <= 1) return;

        // Auto crossfade every 2.5s
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 2500);

        return () => clearInterval(interval);
    }, [isHovered, images.length]);

    // Reset index when hover ends
    useEffect(() => {
        if (!isHovered) {
            // Keep the last image visible while fading out, then reset
            const timeout = setTimeout(() => setCurrentIndex(0), 1000);
            return () => clearTimeout(timeout);
        }
    }, [isHovered]);

    const shouldShow = isHovered && images.length > 0;

    return (
        <AnimatePresence>
            {shouldShow && (
                <motion.div
                    className="absolute inset-0 z-10 overflow-hidden bg-navy pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <AnimatePresence mode="popLayout">
                        <motion.img
                            key={currentIndex}
                            src={getApiUrl(images[currentIndex])}
                            alt={`Event hover preview ${currentIndex}`}
                            className="absolute inset-0 w-full h-full object-cover origin-center"
                            initial={{ opacity: 0, scale: 1.15 }}
                            animate={{ opacity: 1, scale: 1.05 }}
                            exit={{ opacity: 0, scale: 1 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        />
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
