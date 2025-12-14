'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import Link from 'next/link';
import { getImageUrl } from '@/lib/imageUtils';

interface Work {
    id: number;
    title: string;
    description: string;
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

const defaultHeroContent: HeroContent = {
    id: 0,
    title: 'Innovating',
    title_highlight: 'Nanophotonics',
    description: 'Ph.D. student at POSTECH, specializing in nanofabrication and metasurfaces for next-gen optical applications like VR/AR and optical computing.',
    cta_primary_text: 'Explore Research',
    cta_primary_link: '/research',
    cta_secondary_text: 'View CV',
    cta_secondary_link: '/cv'
};

function HeroSection() {
    const [representativeWorks, setRepresentativeWorks] = useState<Work[]>([]);
    const [heroContent, setHeroContent] = useState<HeroContent>(defaultHeroContent);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        // Fetch representative works
        fetch('/api/representative-works')
            .then(res => {
                console.log('Representative works response status:', res.status);
                return res.json();
            })
            .then(data => {
                console.log('Representative works data:', data);
                if (Array.isArray(data) && data.length > 0) {
                    setRepresentativeWorks(data);
                } else {
                    console.warn('No representative works found or invalid data format');
                }
            })
            .catch(err => console.error('Failed to fetch representative works:', err));

        // Fetch hero content
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
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-white dark:bg-gray-950 transition-colors">
            {/* Subtle Background Gradients - Professional & Natural */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10 py-12">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Text Content - Huge & Impactful */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-10 order-2 md:order-1"
                    >
                        <div className="space-y-4">
                            <h1 className="text-6xl lg:text-8xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1]">
                                {heroContent.title}{' '}
                                <span className="text-blue-600 dark:text-blue-500 inline-block">
                                    {heroContent.title_highlight}
                                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl font-light">
                                {heroContent.description}
                            </p>
                        </div>

                        {/* Professional CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={heroContent.cta_primary_link}
                                className="group px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
                            >
                                {heroContent.cta_primary_text}
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href={heroContent.cta_secondary_link}
                                className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white text-lg font-medium rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
                            >
                                {heroContent.cta_secondary_text}
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Representative Work - Clean & Visual */}
                    {representativeWorks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            className="relative order-1 md:order-2"
                        >
                            <div className="relative w-full h-[300px] md:h-[450px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-gray-100 dark:bg-gray-800">
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
                                        {/* Professional Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                        {/* Content Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="px-3 py-1 text-xs font-bold tracking-wider uppercase bg-blue-600 text-white rounded-full">
                                                    Featured Work
                                                </span>
                                                <div className="h-px flex-1 bg-white/30" />
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                                                {representativeWorks[currentIndex].title}
                                            </h3>
                                            <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-lg">
                                                {representativeWorks[currentIndex].description || 'Exploring the frontiers of nanophotonics.'}
                                            </p>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation - Minimalist */}
                                <div className="absolute bottom-8 right-8 flex gap-3 z-20">
                                    <button
                                        onClick={prevSlide}
                                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/10"
                                        aria-label="Previous"
                                    >
                                        <FiChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all border border-white/10"
                                        aria-label="Next"
                                    >
                                        <FiChevronRight size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Indicators */}
                            <div className="flex justify-center gap-2 mt-6">
                                {representativeWorks.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${
                                            idx === currentIndex 
                                                ? 'w-12 bg-gradient-to-r from-blue-600 to-blue-400' 
                                                : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-blue-400'
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
