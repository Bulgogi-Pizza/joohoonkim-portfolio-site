import React from 'react';

interface TagProps {
    children: React.ReactNode;
    active?: boolean;
    className?: string;
}

export default function Tag({ children, active = false, className = '' }: TagProps) {
    const stateClass = active
        ? 'bg-ink border-ink text-white dark:bg-dark-ink dark:border-dark-ink dark:text-dark-bg font-semibold'
        : 'border-line dark:border-dark-line text-ink-2 dark:text-dark-ink-2 hover:border-ink dark:hover:border-white/40';

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-[3px] border font-mono text-xs uppercase tracking-wider transition-colors ${stateClass} ${className}`}>
            {children}
        </span>
    );
}
