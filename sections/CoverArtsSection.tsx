'use client';

import React, { useEffect, useState, useRef } from "react";
import { motion } from 'framer-motion';
import { getImageUrl } from '@/lib/imageUtils';

export default function CoverArtsSection() {
    const [coverArts, setCoverArts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/cover-arts')
            .then(res => res.json())
            .then(data => setCoverArts(data))
            .catch(err => console.error(err));
    }, []);

    if (coverArts.length === 0) return null;

    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Featured Cover Arts
                    </h2>
                    <div className="w-20 h-1 bg-indigo-500 mx-auto rounded-full" />
                </motion.div>
            </div>

            {/* Infinite Scroll Container */}
            <div className="relative w-full">
                <div className="flex gap-8 animate-scroll hover:pause px-4 w-max">
                    {[...coverArts, ...coverArts, ...coverArts].map((art, index) => (
                        <motion.div
                            key={`${art.id}-${index}`}
                            whileHover={{ scale: 1.05 }}
                            className="flex-shrink-0 w-[300px] md:w-[400px] relative group rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                        >
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <img
                                    src={getImageUrl(art.image_path)}
                                    alt={art.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-2">{art.title}</h3>
                                        <p className="text-indigo-400 text-sm">{art.journal} {art.year}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
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
