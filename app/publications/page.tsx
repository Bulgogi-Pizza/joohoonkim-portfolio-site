'use client';

import React, { useEffect, useState } from 'react';
import ResearchHighlightsSection from './ResearchHighlightsSection';

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
    const [filters, setFilters] = useState({
        year: '',
        category: '',
        status: ''
    });
    const [availableYears, setAvailableYears] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filtered data load (simulated on client for now as API returns all)
    // In a real scenario with backend filtering, we would fetch again.
    // But since we are using mock data, we can filter on client or assume API handles it.
    // For now, let's filter on client side to match the mock API behavior which returns all.

    const filteredPublications = publications.filter(pub => {
        const matchesYear = !filters.year || pub.year === filters.year;
        const matchesSearch = !searchTerm ||
            pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesYear && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-8 py-24">
                    <div className="text-center">
                        <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-40 py-10 sm:py-12 max-w-[1600px]">
                {/* Header */}
                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Publications
                    </h1>
                </div>

                {/* Research Highlights */}
                <ResearchHighlightsSection />

                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Full list of publications
                    </h2>
                </div>

                {/* Year Filter */}
                <div className="mb-6 sm:mb-8 -mx-2">
                    <div className="flex gap-2 px-2 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setFilters({ ...filters, year: '' })}
                            className={`px-3 py-2 text-sm rounded-md whitespace-nowrap transition ${filters.year === ''
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >ALL
                        </button>
                        {availableYears.map(year => (
                            <button
                                key={year}
                                onClick={() => setFilters({ ...filters, year: year.toString() })}
                                className={`px-3 py-2 text-sm rounded-md whitespace-nowrap transition ${filters.year === year.toString()
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >{year}</button>
                        ))}
                    </div>
                </div>

                {/* Total Count */}
                <div className="mb-6">
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                        Total {filteredPublications.length} publications
                    </p>
                </div>

                {/* Publications List */}
                {availableYears.filter(y => filteredPublications.some(p => p.year === y)).map(year => (
                    <div key={year} className="mb-10 sm:mb-16">
                        <div className="mb-2">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{year}</h2>
                            <div className="w-full h-px bg-gray-300 dark:bg-gray-600" />
                        </div>

                        <div className="space-y-2">
                            {filteredPublications.filter(p => p.year === year).map((pub) => (
                                <article
                                    key={pub.id}
                                    className="flex gap-4 sm:gap-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 py-4 px-2 sm:px-0 relative"
                                >
                                    {/* Numbering */}
                                    <div className="w-10 sm:w-16 text-center pr-3 sm:pr-4 border-r border-gray-300 dark:border-gray-600 flex-shrink-0 flex items-start justify-center pt-1.5">
                                        <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">{pub.number}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 leading-snug safe-wrap">
                                            {pub.title}
                                        </h3>

                                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2 leading-relaxed safe-wrap">
                                            {pub.authors}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                                            <span className="font-medium italic text-blue-600 dark:text-blue-400">{pub.journal}</span>
                                            {pub.volume && <span className="font-semibold">• {pub.volume}</span>}
                                            {pub.pages && <span>• {pub.pages}</span>}
                                            <span>• {pub.year}</span>
                                        </div>

                                        {pub.featured_info && (
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{pub.featured_info}</p>
                                        )}

                                        {/* Link */}
                                        {(pub.doi || pub.arxiv) && (
                                            <div className="mt-3 sm:mt-0 sm:absolute sm:bottom-4 sm:right-4">
                                                <a
                                                    href={pub.doi ? `https://doi.org/${pub.doi}` : pub.arxiv}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center px-3 py-1 text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors whitespace-nowrap"
                                                >
                                                    🔗 LINK
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}

                {filteredPublications.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No publications found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
