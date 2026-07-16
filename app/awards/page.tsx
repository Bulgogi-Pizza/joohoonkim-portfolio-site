'use client';

import React, { useEffect, useState } from 'react';
import MonoLabel from '@/components/ui/MonoLabel';

interface Award {
    id: number;
    title: string;
    organization: string;
    details?: string;
    year: string;
    location?: string;
    description?: string;
    order_index?: number;
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

    // 관리자가 지정한 order_index 내림차순 (클수록 위 — 새 항목은 최고 id/order라 맨 위, 미지정은 맨 뒤)
    const sortedAwards = [...filteredAwards].sort((a, b) => {
        if (a.order_index == null && b.order_index == null) return 0;
        if (a.order_index == null) return 1;
        if (b.order_index == null) return -1;
        return b.order_index - a.order_index;
    });

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
                        Awards
                    </h1>
                    <div className="pt-4">
                        <MonoLabel>
                            Total {filteredAwards.length} awards
                        </MonoLabel>
                    </div>
                </div>

                {/* Awards List */}
                <div className="border-t border-line dark:border-dark-line">
                    {sortedAwards.map((award) => (
                        <article
                            key={award.id}
                            className="group relative flex gap-4 md:gap-6 py-5 pl-4 border-b border-line dark:border-dark-line hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors"
                        >
                            <span aria-hidden className="absolute left-0 top-4 bottom-4 w-[2px] bg-ink dark:bg-dark-ink opacity-0 group-hover:opacity-100 transition-opacity" />

                            {/* Year */}
                            <span className="font-mono text-xs uppercase tracking-widest text-accent dark:text-dark-accent shrink-0 w-10 pt-1 text-right">
                                {award.year}
                            </span>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-base font-semibold text-ink dark:text-dark-ink mb-1.5 leading-snug">
                                    {award.title}
                                </h3>

                                <p className="text-sm text-ink-2 dark:text-dark-ink-2 leading-relaxed">
                                    {award.organization}
                                    {award.location && `, ${award.location}`}
                                </p>

                                {award.description && (
                                    <p className="mt-1.5 text-sm text-ink-3 dark:text-dark-ink-3 leading-relaxed">
                                        {award.description}
                                    </p>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* No Results */}
                {sortedAwards.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-ink-3 dark:text-dark-ink-3">
                            No awards found matching your criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
