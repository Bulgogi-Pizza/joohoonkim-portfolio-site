'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResearchIndex() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/research-areas')
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    router.replace(`/research/${data[0].slug}`);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-accent dark:border-dark-accent dark:border-t-transparent rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center">
            <p className="text-ink-2 dark:text-dark-ink-2">No research areas found.</p>
        </div>
    );
}
