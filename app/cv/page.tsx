'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import MonoLabel from '@/components/ui/MonoLabel';

interface ContactInfo {
    id: number;
    label: string;
    value: string;
    data_type: string;
    order_index: number;
}

interface CVProfile {
    id: number;
    name: string;
    title: string | null;
    bio: string | null;
    profile_image: string | null;
    contact_info: ContactInfo[];
}

interface Education {
    id: number;
    degree: string;
    institution: string;
    location: string;
    start_year: string;
    end_year: string;
    advisor: string | null;
    description: string | null;
}

interface Experience {
    id: number;
    position: string;
    organization: string;
    location: string;
    start_year: string;
    end_year: string;
    description: string | null;
    host_advisor: string | null;
}

interface Award {
    id: number;
    title: string;
    organization: string;
    location: string;
    year: string;
    rank: string | null;
    description: string | null;
    cv_order: number | null;
}

interface Publication {
    id: number;
    number: number;
    title: string;
    journal: string;
    volume: string | null;
    pages: string | null;
    year: string;
    status: string;
    impact_factor: number | null;
}

interface CVService {
    id: number;
    title: string;
    description: string;
    order_index: number;
}

const ProfileSection = ({ profile }: { profile: CVProfile }) => {
    const email = profile.contact_info.find(c => c.data_type === 'email');
    const phone = profile.contact_info.find(c => c.data_type === 'phone');
    const office = profile.contact_info.find(c => c.label.toLowerCase() === 'office');
    const links = profile.contact_info.filter(c => c.data_type === 'link');

    return (
        <header className="mb-12 md:mb-16 pb-10 md:pb-12 border-b border-line dark:border-dark-line">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                <div className="flex-shrink-0 w-40 h-52 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-[280px] lg:h-[364px] rounded overflow-hidden border border-line dark:border-dark-line shadow-elev dark:shadow-none">
                    <img src="/assets/images/JoohoonKim.jpg" alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <MonoLabel color="accent">Curriculum Vitae</MonoLabel>
                    <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-dark-ink mt-3">
                        {profile.name}
                    </h1>
                    {profile.title && (
                        <p className="mt-2 text-base md:text-lg font-medium text-ink-2 dark:text-dark-ink-2">
                            {profile.title}
                        </p>
                    )}
                    <dl className="mt-6 space-y-2.5">
                        {email && (
                            <div className="flex items-baseline gap-4">
                                <dt className="w-16 shrink-0"><MonoLabel>Email</MonoLabel></dt>
                                <dd className="text-sm md:text-base text-ink dark:text-dark-ink break-all">{email.value}</dd>
                            </div>
                        )}
                        {phone && (
                            <div className="flex items-baseline gap-4">
                                <dt className="w-16 shrink-0"><MonoLabel>Phone</MonoLabel></dt>
                                <dd className="text-sm md:text-base text-ink dark:text-dark-ink">{phone.value}</dd>
                            </div>
                        )}
                        {office && (
                            <div className="flex items-baseline gap-4">
                                <dt className="w-16 shrink-0"><MonoLabel>Office</MonoLabel></dt>
                                <dd className="text-sm md:text-base text-ink dark:text-dark-ink">{office.value}</dd>
                            </div>
                        )}
                    </dl>
                    {links.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {links.map(link => (
                                <a
                                    key={link.id}
                                    href={link.value}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-3 py-1 rounded-[3px] border border-line dark:border-dark-line font-mono text-xs uppercase tracking-wider text-ink-2 dark:text-dark-ink-2 hover:border-ink dark:hover:border-white/40 hover:text-ink dark:hover:text-dark-ink transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

const CVSection = ({ title, link = null, children }: { title: string; link?: string | null; children: React.ReactNode }) => (
    <section>
        <SectionHeader
            title={title}
            action={link ? (
                <Link
                    href={link}
                    className="shrink-0 font-mono text-xs uppercase tracking-widest text-ink-3 dark:text-dark-ink-3 hover:text-accent dark:hover:text-dark-accent transition-colors"
                    aria-label="View all"
                >
                    View all
                </Link>
            ) : undefined}
        />
        {children}
    </section>
);

const rowClass = 'group relative flex flex-col sm:flex-row gap-1.5 sm:gap-6 py-5 pl-4 border-b border-line dark:border-dark-line hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors';

const HoverBar = () => (
    <span aria-hidden className="absolute left-0 top-4 bottom-4 w-[2px] bg-ink dark:bg-dark-ink opacity-0 group-hover:opacity-100 transition-opacity" />
);

export default function CVPage() {
    const [profile, setProfile] = useState<CVProfile | null>(null);
    const [education, setEducation] = useState<Education[]>([]);
    const [experience, setExperience] = useState<Experience[]>([]);
    const [awards, setAwards] = useState<Award[]>([]);
    const [publications, setPublications] = useState<Publication[]>([]);
    const [services, setServices] = useState<CVService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch('/api/cv/profile').then(r => r.ok ? r.json() : null),
            fetch('/api/education?show_in_cv=true').then(r => r.json()),
            fetch('/api/experience?show_in_cv=true').then(r => r.json()),
            fetch('/api/awards?show_in_cv=true').then(r => r.json()),
            fetch('/api/publications?show_in_cv=true').then(r => r.json()),
            fetch('/api/cv-services').then(r => r.json()),
        ])
            .then(([profileData, eduData, expData, awardData, pubData, serviceData]) => {
                setProfile(profileData);
                setEducation(eduData || []);
                setExperience(expData || []);
                // API는 cv_order 오름차순으로 주지만 CV에는 최신(큰 cv_order)이 위로 오도록 뒤집는다 (빈 값은 맨 뒤 유지)
                setAwards([...(awardData || [])].sort((a: Award, b: Award) => {
                    if (a.cv_order == null && b.cv_order == null) return 0;
                    if (a.cv_order == null) return 1;
                    if (b.cv_order == null) return -1;
                    return b.cv_order - a.cv_order;
                }));
                setPublications(pubData || []);
                setServices(serviceData || []);
            })
            .catch(err => console.error('Failed to load CV data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-accent dark:border-dark-accent dark:border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-6 lg:px-12 max-w-6xl py-10 md:py-14">
                {profile && <ProfileSection profile={profile} />}

                <main className="space-y-14 md:space-y-16">
                    <CVSection title="Education">
                        <div className="border-t border-line dark:border-dark-line">
                            {education.map(edu => (
                                <div key={edu.id} className={rowClass}>
                                    <HoverBar />
                                    <span className="shrink-0 sm:w-28 sm:pt-1 font-mono text-xs uppercase tracking-widest text-accent dark:text-dark-accent">
                                        {edu.start_year} – {edu.end_year}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-ink dark:text-dark-ink leading-snug">
                                            {edu.degree}
                                        </h3>
                                        <p className="mt-1 text-sm text-ink-2 dark:text-dark-ink-2">
                                            {edu.institution}, {edu.location}
                                        </p>
                                        {edu.advisor && (
                                            <p className="mt-1 text-sm text-ink-3 dark:text-dark-ink-3">
                                                Advisor: {edu.advisor}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CVSection>

                    <CVSection title="Professional Experience">
                        <div className="border-t border-line dark:border-dark-line">
                            {experience.map(exp => (
                                <div key={exp.id} className={rowClass}>
                                    <HoverBar />
                                    <span className="shrink-0 sm:w-28 sm:pt-1 font-mono text-xs uppercase tracking-widest text-accent dark:text-dark-accent">
                                        {exp.start_year}{exp.end_year !== exp.start_year ? ` – ${exp.end_year}` : ''}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-ink dark:text-dark-ink leading-snug">
                                            {exp.position}
                                        </h3>
                                        <p className="mt-1 text-sm text-ink-2 dark:text-dark-ink-2">
                                            {exp.organization}, {exp.location}
                                        </p>
                                        {exp.description && (
                                            <p className="mt-1 text-sm text-ink-3 dark:text-dark-ink-3">
                                                {exp.description}
                                            </p>
                                        )}
                                        {exp.host_advisor && (
                                            <p className="mt-1 text-sm text-ink-3 dark:text-dark-ink-3">
                                                Host: {exp.host_advisor}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CVSection>

                    <CVSection title="Selective Honors and Awards" link="/awards">
                        <div className="border-t border-line dark:border-dark-line">
                            {awards.map(award => (
                                <div key={award.id} className={rowClass}>
                                    <HoverBar />
                                    <span className="shrink-0 sm:w-28 sm:pt-1 font-mono text-xs uppercase tracking-widest text-accent dark:text-dark-accent">
                                        {award.year}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-ink dark:text-dark-ink leading-snug">
                                            {award.title}
                                        </h3>
                                        {(award.rank || award.organization) && (
                                            <p className="mt-1 text-sm text-ink-2 dark:text-dark-ink-2">
                                                {award.rank || award.organization}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CVSection>

                    <CVSection title="Selected Publications" link="/publications">
                        <div className="border-t border-line dark:border-dark-line">
                            {publications.map(pub => (
                                <article key={pub.id} className="group relative flex gap-4 md:gap-6 py-5 pl-4 border-b border-line dark:border-dark-line hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors">
                                    <HoverBar />
                                    <span className="font-mono text-xs text-accent dark:text-dark-accent shrink-0 w-8 pt-1 text-right">
                                        {pub.number}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-semibold text-ink dark:text-dark-ink mb-1.5 leading-snug">
                                            {pub.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-2 dark:text-dark-ink-2">
                                            <span className="italic font-medium">{pub.journal}</span>
                                            {pub.volume && <span className="font-semibold">{pub.volume}</span>}
                                            {pub.pages && <span>, {pub.pages}</span>}
                                            {pub.year && <span>({pub.year})</span>}
                                            {pub.status && pub.status !== 'published' && (
                                                <span className="text-ink-3 dark:text-dark-ink-3">
                                                    [{pub.status === 'in-press' ? 'In press' : pub.status === 'under-submission' ? 'Under submission' : pub.status}]
                                                </span>
                                            )}
                                            {pub.impact_factor && (
                                                <span className="font-mono text-xs text-ink-3 dark:text-dark-ink-3">
                                                    [IF: {pub.impact_factor}]
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </CVSection>

                    {services.length > 0 && (
                        <CVSection title="Professional Services">
                            <div className="border-t border-line dark:border-dark-line">
                                {services.map((service, idx) => (
                                    <div key={service.id} className="group relative flex gap-4 md:gap-6 py-5 pl-4 border-b border-line dark:border-dark-line hover:bg-line/20 dark:hover:bg-white/[.03] transition-colors">
                                        <HoverBar />
                                        <span className="font-mono text-xs text-accent dark:text-dark-accent shrink-0 w-8 pt-1 text-right">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base font-semibold text-ink dark:text-dark-ink leading-snug">
                                                {service.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-ink-2 dark:text-dark-ink-2">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CVSection>
                    )}
                </main>
            </div>
        </div>
    );
}
