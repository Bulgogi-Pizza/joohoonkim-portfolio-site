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
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 shadow-sm">
                        <div className="px-5 sm:px-12 py-10 sm:py-16">
                            <div className="text-center mb-8 sm:mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">{activeArea.title}</h2>
                                <div className="w-12 sm:w-16 h-1 bg-blue-600 mx-auto" />
                            </div>

                            <div className="prose prose-xl dark:prose-invert max-w-none 
                                prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                                prose-h1:text-5xl prose-h1:mb-6 prose-h1:mt-10
                                prose-h2:text-4xl prose-h2:mb-5 prose-h2:mt-8
                                prose-h3:text-3xl prose-h3:mb-4 prose-h3:mt-6
                                prose-p:text-lg prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline
                                prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6
                                prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6
                                prose-li:text-lg prose-li:mb-2
                                prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic
                                prose-img:rounded-lg prose-img:shadow-md
                                text-left"
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        img: ({ node, ...props }) => (
                                            <img {...props} className="mx-auto my-6 rounded-lg shadow-lg max-h-96 w-auto" loading="lazy" />
                                        ),
                                        a: ({ node, ...props }) => (
                                            <a {...props} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline break-words" target="_blank" rel="noopener noreferrer" />
                                        ),
                                        h1: ({ node, ...props }) => (
                                            <h1 {...props} className="text-5xl font-bold text-gray-900 dark:text-white mb-6 mt-10" />
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <h2 {...props} className="text-4xl font-bold text-gray-900 dark:text-white mb-5 mt-8" />
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3 {...props} className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-6" />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p {...props} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6" />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul {...props} className="list-disc ml-6 mb-6 space-y-2" />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol {...props} className="list-decimal ml-6 mb-6 space-y-2" />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li {...props} className="text-lg text-gray-700 dark:text-gray-300" />
                                        ),
                                        code: ({ node, inline, ...props }: any) => (
                                            inline ?
                                                <code {...props} className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded text-sm font-mono" /> :
                                                <code {...props} className="block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm" />
                                        ),
                                        blockquote: ({ node, ...props }) => (
                                            <blockquote {...props} className="border-l-4 border-blue-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4" />
                                        ),
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
