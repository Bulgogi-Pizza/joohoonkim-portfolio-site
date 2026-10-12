'use client';

import React, { useEffect, useState } from 'react';
import MemberCard, { Member } from '@/components/MemberCard';

export default function AlumniPage() {
    const [alumni, setAlumni] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/members?category=alumni')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch alumni');
                return res.json();
            })
            .then(data => setAlumni(data))
            .catch(err => {
                console.error('Error fetching alumni:', err);
                setError('Failed to load alumni');
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-accent dark:border-dark-accent dark:border-t-transparent rounded-full" />
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
            <div className="container mx-auto px-gutter max-w-6xl py-10 md:py-14">
                <h1 className="mb-10 font-heading text-page-title font-bold tracking-tight text-ink dark:text-dark-ink pb-6 border-b border-line dark:border-dark-line">
                    Alumni
                </h1>

                {alumni.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {alumni.map(member => <MemberCard key={member.id} member={member} />)}
                    </div>
                ) : (
                    <p className="text-center py-12 text-ink-3 dark:text-dark-ink-3">No alumni yet.</p>
                )}
            </div>
        </div>
    );
}
