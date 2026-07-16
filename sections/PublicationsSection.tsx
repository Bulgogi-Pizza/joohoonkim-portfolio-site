'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiFileText, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SectionHeader from '@/components/ui/SectionHeader';

export default function PublicationsSection() {
    const [publications, setPublications] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetch('/api/publications')
            .then(res => res.json())
            .then(data => setPublications(data))
            .catch(err => console.error(err));
    }, []);

    const resolveLink = (pub: any) => {
        if (pub.link) return pub.link;
        if (pub.doi) return `https://doi.org/${pub.doi}`;
        if (pub.arxiv) return pub.arxiv;
        return `/publications`;
    };

    const handleRowClick = useCallback((pub: any) => {
        const url = resolveLink(pub);
        if (!url) return;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            router.push(url);
        }
    }, [router]);

    return (
        <section id="publications" className="py-10 md:py-14">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <SectionHeader
                        title="Recent Publications"
                        action={
                            <Link href="/publications" className="shrink-0 text-sm text-accent dark:text-dark-accent font-semibold hover:opacity-70 transition-opacity flex items-center gap-1.5">
                                View all <FiArrowRight />
                            </Link>
                        }
                    />
                </motion.div>

                <div>
                    {publications.slice(0, 5).map((pub, index) => (
                        <motion.div
                            key={pub.id}
                            onClick={() => handleRowClick(pub)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleRowClick(pub); }}
                            role="link"
                            tabIndex={0}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.06 }}
                            className="cursor-pointer text-left w-full group relative flex gap-5 md:gap-8 items-baseline py-4 pl-4 border-b border-line dark:border-dark-line hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
                        >
                            <span aria-hidden className="absolute left-0 top-3 bottom-3 w-[2px] bg-ink dark:bg-dark-ink opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="font-mono text-xs text-accent dark:text-dark-accent shrink-0 w-14">
                                {pub.year}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-ink dark:text-dark-ink mb-1 group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">
                                    {pub.title}
                                </h3>
                                <p className="text-sm text-ink-3 dark:text-dark-ink-3 mb-1 truncate">
                                    {pub.authors}
                                </p>
                                <span className="text-sm italic text-ink-2 dark:text-dark-ink-2">
                                    {pub.journal}
                                </span>
                            </div>

                            <div className="flex gap-1 shrink-0 self-center">
                                {pub.doi && (
                                    <a
                                        href={`https://doi.org/${pub.doi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 text-ink-3 dark:text-dark-ink-3 hover:text-accent dark:hover:text-dark-accent transition-colors"
                                        title="DOI"
                                    >
                                        <FiExternalLink size={17} />
                                    </a>
                                )}
                                {pub.arxiv && (
                                    <a
                                        href={pub.arxiv}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 text-ink-3 dark:text-dark-ink-3 hover:text-accent dark:hover:text-dark-accent transition-colors"
                                        title="arXiv"
                                    >
                                        <FiFileText size={17} />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
