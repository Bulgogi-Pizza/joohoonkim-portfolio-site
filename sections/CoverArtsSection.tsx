'use client';

import React, { useEffect, useState, useCallback } from "react";
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/imageUtils';
import { useRouter } from 'next/navigation';

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

    if (coverArts.length === 0) return null;

    return (
        <section className="py-12 md:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 mb-8 md:mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Cover Arts
                    </h2>
                    <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full" />
                </motion.div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative w-full">
                <div className="flex gap-4 md:gap-8 animate-scroll hover:pause px-4 w-max">
                    {[...coverArts, ...coverArts, ...coverArts].map((art, index) => (
                        <motion.button
                            key={`${art.id}-${index}`}
                            onClick={() => openLink(art.link)}
                            whileHover={{ scale: art.link ? 1.05 : 1 }}
                            className={`text-left flex-shrink-0 w-[240px] md:w-[300px] lg:w-[400px] relative group rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${art.link ? 'cursor-pointer' : 'cursor-default'}`}
                            aria-label={art.link ? `Open ${art.title}` : undefined}
                            disabled={!art.link}
                        >
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <img
                                    src={getImageUrl(art.image_path)}
                                    alt={art.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                                    <div className="flex flex-col items-center">
                                        <h3 className="text-white font-bold text-lg mb-2">{art.title}</h3>
                                        <p className="text-indigo-400 text-sm mb-4">{art.journal} {art.year}</p>
                                        {art.link && (
                                            <div className="bg-indigo-600 text-white p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <FiExternalLink size={20} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>

            <style jsx global>{`
        .pause {
          animation-play-state: paused;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
        </section>
    );
}
