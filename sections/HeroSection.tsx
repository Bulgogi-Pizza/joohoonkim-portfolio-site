'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imageUtils';

interface Work {
    id: number;
    title: string;
    journal: string;
    volume?: string;
    pages?: string;
    year?: string;
    description?: string;
    image_path: string;
}

interface HeroContent {
    id: number;
    title: string;
    title_highlight: string;
    description: string;
    cta_primary_text: string;
    cta_primary_link: string;
    cta_secondary_text: string;
    cta_secondary_link: string;
}

function HeroSection() {
    const [representativeWorks, setRepresentativeWorks] = useState<Work[]>([]);
    const [heroContent, setHeroContent] = useState<HeroContent>({
        id: 0,
        title: '',
        title_highlight: '',
        description: '',
        cta_primary_text: '',
        cta_primary_link: '',
        cta_secondary_text: '',
        cta_secondary_link: ''
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        fetch('/api/representative-works')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setRepresentativeWorks(data);
                }
            })
            .catch(err => console.error('Failed to fetch representative works:', err));

        fetch('/api/hero')
            .then(res => res.json())
            .then(data => {
                if (data && data.title) {
                    setHeroContent(data);
                }
            })
            .catch(err => console.error('Failed to fetch hero content:', err));
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && representativeWorks.length > 0) {
            interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % representativeWorks.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, representativeWorks.length]);

    const nextSlide = useCallback(() => {
        if (representativeWorks.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % representativeWorks.length);
    }, [representativeWorks.length]);

    const prevSlide = useCallback(() => {
        if (representativeWorks.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + representativeWorks.length) % representativeWorks.length);
    }, [representativeWorks.length]);

    return (
        <section className="transition-colors">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl py-10 md:py-16">
                <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-8 order-2 md:order-1"
                    >
                        <div className="space-y-5">
                            <h1 className="font-heading text-5xl lg:text-7xl font-bold tracking-[-0.03em] text-ink dark:text-dark-ink leading-[1.02]">
                                {heroContent.title}{' '}
                                <span className="text-accent dark:text-dark-accent inline-block">
                                    {heroContent.title_highlight}
                                </span>
                            </h1>
                            <p className="text-base lg:text-lg text-ink-2 dark:text-dark-ink-2 leading-relaxed max-w-xl">
                                {heroContent.description}
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={heroContent.cta_primary_link}
                                className="group px-6 py-3 bg-ink dark:bg-dark-ink text-white dark:text-dark-bg text-sm font-semibold rounded-[4px] hover:bg-accent dark:hover:bg-dark-accent transition-colors duration-200 flex items-center gap-2"
                            >
                                {heroContent.cta_primary_text}
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href={heroContent.cta_secondary_link}
                                className="px-6 py-3 border border-ink/30 dark:border-white/25 text-ink dark:text-dark-ink text-sm font-semibold rounded-[4px] hover:bg-ink hover:border-ink hover:text-white dark:hover:bg-dark-ink dark:hover:border-dark-ink dark:hover:text-dark-bg transition-colors duration-200"
                            >
                                {heroContent.cta_secondary_text}
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Representative Work Carousel */}
                    {representativeWorks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="relative order-1 md:order-2"
                        >
                            <div className="relative w-full h-[280px] md:h-[400px] lg:h-[440px] rounded overflow-hidden border border-line dark:border-dark-line shadow-elev dark:shadow-none bg-card dark:bg-dark-card">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="w-full h-full"
                                    >
                                        <img
                                            src={getImageUrl(representativeWorks[currentIndex].image_path)}
                                            alt={representativeWorks[currentIndex].title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="font-mono text-[10px] tracking-widest uppercase text-white/90">
                                                    Featured Work
                                                </span>
                                                <div className="h-px flex-1 bg-white/30" />
                                            </div>
                                            <h3 className="font-heading text-lg md:text-xl font-bold mb-2 leading-tight">
                                                {representativeWorks[currentIndex].title}
                                            </h3>
                                            <div className="text-gray-300 text-xs md:text-sm max-w-lg">
                                                <span className="font-semibold italic">{representativeWorks[currentIndex].journal}</span>
                                                {representativeWorks[currentIndex].volume && <span className="font-semibold"> {representativeWorks[currentIndex].volume}</span>}
                                                {representativeWorks[currentIndex].pages && <span>, {representativeWorks[currentIndex].pages}</span>}
                                                {representativeWorks[currentIndex].year && <span> ({representativeWorks[currentIndex].year})</span>}
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation */}
                                <div className="absolute bottom-6 right-6 flex gap-2 z-20">
                                    <button
                                        onClick={prevSlide}
                                        className="p-2.5 rounded-[3px] bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all border border-white/15"
                                        aria-label="Previous"
                                    >
                                        <FiChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="p-2.5 rounded-[3px] bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all border border-white/15"
                                        aria-label="Next"
                                    >
                                        <FiChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Indicators */}
                            <div className="flex justify-center gap-2 mt-5">
                                {representativeWorks.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-[3px] transition-all duration-300 ${idx === currentIndex
                                            ? 'w-8 bg-ink dark:bg-dark-ink'
                                            : 'w-3 bg-line dark:bg-white/20 hover:bg-ink/40'
                                            }`}
                                        aria-label={`View work ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
