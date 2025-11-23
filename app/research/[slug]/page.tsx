'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ResearchArea {
    id: number;
    slug: string;
    title: string;
    description: string;
}

export default function ResearchSlugPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const router = useRouter();
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
                } else if (data.length > 0) {
                    // If slug not found, redirect to first one? Or show 404?
                    // For now, let's just set first one or handle error
                    // router.replace(`/research/${data[0].slug}`);
                    // Actually, if params.slug is provided but not found in data, it might be invalid.
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching research areas:', err);
                setLoading(false);
            });
    }, [slug, router]);

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-blue-600"></div>
            </div>
        );
    }

    if (!activeArea) {
        return (
            <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 flex justify-center items-center">
                <p>Research area not found.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-40 py-10 sm:py-12 max-w-[1600px]">

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Research
                    </h1>
                </div>

                {/* Tabs */}
                <div className="mb-12">
                    <nav className="flex justify-center">
                        <div className="flex md:flex-row flex-col w-full max-w-4xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {researchAreas.map((area) => (
                                <Link
                                    key={area.slug}
                                    href={`/research/${area.slug}`}
                                    className={`flex-1 px-4 py-4 text-sm font-medium transition-all duration-200 text-center
                        md:border-r md:border-b-0 border-b border-gray-200 dark:border-gray-700 
                        md:last:border-r-0 last:border-b-0 break-words ${activeArea?.slug === area.slug
                                            ? 'text-white bg-blue-600'
                                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {area.title}
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>

                {/* Content */}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="px-5 sm:px-12 py-10 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{activeArea.title}</h2>
                                <div className="w-12 sm:w-16 h-1 bg-blue-600 mx-auto" />
                            </div>

                            <div className="prose prose-base sm:prose-lg md:prose-xl dark:prose-invert max-w-none text-left">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        img: ({ node, ...props }) => (
                                            <img {...props} className="mx-auto my-4 sm:my-6 rounded shadow max-h-64 sm:max-h-96" loading="lazy" />
                                        ),
                                        a: ({ node, ...props }) => (
                                            <a {...props} className="text-blue-600 underline break-words" target="_blank" rel="noopener noreferrer" />
                                        )
                                    }}
                                >
                                    {activeArea.description || ""}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
