'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { getApiUrl } from '@/lib/api/config';

interface GalleryImage {
    _id: string;
    url: string;
}

interface GalleryCarouselProps {
    eventId: string;
    eventTitle: string;
    onClose: () => void;
}

export default function GalleryCarousel({ eventId, eventTitle, onClose }: GalleryCarouselProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(true);
    const [direction, setDirection] = useState(0); // -1 prev, 1 next
    const [isDragging, setIsDragging] = useState(false);
    const constraintsRef = useRef<HTMLDivElement>(null);

    // Fetch gallery images + preload all into browser cache
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(getApiUrl(`/api/events/${eventId}`));
                const data = await res.json();
                if (data.success && data.data.images?.length > 0) {
                    const imgs: GalleryImage[] = data.data.images;
                    setImages(imgs);

                    // Preload every image so navigating between them is instant
                    imgs.forEach((imgData, i) => {
                        const preloadImg = new window.Image();
                        // First visible image gets high priority; rest load in background
                        (preloadImg as any).fetchpriority = i === 0 ? 'high' : 'auto';
                        preloadImg.decoding = 'async';
                        preloadImg.src = getApiUrl(imgData.url);
                    });
                }
            } catch (e) {
                console.error('Failed to fetch gallery', e);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, [eventId]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') navigate(1);
            if (e.key === 'ArrowLeft') navigate(-1);
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [active, images.length]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const navigate = useCallback((dir: number) => {
        setDirection(dir);
        setActive(prev => (prev + dir + images.length) % images.length);
    }, [images.length]);

    const goTo = (index: number) => {
        setDirection(index > active ? 1 : -1);
        setActive(index);
    };

    // Parallax mouse tracking for the large image
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const rotateX = useSpring(useTransform(mouseY, [-300, 300], [4, -4]), { stiffness: 120, damping: 25 });
    const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-4, 4]), { stiffness: 120, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    };

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? '60%' : '-60%',
            opacity: 0,
            scale: 0.85,
            rotateY: dir > 0 ? 12 : -12,
            filter: 'blur(8px)',
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            rotateY: 0,
            filter: 'blur(0px)',
            transition: {
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
            },
        },
        exit: (dir: number) => ({
            x: dir > 0 ? '-60%' : '60%',
            opacity: 0,
            scale: 0.85,
            rotateY: dir > 0 ? -12 : 12,
            filter: 'blur(8px)',
            transition: {
                duration: 0.5,
                ease: [0.7, 0, 0.84, 0],
            },
        }),
    };

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 z-[100] flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Blurred background image */}
                <div className="absolute inset-0 overflow-hidden">
                    <AnimatePresence mode="sync">
                        {images[active] && (
                            <motion.img
                                key={images[active]._id + '-bg'}
                                src={getApiUrl(images[active].url)}
                                className="absolute inset-0 w-full h-full object-cover scale-110 [filter:blur(40px)_saturate(1.5)_brightness(0.3)]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                            />
                        )}
                    </AnimatePresence>
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/60" />
                    {/* Subtle depth vignette */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" />
                </div>

                {/* Header */}
                <motion.div
                    className="relative z-10 flex items-center justify-between px-8 pt-8 pb-4"
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div>
                        <p className="text-white/40 text-xs tracking-[0.25em] uppercase font-medium mb-1">Event Gallery</p>
                        <h2 className="text-white text-xl font-bold tracking-tight max-w-md leading-tight">{eventTitle}</h2>
                    </div>

                    {/* Counter */}
                    <div className="flex items-center gap-6">
                        {images.length > 0 && (
                            <div className="hidden md:flex items-baseline gap-1">
                                <span className="text-white text-3xl font-black tabular-nums">
                                    {String(active + 1).padStart(2, '0')}
                                </span>
                                <span className="text-white/30 text-sm font-medium">/ {String(images.length).padStart(2, '0')}</span>
                            </div>
                        )}

                        {/* Close */}
                        <motion.button
                            onClick={onClose}
                            className="group relative w-11 h-11 flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:bg-white/15 transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label="Close gallery"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Main Image Stage */}
                <div
                    className="relative z-10 flex-1 flex items-center justify-center px-8 overflow-hidden"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
                    ref={constraintsRef}
                >
                    {loading ? (
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                            <p className="text-white/50 text-sm">Loading gallery...</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center">
                            <p className="text-white/40 text-lg">No gallery images for this event</p>
                        </div>
                    ) : (
                        <>
                            {/* Prev Button */}
                            <motion.button
                                onClick={() => navigate(-1)}
                                className="absolute left-4 md:left-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                whileHover={{ scale: 1.1, x: -2 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Previous image"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </motion.button>

                            {/* Image with 3D tilt + drag */}
                            <div className="w-full max-w-3xl mx-auto" style={{ perspective: 1200 }}>
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={active}
                                        custom={direction}
                                        variants={variants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={0.15}
                                        onDragStart={() => setIsDragging(true)}
                                        onDragEnd={(_, info) => {
                                            setIsDragging(false);
                                            if (info.offset.x < -60) navigate(1);
                                            else if (info.offset.x > 60) navigate(-1);
                                        }}
                                        className="relative cursor-grab active:cursor-grabbing"
                                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                                    >
                                        {/* Image frame */}
                                        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10">
                                            <img
                                                src={getApiUrl(images[active].url)}
                                                alt={`Gallery image ${active + 1}`}
                                                className="w-full max-h-[55vh] object-cover"
                                                draggable={false}
                                            />
                                            {/* Subtle glass overlay on image */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 pointer-events-none" />
                                        </div>

                                        {/* Drag hint — fades out after first interaction */}
                                        <motion.div
                                            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-xs pointer-events-none"
                                            initial={{ opacity: 1 }}
                                            animate={{ opacity: 0 }}
                                            transition={{ delay: 2.5, duration: 0.8 }}
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h8M8 12h8M8 17h8" />
                                            </svg>
                                            Swipe or drag
                                        </motion.div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Next Button */}
                            <motion.button
                                onClick={() => navigate(1)}
                                className="absolute right-4 md:right-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                whileHover={{ scale: 1.1, x: 2 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Next image"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </motion.button>
                        </>
                    )}
                </div>

                {/* Filmstrip Thumbnail Rail */}
                {images.length > 1 && (
                    <motion.div
                        className="relative z-10 px-8 pb-8 pt-4"
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Progress bar */}
                        <div className="max-w-3xl mx-auto mb-4 h-px bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white/60 rounded-full"
                                animate={{ width: `${((active + 1) / images.length) * 100}%` }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="max-w-3xl mx-auto flex gap-2.5 justify-center flex-wrap">
                            {images.map((img, i) => (
                                <motion.button
                                    key={img._id}
                                    onClick={() => goTo(i)}
                                    className="relative flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300"
                                    style={{
                                        borderColor: i === active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.1)',
                                    }}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        opacity: i === active ? 1 : 0.45,
                                        scale: i === active ? 1.05 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <img
                                        src={getApiUrl(img.url)}
                                        alt={`Thumbnail ${i + 1}`}
                                        className="w-14 h-14 object-cover"
                                        draggable={false}
                                    />
                                    {/* Active indicator */}
                                    {i === active && (
                                        <motion.div
                                            layoutId="thumb-active"
                                            className="absolute inset-0 border-2 border-white/80 rounded-lg"
                                        />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Keyboard hint */}
                        <p className="text-center text-white/20 text-xs mt-4 tracking-widest uppercase">
                            ← → Arrow keys to navigate · Esc to close
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
