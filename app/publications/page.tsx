'use client';

import React, { useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import ResearchHighlightsSection from './ResearchHighlightsSection';
import SectionHeader from '@/components/ui/SectionHeader';

interface Publication {
    id: number;
    number: number;
    title: string;
    authors: string;
    journal: string;
    volume?: string;
    pages?: string;
    year: string;
    status?: string;
    featured_info?: string;
    doi?: string;
    arxiv?: string;
}

export default function PublicationsPage() {
    const [publications, setPublications] = useState<Publication[]>([]);
    const [loading, setLoading] = useState(true);
    const [yearFilter, setYearFilter] = useState('');
    const [availableYears, setAvailableYears] = useState<string[]>([]);

    useEffect(() => {
        Promise.all([
            fetch('/api/publications'),
            fetch('/api/publications/years'),
        ])
            .then(([pubRes, yearsRes]) =>
                Promise.all([pubRes.json(), yearsRes.json()])
            )
            .then(([pubData, yearsData]) => {
                setPublications(pubData);
                setAvailableYears(yearsData.years);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching ', error);
                setLoading(false);
            });
    }, []);

    const filteredPublications = publications.filter(pub =>
        !yearFilter || pub.year === yearFilter
    );

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-accent dark:border-dark-accent dark:border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl py-10 md:py-14">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-dark-ink pb-6 border-b border-line dark:border-dark-line">
                        Publications
                    </h1>
                </div>

                {/* Research Highlights */}
                <ResearchHighlightsSection />

                <SectionHeader title="Full List" />

                {/* Year Filter */}
                <div className="mb-10 -mx-6 px-6 lg:mx-0 lg:px-0">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        <button
                            onClick={() => setYearFilter('')}
                            className={`shrink-0 px-3.5 py-1.5 rounded-[3px] border font-mono text-xs uppercase tracking-wider transition-colors ${yearFilter === ''
                                ? 'bg-ink border-ink text-white dark:bg-dark-ink dark:border-dark-ink dark:text-dark-bg font-semibold'
                                : 'border-line dark:border-dark-line text-ink-2 dark:text-dark-ink-2 hover:border-ink dark:hover:border-white/40'
                                }`}
                        >
                            All
                        </button>
                        {availableYears.map(year => (
                            <button
                                key={year}
                                onClick={() => setYearFilter(year.toString())}
                                className={`shrink-0 px-3.5 py-1.5 rounded-[3px] border font-mono text-xs uppercase tracking-wider transition-colors ${yearFilter === year.toString()
                                    ? 'bg-ink border-ink text-white dark:bg-dark-ink dark:border-dark-ink dark:text-dark-bg font-semibold'
                                    : 'border-line dark:border-dark-line text-ink-2 dark:text-dark-ink-2 hover:border-ink dark:hover:border-white/40'
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Publications List by Year */}
                {availableYears.filter(y => filteredPublications.some(p => p.year === y)).map(year => (
                    <div key={year} className="mb-12">
                        <h2 className="font-heading text-2xl font-bold tracking-tight text-ink dark:text-dark-ink mb-3">
                            {year}
                        </h2>

                        <div className="border-t border-line dark:border-dark-line">
                            {filteredPublications.filter(p => p.year === year).map((pub) => (
                                <article
                                    key={pub.id}
                                    className="group relative flex gap-4 md:gap-6 py-5 pl-4 border-b border-line dark:border-dark-line hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors"
                                >
                                    <span aria-hidden className="absolute left-0 top-4 bottom-4 w-[2px] bg-ink dark:bg-dark-ink opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {/* Numbering */}
                                    <span className="font-mono text-xs text-accent dark:text-dark-accent shrink-0 w-8 pt-1 text-right">
                                        {pub.number}
                                    </span>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-ink dark:text-dark-ink mb-1.5 leading-snug">
                                            {pub.title}
                                        </h3>

                                        <p className="text-sm text-ink-3 dark:text-dark-ink-3 mb-1.5 leading-relaxed">
                                            {pub.authors}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-y-1 text-sm text-ink-2 dark:text-dark-ink-2">
                                            <span className="italic font-medium">{pub.journal}</span>
                                            {pub.volume && <span className="font-semibold">&nbsp;{pub.volume}</span>}
                                            {pub.pages && <span>, {pub.pages}</span>}
                                        </div>

                                        {pub.featured_info && (
                                            <p className="mt-1.5 text-xs text-ink-3 dark:text-dark-ink-3">
                                                {pub.featured_info}
                                            </p>
                                        )}
                                    </div>

                                    {/* Link */}
                                    {(pub.doi || pub.arxiv) && (
                                        <div className="shrink-0 self-center">
                                            <a
                                                href={pub.doi ? `https://doi.org/${pub.doi}` : pub.arxiv}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 inline-flex text-ink-3 dark:text-dark-ink-3 hover:text-accent dark:hover:text-dark-accent transition-colors"
                                                title={pub.doi ? 'DOI' : 'arXiv'}
                                            >
                                                <FiExternalLink size={17} />
                                            </a>
                                        </div>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredPublications.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-ink-3 dark:text-dark-ink-3">No publications found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
