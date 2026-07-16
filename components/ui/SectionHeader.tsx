import React from 'react';

interface SectionHeaderProps {
    title: string;
    action?: React.ReactNode;
    inverted?: boolean;
    className?: string;
}

// 2px 잉크 룰 + 볼드 타이틀 — 에디토리얼 테이블 헤더 스타일.
// inverted: 어두운 배경 섹션 위에서 사용.
export default function SectionHeader({ title, action, inverted = false, className = '' }: SectionHeaderProps) {
    const ruleClass = inverted ? 'border-white' : 'border-ink dark:border-dark-ink';
    const titleClass = inverted ? 'text-white' : 'text-ink dark:text-dark-ink';

    return (
        <div className={`border-t-2 ${ruleClass} pt-4 mb-10 flex items-baseline justify-between gap-4 ${className}`}>
            <h2 className={`font-heading text-2xl md:text-3xl font-bold tracking-tight ${titleClass} truncate`}>
                {title}
            </h2>
            {action}
        </div>
    );
}
