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
            case 'metasurface': return <FiLayers className="w-9 h-9" />;
            case 'nanofabrication': return <FiCpu className="w-9 h-9" />;
            default: return <FiActivity className="w-9 h-9" />;
        }
    };

    return (
        <section id="research" className="py-10 md:py-14">
            <div className="container mx-auto px-gutter max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader title="Research Areas" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {researchAreas.map((area, index) => (
                        <motion.div
                            key={area.slug}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full"
                        >
                            <Card href={`/research/${area.slug}`} topBar className="group p-7 h-full flex flex-col">
                                <div className="mb-5 text-accent dark:text-dark-accent">
                                    {area.icon_path ? (
                                        <img
                                            src={getImageUrl(area.icon_path)}
                                            alt=""
                                            className="w-10 h-10 object-contain mix-blend-multiply dark:mix-blend-screen dark:invert"
                                        />
                                    ) : (
                                        getIcon(area.slug)
                                    )}
                                </div>

                                <h3 className="font-heading text-lg font-bold text-ink dark:text-dark-ink mb-5 group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">
                                    {area.title}
                                </h3>

                                <span className="mt-auto self-start inline-flex items-center gap-1 text-sm text-accent dark:text-dark-accent font-semibold group-hover:gap-2.5 transition-all">
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
