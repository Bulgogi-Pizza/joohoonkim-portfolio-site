import React from 'react';

interface SectionHeaderProps {
    title: string;
    count?: string;
    action?: React.ReactNode;
    inverted?: boolean;
    className?: string;
}

// 2px 잉크 룰 + 볼드 타이틀 + 우측 모노 카운트 — 에디토리얼 테이블 헤더 스타일.
// inverted: 어두운 배경 섹션 위에서 사용.
export default function SectionHeader({ title, count, action, inverted = false, className = '' }: SectionHeaderProps) {
    const ruleClass = inverted ? 'border-white' : 'border-ink dark:border-dark-ink';
    const titleClass = inverted ? 'text-white' : 'text-ink dark:text-dark-ink';
    const countClass = inverted ? 'text-white/50' : 'text-ink-3 dark:text-dark-ink-3';

    return (
        <div className={`border-t-2 ${ruleClass} pt-4 mb-10 flex items-baseline justify-between gap-4 ${className}`}>
            <div className="flex items-baseline gap-4 min-w-0">
                <h2 className={`font-heading text-2xl md:text-3xl font-bold tracking-tight ${titleClass} truncate`}>
                    {title}
                </h2>
                {count && (
                    <span className={`shrink-0 font-mono text-xs tracking-widest uppercase ${countClass}`}>
                        {count}
                    </span>
                )}
            </div>
            {action}
        </div>
    );
}
