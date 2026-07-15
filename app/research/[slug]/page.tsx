'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import MonoLabel from '@/components/ui/MonoLabel';

interface ResearchArea {
    id: number;
    slug: string;
    title: string;
    description: string;
}

export default function ResearchSlugPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);
    const [activeArea, setActiveArea] = useState<ResearchArea | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/research-areas')
            .then(res => res.json())
            .then(data => {
                setResearchAreas(data);
                const found = data.find((a: ResearchArea) => a.slug === slug);
                if (found) {
                    setActiveArea(found);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching research areas:', err);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-accent dark:border-dark-accent dark:border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!activeArea) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-ink-2 dark:text-dark-ink-2">Research area not found.</p>
            </div>
        );
    }

    const activeIndex = researchAreas.findIndex((a) => a.slug === activeArea.slug);

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl py-10 md:py-14">
                <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-14">

                    {/* Sidebar Navigation */}
                    <aside className="mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-28">
                            <MonoLabel>
                                Research · {String(researchAreas.length).padStart(2, '0')}
                            </MonoLabel>

                            {/* Desktop: vertical list */}
                            <nav className="hidden lg:block mt-5 space-y-1">
                                {researchAreas.map((area) => (
                                    <Link
                                        key={area.slug}
                                        href={`/research/${area.slug}`}
                                        className={`block px-3.5 py-2.5 rounded-[4px] text-sm transition-colors ${area.slug === activeArea.slug
                                            ? 'bg-ink text-white dark:bg-dark-ink dark:text-dark-bg font-semibold'
                                            : 'text-ink-2 dark:text-dark-ink-2 hover:bg-line/40 dark:hover:bg-white/5 hover:text-ink dark:hover:text-dark-ink'
                                            }`}
                                    >
                                        {area.title}
                                    </Link>
                                ))}
                            </nav>

                            {/* Mobile: horizontal chips */}
                            <nav className="lg:hidden mt-4 flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
                                {researchAreas.map((area) => (
                                    <Link
                                        key={area.slug}
                                        href={`/research/${area.slug}`}
                                        className={`shrink-0 px-4 py-2 rounded-[3px] border text-sm transition-colors ${area.slug === activeArea.slug
                                            ? 'bg-ink border-ink text-white dark:bg-dark-ink dark:border-dark-ink dark:text-dark-bg font-semibold'
                                            : 'border-line dark:border-dark-line text-ink-2 dark:text-dark-ink-2'
                                            }`}
                                    >
                                        {area.title}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <article>
                        <MonoLabel color="accent">
                            Research Area {String(activeIndex + 1).padStart(2, '0')}
                        </MonoLabel>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-dark-ink mt-3 mb-8 pb-6 border-b border-line dark:border-dark-line">
                            {activeArea.title}
                        </h1>

                        <div className="text-left">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    img: ({ node, ...props }) => (
                                        <img {...props} className="mx-auto my-8 rounded-xl border border-line dark:border-dark-line shadow-elev dark:shadow-none max-h-96 w-auto" loading="lazy" />
                                    ),
                                    a: ({ node, ...props }) => (
                                        <a {...props} className="text-accent dark:text-dark-accent hover:opacity-70 underline underline-offset-2 break-words transition-opacity" target="_blank" rel="noopener noreferrer" />
                                    ),
                                    h1: ({ node, ...props }) => (
                                        <h1 {...props} className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-ink dark:text-dark-ink mb-4 mt-10" />
                                    ),
                                    h2: ({ node, ...props }) => (
                                        <h2 {...props} className="font-heading text-xl md:text-2xl font-bold tracking-tight text-ink dark:text-dark-ink mb-4 mt-10" />
                                    ),
                                    h3: ({ node, ...props }) => (
                                        <h3 {...props} className="font-heading text-lg md:text-xl font-bold text-ink dark:text-dark-ink mb-3 mt-8" />
                                    ),
                                    p: ({ node, ...props }) => (
                                        <p {...props} className="text-base text-ink-2 dark:text-dark-ink-2 leading-relaxed mb-5" />
                                    ),
                                    ul: ({ node, ...props }) => (
                                        <ul {...props} className="list-disc ml-6 mb-5 space-y-2" />
                                    ),
                                    ol: ({ node, ...props }) => (
                                        <ol {...props} className="list-decimal ml-6 mb-5 space-y-2" />
                                    ),
                                    li: ({ node, ...props }) => (
                                        <li {...props} className="text-base text-ink-2 dark:text-dark-ink-2 leading-relaxed" />
                                    ),
                                    code: ({ node, inline, ...props }: any) => (
                                        inline ?
                                            <code {...props} className="bg-line/50 dark:bg-white/10 text-ink dark:text-dark-ink px-1.5 py-0.5 rounded font-mono text-sm" /> :
                                            <code {...props} className="block bg-line/30 dark:bg-white/5 border border-line dark:border-dark-line text-ink dark:text-dark-ink p-4 rounded-xl overflow-x-auto font-mono text-sm" />
                                    ),
                                    blockquote: ({ node, ...props }) => (
                                        <blockquote {...props} className="border-l-2 border-accent dark:border-dark-accent pl-4 italic text-ink-3 dark:text-dark-ink-3 my-6" />
                                    ),
                                }}
                            >
                                {activeArea.description || ""}
                            </ReactMarkdown>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
