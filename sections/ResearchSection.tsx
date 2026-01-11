'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiLayers, FiCpu, FiActivity, FiArrowRight } from 'react-icons/fi';

import { getImageUrl } from '@/lib/imageUtils';

interface ResearchArea {
    slug: string;
    title: string;
    description: string;
    icon_path?: string;
}

export default function ResearchSection() {
    const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);

    useEffect(() => {
        fetch('/api/research-areas')
            .then(res => res.json())
            .then(data => setResearchAreas(data))
            .catch(err => console.error(err));
    }, []);

    const getIcon = (slug: string) => {
        switch (slug) {
            case 'metasurface': return <FiLayers className="w-8 h-8" />;
            case 'nanofabrication': return <FiCpu className="w-8 h-8" />;
            default: return <FiActivity className="w-8 h-8" />;
        }
    };

    return (
        <section id="research" className="py-12 md:py-24 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16"
                >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Research Areas
                    </h2>
                    <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {researchAreas.map((area, index) => (
                        <motion.div
                            key={area.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                            <div className="mb-6 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-xl inline-block text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                {area.icon_path ? (
                                    <img
                                        src={getImageUrl(area.icon_path)}
                                        alt={area.title}
                                        className="w-9 h-9 object-contain mix-blend-multiply dark:mix-blend-screen dark:invert group-hover:mix-blend-screen group-hover:invert"
                                    />
                                ) : (
                                    getIcon(area.slug)
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {area.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                                {area.description.replace(/!\[.*?\]\(.*?\)/g, '').replace(/##/g, '').replace(/\*\*/g, '')}
                            </p>

                            <Link
                                href={`/research/${area.slug}`}
                                className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-2 transition-all"
                            >
                                Learn more <FiArrowRight className="ml-2" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
