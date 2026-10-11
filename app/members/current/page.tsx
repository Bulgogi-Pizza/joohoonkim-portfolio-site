'use client';

import React, { useEffect, useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import MemberCard, { Member } from '@/components/MemberCard';

const fetchMembers = (category: Member['category']): Promise<Member[]> =>
    fetch(`/api/members?category=${category}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${category} members`);
        return res.json();
    });

export default function CurrentTeamPage() {
    const [pis, setPis] = useState<Member[]>([]);
    const [researchers, setResearchers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([fetchMembers('pi'), fetchMembers('researcher')])
            .then(([piData, researcherData]) => {
                setPis(piData);
                setResearchers(researcherData);
            })
            .catch(err => {
                console.error('Error fetching members:', err);
                setError('Failed to load members');
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
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl py-10 md:py-14">
                <h1 className="mb-10 font-heading text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-dark-ink">
                    Current Team
                </h1>

                <div className="space-y-14 md:space-y-16">
                    {pis.length > 0 && (
                        <section>
                            <SectionHeader title="Principal Investigator" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {pis.map(member => <MemberCard key={member.id} member={member} href="/members/pi" />)}
                            </div>
                        </section>
                    )}

                    {researchers.length > 0 && (
                        <section>
                            <SectionHeader title="Researchers" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {researchers.map(member => <MemberCard key={member.id} member={member} />)}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
