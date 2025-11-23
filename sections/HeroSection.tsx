'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from 'react-icons/fi';
import Link from 'next/link';

interface Work {
    id: number;
    title: string;
    description: string;
    image_path: string;
}

function HeroSection() {
    const [representativeWorks, setRepresentativeWorks] = useState<Work[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => {
        fetch('/api/representative-works')
            .then(res => res.json())
            .then(data => setRepresentativeWorks(data))
            .catch(err => console.error(err));
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
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-brand-light dark:bg-gray-900 transition-colors">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <h1 className="text-4xl md:text-6xl font-heading font-bold leading-tight text-brand-dark dark:text-white">
                            Innovating <br />
                            <span className="text-brand-primary">
                                Nanophotonics
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                            Ph.D. student at POSTECH, specializing in nanofabrication and metasurfaces for next-gen optical applications like VR/AR and optical computing.
                        </p>

                        <div className="flex gap-4 pt-4">
                            <Link href="/research" className="px-8 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 flex items-center gap-2">
                                Explore Research <FiArrowRight />
                            </Link>
                            <Link href="/cv" className="px-8 py-3 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:border-brand-primary hover:text-brand-primary dark:hover:text-brand-primary transition-colors bg-white dark:bg-gray-800">
                                View CV
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Content - Carousel */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 border border-slate-100 dark:border-gray-700">
                            <AnimatePresence mode="wait">
                                {representativeWorks.length > 0 && (
                                    <motion.div
                                        key={currentIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0"
                                    >
                                        <img
                                            src={representativeWorks[currentIndex].image_path}
                                            alt={representativeWorks[currentIndex].title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />

                                        <div className="absolute bottom-0 left-0 p-8 text-white">
                                            <h3 className="text-xl font-bold mb-2">{representativeWorks[currentIndex].title}</h3>
                                            <p className="text-sm text-slate-200 line-clamp-2">{representativeWorks[currentIndex].description}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Controls */}
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button onClick={prevSlide} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                                    <FiChevronLeft />
                                </button>
                                <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                                    {isPlaying ? <FiPause /> : <FiPlay />}
                                </button>
                                <button onClick={nextSlide} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors">
                                    <FiChevronRight />
                                </button>
                            </div>
                        </div>

                        {/* Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {representativeWorks.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-brand-primary' : 'w-2 bg-slate-300 dark:bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}

export default HeroSection;
