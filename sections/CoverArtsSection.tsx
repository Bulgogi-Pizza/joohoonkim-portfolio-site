'use client';

import React, { useEffect, useState, useCallback } from "react";
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/imageUtils';
import { useRouter } from 'next/navigation';
import SectionHeader from '@/components/ui/SectionHeader';

const isExternal = (href: string) => /^https?:\/\//i.test(href);

import { FiExternalLink } from 'react-icons/fi'; // Add import

interface CoverArt {
    id: number;
    title: string;
    image_path: string;
    link?: string;
    journal: string;
    year?: string;
}

export default function CoverArtsSection() {
    const [coverArts, setCoverArts] = useState<CoverArt[]>([]); // Update state type
    const router = useRouter();

    const openLink = useCallback((href?: string) => {
        if (!href) return;
        if (isExternal(href)) {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            router.push(href.startsWith('/') ? href : `/${href}`);
        }
    }, [router]);

    useEffect(() => {
        fetch('/api/cover-arts')
            .then(res => res.json())
            .then(data => setCoverArts(data))
            .catch(err => console.error(err));
    }, []);

    // Infinite scroll logic with smooth pause
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Animation refs
    const scrollPosDiff = React.useRef(0); // Current scroll position
    const currentSpeed = React.useRef(0.5); // Current scroll speed (pixels per frame)
    const reqId = React.useRef<number>();

    // Configuration
    const BASE_SPEED = 1.7; // Normal speed
    const DAMPING = 0.05; // Smoothing factor (0.05 = gradual, 1 = instant)

    useEffect(() => {
        const container = containerRef.current;
        if (!container || coverArts.length === 0) return;

        const animate = () => {
            // Determine target speed based on hover state
            const targetSpeed = isHovering ? 0 : BASE_SPEED;

            // Smoothly interpolate current speed towards target speed
            currentSpeed.current += (targetSpeed - currentSpeed.current) * DAMPING;

            // Stop animation calculation if effectively stopped
            if (Math.abs(currentSpeed.current) < 0.001 && isHovering) {
                currentSpeed.current = 0;
            }

            // Update scroll position
            scrollPosDiff.current += currentSpeed.current;

            // Loop logic:
            // Calculate the width of one single set of items to know when to wrap.
            // We use the offset difference between the first item of the first set
            // and the first item of the second set (index = coverArts.length).
            // This accounts for variable widths and gaps (responsive).
            const N = coverArts.length;
            let maxScroll = 0;

            if (container.children.length >= N * 2) {
                const firstItem = container.children[0] as HTMLElement;
                const secondSetFirstItem = container.children[N] as HTMLElement;
                maxScroll = secondSetFirstItem.offsetLeft - firstItem.offsetLeft;
            } else {
                // Fallback (should typically not happen if rendered correctly)
                maxScroll = container.scrollWidth / 3;
            }

            if (scrollPosDiff.current >= maxScroll) {
                scrollPosDiff.current -= maxScroll;
            }

            // Apply transform
            container.style.transform = `translateX(-${scrollPosDiff.current}px)`;

            reqId.current = requestAnimationFrame(animate);
        };

        // Start animation
        reqId.current = requestAnimationFrame(animate);

        return () => {
            if (reqId.current) cancelAnimationFrame(reqId.current);
        };
    }, [coverArts, isHovering]);

    if (coverArts.length === 0) return null;

    return (
        <section className="py-14 md:py-20 my-6 bg-ink dark:bg-black/40 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl mb-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader
                        inverted
                        title="Featured Cover Arts"
                        count={`${coverArts.length} covers`}
                    />
                </motion.div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative w-full">
                <div
                    ref={containerRef}
                    className="flex gap-4 md:gap-8 px-4 w-max"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    {[...coverArts, ...coverArts, ...coverArts].map((art, index) => (
                        <motion.button
                            key={`${art.id}-${index}`}
                            onClick={() => openLink(art.link)}
                            whileHover={{ scale: art.link ? 1.05 : 1 }}
                            className={`text-left flex-shrink-0 w-[240px] md:w-[280px] lg:w-[350px] relative group rounded overflow-hidden border border-white/15 bg-white/[.03] transition-all duration-200 hover:border-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${art.link ? 'cursor-pointer' : 'cursor-default'}`}
                            aria-label={art.link ? `Open ${art.title}` : undefined}
                            disabled={!art.link}
                        >
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <img
                                    src={getImageUrl(art.image_path)}
                                    alt={art.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                                    <h3 className="text-white font-heading font-bold text-base md:text-lg leading-snug mb-2">{art.title}</h3>
                                    {art.link && (
                                        <span className="inline-flex items-center gap-1.5 text-white/80 font-mono text-xs uppercase tracking-widest transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                            View <FiExternalLink size={13} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
}
