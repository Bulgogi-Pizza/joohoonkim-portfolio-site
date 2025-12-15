'use client';

import React, { useEffect, useState } from 'react';

interface Conference {
    id: number;
    conference_name: string;
    location: string;
    date: string;
    presentation_type?: string;
    award?: string;
    year?: number;
    month?: number;
}

export default function ConferencesPage() {
    const [conferences, setConferences] = useState<Conference[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterYear, setFilterYear] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/conferences')
            .then(res => res.json())
            .then(data => {
                // Date processing
                const processedData = data.map((conference: any) => {
                    const dateStr = conference.date;
                    if (typeof dateStr === 'string' && dateStr.length >= 7) {
                        const [year, month] = dateStr.split('-');
                        return {
                            ...conference,
                            year: parseInt(year),
                            month: parseInt(month)
                        };
                    } else {
                        return {
                            ...conference,
                            year: null,
                            month: null
                        };
                    }
                });

                setConferences(processedData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching conferences:', error);
                setError('Failed to load conferences data');
                setLoading(false);
            });
    }, []);

    // Filtered data
    const filteredConferences = conferences.filter(conference => {
        const matchesYear = !filterYear || conference.year === parseInt(filterYear);
        const matchesSearch = !searchTerm ||
            conference.conference_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conference.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesYear && matchesSearch;
    });

    // Sort by year (descending)
    const sortedConferences = [...filteredConferences].sort((a, b) => {
        if (b.year !== a.year) {
            return (b.year || 0) - (a.year || 0);
        }
        if (b.month !== a.month) {
            return (b.month || 0) - (a.month || 0);
        }
        return b.id - a.id;
    });

    // Month name helper
    const getMonthName = (monthNum?: number) => {
        if (!monthNum) {
            return '';
        }
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthNum - 1] || '';
    };

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
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">Conferences</h1>
                </div>

                {/* Total Count */}
                <div className="mb-6">
                    <p className="text-gray-600 dark:text-gray-400">
                        Total {filteredConferences.length} conferences
                    </p>
                </div>

                {/* Conferences List */}
                <div className="space-y-1">
                    {sortedConferences.map((conference, index) => (
                        <article
                            key={conference.id}
                            className="flex gap-3 sm:gap-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 py-4 px-2"
                        >
                            <div className="w-8 sm:w-10 flex-shrink-0 flex items-start justify-center pt-1.5">
                                <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1 leading-snug safe-wrap">
                                    {conference.conference_name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">

                                    {/* Location */}
                                    <span>{conference.location}</span>

                                    {/* Month */}
                                    {conference.month && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span>{getMonthName(conference.month)}</span>
                                        </>
                                    )}

                                    {/* Year */}
                                    {conference.year && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">
                                                {conference.year}
                                            </span>
                                        </>
                                    )}

                                    {/* Presentation Type */}
                                    {conference.presentation_type && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium uppercase tracking-wide">
                                                {conference.presentation_type}
                                            </span>
                                        </>
                                    )}

                                    {/* Award */}
                                    {conference.award && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs font-medium">
                                                {conference.award}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* No Results */}
                {sortedConferences.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No conferences found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
