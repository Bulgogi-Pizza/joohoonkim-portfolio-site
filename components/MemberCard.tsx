import React from 'react';
import Link from 'next/link';
import { FiMail, FiUser } from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageUtils';

export type MemberCategory = 'pi' | 'researcher' | 'alumni';

export interface Member {
    id: number;
    category: MemberCategory;
    name: string;
    email: string | null;
    position: string | null;
    research_interest: string | null;
    education: string[];
    image_path: string | null;
    order_index: number | null;
    created_at: string;
    updated_at: string;
}

const interactiveClass = 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elev-hover hover:border-ink/50 dark:hover:border-white/30';

export default function MemberCard({ member, href }: { member: Member; href?: string }) {
    return (
        <article className={`relative flex gap-4 sm:gap-6 p-4 sm:p-5 bg-card dark:bg-dark-card border border-line dark:border-dark-line rounded shadow-elev dark:shadow-none ${href ? interactiveClass : ''}`}>
            {/* 카드 안의 mailto 링크와 중첩되지 않도록 카드 전체를 덮는 링크로 처리한다 */}
            {href && (
                <Link
                    href={href}
                    aria-label={member.name}
                    className="absolute inset-0 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
            )}
            <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded overflow-hidden border border-line dark:border-dark-line">
                {member.image_path ? (
                    <img src={getImageUrl(member.image_path)} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-line/40 dark:bg-white/[.04] text-ink-3 dark:text-dark-ink-3">
                        <FiUser className="w-10 h-10" aria-hidden />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <h3 className="font-heading text-lg font-bold text-ink dark:text-dark-ink leading-snug">
                    {member.name}
                </h3>

                {member.email && (
                    <a
                        href={`mailto:${member.email}`}
                        className="relative z-10 mt-1 inline-flex items-center gap-1.5 text-sm text-ink-2 dark:text-dark-ink-2 hover:text-accent dark:hover:text-dark-accent transition-colors break-all"
                    >
                        <FiMail className="w-3.5 h-3.5 shrink-0" aria-hidden />
                        {member.email}
                    </a>
                )}

                <div className="mt-3 pt-3 border-t border-line dark:border-dark-line">
                    {member.position && (
                        <p className="text-sm text-ink dark:text-dark-ink whitespace-pre-line leading-relaxed">
                            {member.position}
                        </p>
                    )}

                    {member.category === 'researcher' && member.research_interest && (
                        <p className="mt-1 text-sm text-ink dark:text-dark-ink leading-relaxed">
                            Research Interest: {member.research_interest}
                        </p>
                    )}

                    {member.education.length > 0 && (
                        <ul className="mt-2 pl-4 space-y-0.5">
                            {member.education.map((line, idx) => (
                                <li key={idx} className="text-sm text-ink-3 dark:text-dark-ink-3 leading-relaxed">
                                    {line}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </article>
    );
}
