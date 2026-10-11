'use client';

import React, { useEffect, useState } from 'react';
import MarkdownContent from '@/components/MarkdownContent';

export default function OpeningPage() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/opening')
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                setContent(data.content);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching opening:', error);
                setError('Failed to load opening data');
                setLoading(false);
            });
    }, []);

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
                <div className="mb-10">
                    <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-dark-ink pb-6 border-b border-line dark:border-dark-line">
                        Opening
                    </h1>
                </div>

                {content.trim() ? (
                    <MarkdownContent content={content} />
                ) : (
                    <div className="text-center py-12">
                        <p className="text-ink-3 dark:text-dark-ink-3">
                            No open positions at the moment.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
