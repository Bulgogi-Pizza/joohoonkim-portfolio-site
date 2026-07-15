'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiCpu, FiActivity, FiArrowRight } from 'react-icons/fi';

import { getImageUrl } from '@/lib/imageUtils';
import SectionHeader from '@/components/ui/SectionHeader';
import Card from '@/components/ui/Card';

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
            case 'metasurface': return <FiLayers className="w-7 h-7" />;
            case 'nanofabrication': return <FiCpu className="w-7 h-7" />;
            default: return <FiActivity className="w-7 h-7" />;
        }
    };

    return (
        <section id="research" className="py-10 md:py-14">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader
                        title="Research Areas"
                        count={researchAreas.length > 0 ? `${String(researchAreas.length).padStart(2, '0')} areas` : undefined}
                    />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {researchAreas.map((area, index) => (
                        <motion.div
                            key={area.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card href={`/research/${area.slug}`} topBar className="group p-7 h-full">
                                <div className="mb-5 text-accent dark:text-dark-accent">
                                    {area.icon_path ? (
                                        <img
                                            src={getImageUrl(area.icon_path)}
                                            alt=""
                                            className="w-8 h-8 object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
                                        />
                                    ) : (
                                        getIcon(area.slug)
                                    )}
                                </div>

                                <h3 className="font-heading text-lg font-bold text-ink dark:text-dark-ink mb-2 group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">
                                    {area.title}
                                </h3>

                                <p className="text-sm text-ink-2 dark:text-dark-ink-2 leading-relaxed mb-5 line-clamp-3">
                                    {area.description.replace(/!\[.*?\]\(.*?\)/g, '').replace(/##/g, '').replace(/\*\*/g, '')}
                                </p>

                                <span className="inline-flex items-center gap-1 text-sm text-accent dark:text-dark-accent font-semibold group-hover:gap-2.5 transition-all">
                                    Learn more <FiArrowRight />
                                </span>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
