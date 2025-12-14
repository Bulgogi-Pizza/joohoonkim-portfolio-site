'use client';

import React, { useEffect, useState } from 'react';

interface Award {
    id: number;
    title: string;
    organization: string;
    details?: string;
    year: string;
    location?: string;
    description?: string;
}

export default function AwardsPage() {
    const [awards, setAwards] = useState<Award[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterYear, setFilterYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/awards')
            .then(res => res.json())
            .then(data => {
                setAwards(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching awards:', error);
                setError('Failed to load awards data');
                setLoading(false);
            });
    }, []);

    // Filtered data
    const filteredAwards = awards.filter(award => {
        const matchesYear = !filterYear || award.year === filterYear;
        const matchesSearch = !searchTerm ||
            award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            award.organization.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesYear && matchesSearch;
    });

    // Sort by year (descending)
    const sortedAwards = [...filteredAwards].sort((a, b) => {
        if (b.year !== a.year) {
            return parseInt(b.year) - parseInt(a.year);
        }
        return b.id - a.id;
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

    if (error) {
        return (
            <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-8 py-24">
                    <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-40 py-10 sm:py-12 max-w-[1600px]">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">Awards</h1>
                </div>

                {/* Total Count */}
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Total {filteredAwards.length} awards
                    </p>
                </div>

                {/* Awards List */}
                <div className="space-y-1">
                    {sortedAwards.map((award, index) => (
                        <article
                            key={award.id}
                            className="flex gap-3 sm:gap-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 py-4 px-2"
                        >
                            <div className="w-8 sm:w-10 flex-shrink-0 flex items-start justify-center pt-1.5">
                                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 leading-snug">{award.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {award.organization}
                                        {award.location && `, ${award.location}`}
                                    </p>

                                    {award.year && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="font-semibold text-blue-600 dark:text-blue-400">
                                                {award.year}
                                            </span>
                                        </>
                                    )}

                                    {award.description && (
                                        <div className="text-gray-600 dark:text-gray-400">
                                            <p className="leading-relaxed text-sm">
                                                {award.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* No Results */}
                {sortedAwards.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No awards found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
