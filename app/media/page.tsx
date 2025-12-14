'use client';

import React, { useEffect, useState } from 'react';

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

    // Category styles
    const getCategoryStyle = (category: string) => {
        const styles: any = {
            'news': {
                class: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
                icon: '📰'
            },
            'interview': {
                class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                icon: '🎤'
            },
            'feature': {
                class: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                icon: '⭐'
            },
            'press-release': {
                class: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                icon: '📢'
            },
            'research-highlight': {
                class: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
                icon: '🔬'
            }
        };
        return styles[category] || {
            class: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            icon: '📄'
        };
    };

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
            <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 py-24">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading media coverage...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6 py-24">
                    <div className="text-center">
                        <p className="text-red-500">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Media & Press Coverage
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
                        Featured stories, interviews, and media coverage highlighting
                        breakthrough research and scientific achievements
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
                        <div><span className="font-semibold text-blue-600">{mediaItems.length}</span> Total Coverage</div>
                        <div><span className="font-semibold text-blue-600">{mediaItems.filter(m => m.category === 'interview').length}</span> Interviews</div>
                        <div><span className="font-semibold text-blue-600">{new Set(mediaItems.map(m => m.source)).size}</span> Media Outlets</div>
                        <div><span className="font-semibold text-blue-600">{years.length}</span> Years Active</div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="mb-8 space-y-4">
                    <div className="relative max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Search media coverage..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {/* Year Filter */}
                        <select
                            value={filters.year}
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Media Items Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {filteredMediaItems
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((item) => {
                            const categoryInfo = getCategoryStyle(item.category);

                            return (
                                <article
                                    key={item.id}
                                    className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    {/* Image Area */}
                                    <div className="aspect-video overflow-hidden relative">
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                                <div className="text-6xl">{categoryInfo.icon}</div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                                        <div className="absolute top-4 left-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${categoryInfo.class}`}>
                                                <span className="mr-1">{categoryInfo.icon}</span>
                                                {item.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                {item.source}
                                            </span>
                                            <time className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(item.date)}
                                            </time>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.title}
                                        </h3>

                                        {item.description && (
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-4">
                                                {item.description}
                                            </p>
                                        )}

                                        {/* Action Button */}
                                        <div className="flex items-center justify-between">
                                            {item.url ? (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm group/link"
                                                >
                                                    Read Article
                                                    <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm">View Details</span>
                                            )}

                                            <div className="text-2xl">
                                                {categoryInfo.icon}
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                </div>

                {/* No Results */}
                {filteredMediaItems.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📰</div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No media coverage found matching your criteria.
                        </p>
                    </div>
                )}

                {/* Featured Media Outlets */}
                <div className="mt-16">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        Featured In
                    </h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {Array.from(new Set(mediaItems.map(item => item.source)))
                                .slice(0, 12)
                                .map((source, index) => (
                                    <div key={index} className="text-center">
                                        <div className="bg-white dark:bg-gray-600 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {source}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="mt-16 text-center">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Media Coverage Summary
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {mediaItems.length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Coverage
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {mediaItems.filter(m => m.category === 'interview').length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Interviews
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                    {new Set(mediaItems.map(m => m.source)).size}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Media Outlets
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-red-600 mb-2">
                                    {mediaItems.filter(m => m.category === 'news').length}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    News Articles
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                        Showing {filteredMediaItems.length} of {mediaItems.length} media items
                    </p>
                </div>
            </div>
        </div>
    );
}
