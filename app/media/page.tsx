'use client';

import React, { useEffect, useState } from 'react';
import { FiArrowUpRight, FiSearch } from 'react-icons/fi';
import SectionHeader from '@/components/ui/SectionHeader';
import MonoLabel from '@/components/ui/MonoLabel';
import Tag from '@/components/ui/Tag';

interface MediaItem {
    id: number;
    title: string;
    source: string;
    date: string;
    url?: string;
    image_url?: string;
    description?: string;
    category: string;
}

export default function MediaPage() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        year: '',
        category: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('/api/media')
            .then(res => res.json())
            .then(data => {
                setMediaItems(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching media:', error);
                setError('Failed to load media data');
                setLoading(false);
            });
    }, []);

    // Group by year
    const mediaByYear = mediaItems.reduce((acc: any, item) => {
        const year = item.date.split('-')[0];
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(item);
        return acc;
    }, {});

    const years = Object.keys(mediaByYear).sort((a, b) => parseInt(b) - parseInt(a));

    // Filtered data
    const filteredMediaItems = mediaItems.filter(item => {
        const itemYear = item.date.split('-')[0];
        const matchesYear = !filters.year || itemYear === filters.year;
        const matchesCategory = !filters.category || item.category === filters.category;
        const matchesSearch = !searchTerm ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesYear && matchesCategory && matchesSearch;
    });

    // Date formatting
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                <p className="text-ink-2 dark:text-dark-ink-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl py-10 md:py-14">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-dark-ink pb-6 border-b border-line dark:border-dark-line">
                        Media &amp; Press Coverage
                    </h1>
                    <p className="mt-6 text-base text-ink-2 dark:text-dark-ink-2 leading-relaxed max-w-2xl">
                        Featured stories, interviews, and media coverage highlighting
                        breakthrough research and scientific achievements
                    </p>
                </div>

                {/* Search & Filter */}
                <div className="mb-10 flex flex-wrap items-center gap-3">
                    <div className="relative w-full sm:w-72">
                        <FiSearch
                            aria-hidden
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 dark:text-dark-ink-3 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search media coverage..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-[3px] border border-line dark:border-dark-line bg-card dark:bg-dark-card text-sm text-ink dark:text-dark-ink placeholder:text-ink-3 dark:placeholder:text-dark-ink-3 focus:outline-none focus:border-ink/60 dark:focus:border-white/40 transition-colors"
                        />
                    </div>

                    {/* Year Filter */}
                    <select
                        value={filters.year}
                        onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                        className="px-3 py-2 rounded-[3px] border border-line dark:border-dark-line bg-card dark:bg-dark-card font-mono text-xs uppercase tracking-wider text-ink-2 dark:text-dark-ink-2 focus:outline-none focus:border-ink/60 dark:focus:border-white/40 transition-colors"
                    >
                        <option value="">All Years</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    {/* Category Filter */}
                    <select
                        value={filters.category}
                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                        className="px-3 py-2 rounded-[3px] border border-line dark:border-dark-line bg-card dark:bg-dark-card font-mono text-xs uppercase tracking-wider text-ink-2 dark:text-dark-ink-2 focus:outline-none focus:border-ink/60 dark:focus:border-white/40 transition-colors"
                    >
                        <option value="">All Categories</option>
                        <option value="news">News</option>
                        <option value="interview">Interview</option>
                        <option value="feature">Feature Story</option>
                        <option value="press-release">Press Release</option>
                        <option value="research-highlight">Research Highlight</option>
                    </select>

                    {/* Reset Button */}
                    <button
                        onClick={() => {
                            setFilters({ year: '', category: '' });
                            setSearchTerm('');
                        }}
                        className="px-3.5 py-2 rounded-[3px] border border-line dark:border-dark-line font-mono text-xs uppercase tracking-wider text-ink-2 dark:text-dark-ink-2 hover:border-ink dark:hover:border-white/40 transition-colors"
                    >
                        Reset
                    </button>
                </div>

                <SectionHeader title="Coverage" />

                {/* Media Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredMediaItems
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((item) => (
                            <article
                                key={item.id}
                                className="group flex flex-col bg-card dark:bg-dark-card border border-line dark:border-dark-line rounded overflow-hidden shadow-elev dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elev-hover hover:border-ink/50 dark:hover:border-white/30"
                            >
                                {/* Framed Image */}
                                {item.image_url && (
                                    <div className="p-2.5 pb-0">
                                        <div className="aspect-video rounded-[3px] overflow-hidden bg-line/40 dark:bg-white/[.05] border border-line/70 dark:border-dark-line">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-[1.04]"
                                                loading="lazy"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Content Area */}
                                <div className="flex-1 flex flex-col px-3.5 pt-3.5 pb-4">
                                    <div className="flex items-baseline justify-between gap-3 mb-2">
                                        <MonoLabel color="accent" className="truncate">
                                            {item.source}
                                        </MonoLabel>
                                        <time className="shrink-0 font-mono text-xs tracking-wider text-ink-3 dark:text-dark-ink-3">
                                            {formatDate(item.date)}
                                        </time>
                                    </div>

                                    <h3 className="font-heading text-base font-bold text-ink dark:text-dark-ink leading-snug mb-2 line-clamp-2">
                                        {item.title}
                                    </h3>

                                    {item.description && (
                                        <p className="text-sm text-ink-2 dark:text-dark-ink-2 leading-relaxed line-clamp-3 mb-4">
                                            {item.description}
                                        </p>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-auto pt-3 border-t border-line dark:border-dark-line flex items-center justify-between gap-3">
                                        <Tag>{item.category.replace('-', ' ')}</Tag>

                                        {item.url ? (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-accent dark:text-dark-accent hover:text-ink dark:hover:text-dark-ink transition-colors"
                                            >
                                                Read Article
                                                <FiArrowUpRight aria-hidden size={14} />
                                            </a>
                                        ) : (
                                            <span className="font-mono text-xs uppercase tracking-widest text-ink-3 dark:text-dark-ink-3">
                                                View Details
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                </div>

                {/* No Results */}
                {filteredMediaItems.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-ink-3 dark:text-dark-ink-3">
                            No media coverage found matching your criteria.
                        </p>
                    </div>
                )}

                {/* Featured Media Outlets */}
                <div className="mt-16">
                    <SectionHeader title="Featured In" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-line dark:border-dark-line">
                        {Array.from(new Set(mediaItems.map(item => item.source)))
                            .slice(0, 12)
                            .map((source, index) => (
                                <div
                                    key={index}
                                    className="border-b border-r border-line dark:border-dark-line px-4 py-5 flex items-center justify-center text-center hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors"
                                >
                                    <span className="font-mono text-xs uppercase tracking-wider text-ink-2 dark:text-dark-ink-2">
                                        {source}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
