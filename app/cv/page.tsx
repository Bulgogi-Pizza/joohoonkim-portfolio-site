'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

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
        <header className="mb-12 md:mb-16">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center lg:items-start">
                <div className="flex-shrink-0 w-40 h-52 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-[280px] lg:h-[364px] shadow-2xl rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                    <img src="/assets/images/JoohoonKim.jpg" alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-center lg:text-left">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{profile.name}</h1>
                    {profile.title && (
                        <p className="mt-2 text-base sm:text-lg text-blue-600 dark:text-blue-400 font-semibold">{profile.title}</p>
                    )}
                    <div className="mt-4 space-y-2 text-sm sm:text-base text-gray-900 dark:text-white">
                        {email && <p><strong>Email:</strong> {email.value}</p>}
                        {phone && <p><strong>Phone:</strong> {phone.value}</p>}
                        {office && <p><strong>Office:</strong> {office.value}</p>}
                    </div>
                    {links.length > 0 && (
                        <div className="mt-3 flex gap-x-4 justify-center lg:justify-start flex-wrap">
                            {links.map(link => (
                                <a key={link.id} href={link.value} target="_blank" rel="noopener noreferrer"
                                    className="text-sm sm:text-base font-medium underline text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
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
    <section className="mb-10 md:mb-12">
        <div className="relative">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                {title}
            </h2>
            {link && (
                <Link href={link}
                    className="absolute top-0 right-0 p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    aria-label="View all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </Link>
            )}
        </div>
        {children}
    </section>
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
                setAwards(awardData || []);
                setPublications(pubData || []);
                setServices(serviceData || []);
            })
            .catch(err => console.error('Failed to load CV data:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 flex justify-center items-center">
                <div className="animate-spin h-8 w-8 border-2 border-t-transparent border-blue-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 font-noto">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-60 py-10 sm:py-12 max-w-[1600px]">
                {profile && <ProfileSection profile={profile} />}

                <main className="space-y-16">
                    <CVSection title="Education">
                        <ul className="space-y-3 list-disc pl-5">
                            {education.map(edu => (
                                <li key={edu.id} className="mb-4">
                                    <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                        {edu.degree}
                                    </span>
                                    <span className="text-base md:text-lg text-gray-900 dark:text-white">
                                        , {edu.institution}, {edu.location} ({edu.start_year} – {edu.end_year})
                                    </span>
                                    {edu.advisor && (
                                        <p className="text-base md:text-lg text-gray-900/80 dark:text-white/80 mt-1 italic">
                                            Advisor: {edu.advisor}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </CVSection>

                    <CVSection title="Professional Experience">
                        <ul className="space-y-3 list-disc pl-5">
                            {experience.map(exp => (
                                <li key={exp.id} className="mb-4">
                                    <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                        {exp.position}
                                    </span>
                                    <span className="text-base md:text-lg text-gray-900 dark:text-white">
                                        , {exp.organization}, {exp.location} ({exp.start_year}{exp.end_year !== exp.start_year ? ` – ${exp.end_year}` : ''})
                                    </span>
                                    {exp.description && (
                                        <p className="text-base md:text-lg text-gray-900/80 dark:text-white/80 mt-1 italic">
                                            {exp.description}
                                        </p>
                                    )}
                                    {exp.host_advisor && (
                                        <p className="text-base md:text-lg text-gray-900/80 dark:text-white/80 mt-1 italic">
                                            Host: {exp.host_advisor}
                                        </p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </CVSection>

                    <CVSection title="Selective Honors and Awards" link="/awards">
                        <ul className="space-y-3 list-disc pl-5">
                            {awards.map(award => (
                                <li key={award.id} className="mb-4">
                                    <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                        {award.title}
                                    </span>
                                    {(award.rank || award.organization) && (
                                        <span className="text-base md:text-lg text-gray-900/80 dark:text-white/80">
                                            , {award.rank || award.organization}
                                        </span>
                                    )}
                                    <span className="text-base md:text-lg text-gray-900/80 dark:text-white/80">
                                        , {award.year}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </CVSection>

                    <CVSection title="Selected Publications" link="/publications">
                        <ul className="space-y-3 list-disc pl-5">
                            {publications.map(pub => (
                                <li key={pub.id} className="mb-4">
                                    <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                        {pub.title}
                                    </p>
                                    <p className="text-base md:text-lg mt-1 text-gray-900 dark:text-white">
                                        <span className="font-bold italic text-blue-600 dark:text-blue-400">{pub.journal}</span>
                                        {pub.volume && <span className="font-bold text-blue-600 dark:text-blue-400"> {pub.volume}</span>}
                                        {pub.pages && <span>, {pub.pages}</span>}
                                        {pub.year && <span> ({pub.year})</span>}
                                        {pub.status && pub.status !== 'published' && (
                                            <span> [{pub.status === 'in-press' ? 'In press' : pub.status === 'under-submission' ? 'Under submission' : pub.status}]</span>
                                        )}
                                        {pub.impact_factor && <span className="font-bold ml-2">[IF: {pub.impact_factor}]</span>}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </CVSection>

                    {services.length > 0 && (
                        <CVSection title="Professional Services">
                            <ul className="space-y-3 list-disc pl-5">
                                {services.map(service => (
                                    <li key={service.id} className="mb-4">
                                        <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                                            {service.title}
                                        </p>
                                        <p className="text-base md:text-lg text-gray-900/80 dark:text-white/80 mt-1">
                                            {service.description}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </CVSection>
                    )}
                </main>
            </div>
        </div>
    );
}
