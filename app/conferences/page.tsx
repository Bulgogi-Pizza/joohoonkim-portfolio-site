'use client';

import React, { useEffect, useState } from 'react';
import MonoLabel from '@/components/ui/MonoLabel';
import Tag from '@/components/ui/Tag';

interface Conference {
    id: number;
    conference_name: string;
    location: string;
    date: string;
    presentation_type?: string;
    award?: string;
    order_index?: number;
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

    // 관리자가 지정한 order_index 내림차순 (클수록 위 — 새 항목은 최고 id/order라 맨 위, 미지정은 맨 뒤)
    const sortedConferences = [...filteredConferences].sort((a, b) => {
        if (a.order_index == null && b.order_index == null) return 0;
        if (a.order_index == null) return 1;
        if (b.order_index == null) return -1;
        return b.order_index - a.order_index;
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
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-accent dark:border-dark-accent dark:border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <p className="text-ink-3 dark:text-dark-ink-3">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl py-10 md:py-14">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-dark-ink pb-6 border-b border-line dark:border-dark-line">
                        Talks
                    </h1>
                    <div className="pt-4">
                        <MonoLabel>
                            Total {filteredConferences.length} talks
                        </MonoLabel>
                    </div>
                </div>

                {/* Conferences List */}
                <div className="border-t border-line dark:border-dark-line">
                    {sortedConferences.map((conference) => (
                        <article
                            key={conference.id}
                            className="group relative flex gap-4 md:gap-6 py-5 pl-4 border-b border-line dark:border-dark-line hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors"
                        >
                            <span aria-hidden className="absolute left-0 top-4 bottom-4 w-[2px] bg-ink dark:bg-dark-ink opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Date */}
                            <div className="shrink-0 w-12 pt-1 flex flex-col items-end gap-0.5 text-right">
                                {conference.year && (
                                    <span className="font-mono text-xs tracking-widest text-accent dark:text-dark-accent">
                                        {conference.year}
                                    </span>
                                )}
                                {conference.month && (
                                    <span className="font-mono text-xs uppercase tracking-widest text-ink-3 dark:text-dark-ink-3">
                                        {getMonthName(conference.month)}
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-ink dark:text-dark-ink mb-1.5 leading-snug">
                                    {conference.conference_name}
                                </h3>

                                <p className="text-sm text-ink-2 dark:text-dark-ink-2 leading-relaxed">
                                    {conference.location}
                                </p>

                                {(conference.presentation_type || conference.award) && (
                                    <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                        {conference.presentation_type && (
                                            <Tag>{conference.presentation_type}</Tag>
                                        )}
                                        {conference.award && (
                                            <MonoLabel color="accent">
                                                {conference.award}
                                            </MonoLabel>
                                        )}
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* No Results */}
                {sortedConferences.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-ink-3 dark:text-dark-ink-3">
                            No talks found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
