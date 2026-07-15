import React from 'react';

interface MonoLabelProps {
    children: React.ReactNode;
    color?: 'accent' | 'muted';
    className?: string;
}

export default function MonoLabel({ children, color = 'muted', className = '' }: MonoLabelProps) {
    const colorClass = color === 'accent'
        ? 'text-accent dark:text-dark-accent'
        : 'text-ink-3 dark:text-dark-ink-3';

    return (
        <span className={`font-mono text-xs tracking-widest uppercase ${colorClass} ${className}`}>
            {children}
        </span>
    );
}
