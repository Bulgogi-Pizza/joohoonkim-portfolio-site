import React from 'react';
import Link from 'next/link';

interface CardProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    topBar?: boolean;
    className?: string;
}

const baseClass = 'block bg-card dark:bg-dark-card border border-line dark:border-dark-line rounded shadow-elev dark:shadow-none';
const interactiveClass = 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elev-hover hover:border-ink/50 dark:hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent';

export default function Card({ children, href, onClick, topBar = false, className = '' }: CardProps) {
    const topBarClass = topBar ? 'border-t-2 border-t-ink dark:border-t-dark-ink' : '';
    const classes = `${baseClass} ${topBarClass} ${href || onClick ? interactiveClass : ''} ${className}`;

    if (href) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }
    if (onClick) {
        return (
            <button onClick={onClick} className={`text-left w-full ${classes}`}>
                {children}
            </button>
        );
    }
    return <div className={classes}>{children}</div>;
}
