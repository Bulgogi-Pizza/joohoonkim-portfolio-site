'use client';

import React from 'react';
import Link from 'next/link';

const cvData = {
    profile: {
        name: "Joohoon Kim",
        title: "Postdoctoral Researcher, POSTECH Institute of Artificial Intelligence (PIAI), Pohang University of Science and Technology (POSTECH)",
        email: "kimjuhoon@postech.ac.kr",
        phone: "+82-54-279-6806",
        office: "R1259 RIST Building I",
        links: [
            {
                name: "Google Scholar",
                url: "https://scholar.google.com/citations?user=tRNVtewAAAAJ&hl=ko"
            },
            {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/kim-joohoon-054454219/"
            },
            { name: "ORCID", url: "https://orcid.org/0000-0002-0827-1919" }
        ]
    },
    education: [
        {
            degree: "M.S./Ph.D. in Mechanical Engineering",
            university: "POSTECH",
            country: "Korea",
            from: "2021",
            to: "2026",
        },
        {
            degree: "B.S. in Mechanical Engineering",
            university: "POSTECH",
            country: "Korea",
            from: "2017",
            to: "2021",
        },
    ],
    experience: [
        {
            role: "Postdoctoral Researcher",
            institution: "PIAI",
            location: "Korea",
            period: "2026 – 2027",
            description: "In substitution of a mandatory military service"
        },
        {
            role: "Entrepreneurial Member",
            institution: "Metacloud",
            location: "Korea",
            period: "2023 – 2024",
            description: "Funded by I-Corps program (Startup investment program by the Ministry of Science and ICT)"
        },
        {
            role: "Visiting Researcher",
            institution: "Plant and Food Research",
            location: "New Zealand",
            period: "2023",
            description: "Host: Dr. Jonghyun Choi"
        },
        {
            role: "Visiting Researcher",
            institution: "Northeastern University",
            location: "USA",
            period: "2022",
            description: "Host: Prof. Yongmin Liu"
        },
        {
            role: "Visiting Researcher",
            institution: "Massachusetts Institute of Technology",
            location: "USA",
            period: "2022",
            description: "Host: Prof. Juejun Hu"
        },
        {
            role: "Entrepreneurial Leader",
            institution: "ThinLens",
            location: "Korea",
            period: "2022 – 2023",
            description: "Funded by I-Corps program (Startup investment program by the Ministry of Science and ICT)"
        },
        {
            role: "Undergraduate Researcher",
            institution: "POSTECH",
            location: "Korea",
            period: "2019 – 2021",
            description: "Advisor: Junsuk Rho"
        },
        {
            role: "Internship",
            institution: "Samsung Electronics",
            location: "Korea",
            period: "2018",
            description: null
        }
    ],
    awards: [
        {
            name: "World Top 2% Scientists",
            details: "Stanford University/Elsevier",
            year: "2025"
        },
        {
            name: "Editage Grant",
            details: "2nd place",
            year: "2024"
        },
        {
            name: "Presidential Science Fellowship",
            details: "Ph.D.",
            year: "2024 – 2026"
        },
        {
            name: "Asan Biomedical Science Fellowship",
            details: null,
            year: "2024 – 2026"
        },
        {
            name: "iCore Lab Start-Up Award",
            details: "Grand Prize",
            year: "2024"
        },
        {
            name: "NAEK Wonik \"Young Engineers Honor Society\" Award",
            details: "1st place",
            year: "2024"
        },
        {
            name: "3.1 Fellowship",
            details: null,
            year: "2023 – 2024"
        },
        {
            name: "KIDS Award (IMID)",
            details: "Gold",
            year: "2023"
        },
        {
            name: "Samsung Humantech Paper Award",
            details: "Silver",
            year: "2023"
        },
        {
            name: "Talent Award of Korea",
            details: null,
            year: "2022"
        },
        {
            name: "KIDS Award (IMID)",
            details: "Gold",
            year: "2022"
        }
    ],
    publications: [
        {
            title: "Wide-field-of-view, switchable, multi-dimensional light-field display using a metasurface lenticular lens",
            journal: "Nature",
            status: "In revision"
        },
        {
            title: "300 units per second roll-to-roll manufacturing of visible metalenses",
            journal: "Nature",
            status: "In revision"
        },
        {
            title: "Scalable manufacturing of high-index atomic layer-polymer hybrid metasurfaces for metaphotonics in the visible",
            journal: "Nature Materials",
            volume: "22",
            pages: "474-481",
            year: "2023",
            if: "38.5"
        },
        {
            title: "Roll-to-plate printable RGB achromatic metalens for wide-field-of-view holographic near-eye display",
            journal: "Nature Materials",
            volume: "24",
            pages: "535-543",
            year: "2025",
            if: "38.5"
        },
        {
            title: "Full-color augmented reality near-eye displays using single-layer achromatic metasurface waveguides",
            journal: "Nature Nanotechnology",
            volume: "20",
            pages: "747-754",
            year: "2025",
            if: "34.9"
        },
        {
            title: "A water-soluble label for food products prevents packaging waste and counterfeiting",
            journal: "Nature Food",
            volume: "5",
            pages: "293-300",
            year: "2024",
            if: "21.9"
        },
        {
            title: "Anti-aliased metasurfaces beyond the Nyquist limit",
            journal: "Nature Communications",
            volume: "16",
            pages: "411",
            year: "2025",
            if: "15.7"
        },
        {
            title: "Polariton condensate far-detuned from exciton resonance in WS2 bound states in the continuum",
            journal: "Nature Communications",
            status: "In revision"
        },
        {
            title: "Amorphous to crystalline transition in nanoimprinted sol-gel titanium oxide metasurfaces",
            journal: "Advanced Materials",
            volume: "36",
            pages: "2405378",
            year: "2024",
            if: "26.8"
        },
        {
            title: "Dynamic hyperspectral holography enabled by inverse-designed metasurfaces with oblique helicoidal cholesterics",
            journal: "Advanced Materials",
            volume: "36",
            pages: "2311785",
            year: "2024",
            if: "26.8"
        },
        {
            title: "Multicolor and 3D holography generated by inverse-design single-cell metasurfaces",
            journal: "Advanced Materials",
            volume: "35",
            pages: "2208520",
            year: "2023",
            if: "26.8"
        },
        {
            title: "Metasurfaces-driven hyperspectral imaging via multiplexed plasmonic resonance energy transfer",
            journal: "Advanced Materials",
            volume: "35",
            pages: "2300229",
            year: "2023",
            if: "26.8"
        }
    ],
    services: [
        {
            title: "**Proposal Reviewer**",
            description: "Served as proposal reviewer for Israeli Ministry of Innovation, Science and Technology",
        },
        {
            title: "**Journal Reviewer**",
            description: "Regular reviewer for Nature Communications, Light: Science & Applications, Microsystems & Nanoengineering, Laser & Photonics Reviews, ACS Photonics, Optica, Nanophotonics, Communications Physics, npj Nanophotonics, Scientific Reports, Optics Express, Optics Letters, Optics and Laser Technology, Nanomaterials, Displays."
        }
    ]
};

const ProfileSection = ({ profile }: { profile: any }) => (
    <header className="mb-12 md:mb-16">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 items-center lg:items-start">
            <div className="flex-shrink-0 w-40 h-52 sm:w-56 sm:h-72 md:w-64 md:h-80 lg:w-[280px] lg:h-[364px] shadow-2xl rounded-lg overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
                <img src="/assets/images/JoohoonKim.jpg" alt={profile.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">{profile.name}</h1>
                <p className="mt-2 text-base sm:text-lg text-blue-600 dark:text-blue-400 font-semibold">{profile.title}</p>
                <div className="mt-4 space-y-2 text-sm sm:text-base text-gray-900 dark:text-white">
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phone}</p>
                    <p><strong>Office:</strong> {profile.office}</p>
                </div>
                <div className="mt-3 flex gap-x-4 justify-center lg:justify-start flex-wrap">
                    {profile.links.map((link: any) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer"
                            className="text-sm sm:text-base font-medium underline text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </header>
);

const CVSection = ({ title, link = null, children }: { title: string, link?: string | null, children: React.ReactNode }) => (
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

const EducationItem = ({ edu }: { edu: any }) => (
    <ul className="space-y-4 list-disc pl-5">
        <li className="mb-4">
            <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {edu.degree}
            </span>
            <span className="text-base md:text-lg text-gray-900 dark:text-white mt-1">
                , {edu.university}, {edu.country} ({edu.from} – {edu.to})
            </span>
        </li>
    </ul>
);

const ExperienceItem = ({ exp }: { exp: any }) => (
    <ul className="space-y-4 list-disc pl-5">
        <li className="mb-4">
            <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {exp.role}
            </span>
            <span className="text-base md:text-lg text-gray-900 dark:text-white mt-1">
                , {exp.institution}, {exp.location} ({exp.period})
            </span>
            {exp.description && (
                <p className="text-base md:text-lg text-gray-900/80 dark:text-white/80 mt-1 italic">
                    {exp.description}
                </p>
            )}
        </li>
    </ul>
);

const AwardItem = ({ award }: { award: any }) => (
    <ul className="space-y-4 list-disc pl-5">
        <li className="mb-4">
            <div>
                <span className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{award.name}</span>
                {award.details && <span className="text-base md:text-lg text-gray-900/80 dark:text-white/80">, {award.details}</span>}
                <span className="text-base md:text-lg text-gray-900/80 dark:text-white/80">, {award.year}</span>
            </div>
        </li>
    </ul>
);

const PublicationItem = ({ pub }: { pub: any }) => (
    <ul className="space-y-4 list-disc pl-5">
        <li className="mb-4">
            <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white"> {pub.title}</p>
            <p className="text-base md:text-lg mt-1 text-gray-900 dark:text-white">
                <span className="text-base md:text-lg font-bold italic text-blue-600 dark:text-blue-400">{pub.journal}</span>
                {pub.volume && <span className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400"> {pub.volume}</span>}
                {pub.pages && <span className="text-base md:text-lg">, {pub.pages}</span>}
                {pub.year && <span className="text-base md:text-lg"> ({pub.year})</span>}
                {pub.status && <span className="text-base md:text-lg"> [{pub.status}]</span>}
                {pub.if && <span className="text-base md:text-lg font-bold ml-2">[IF: {pub.if}]</span>}
            </p>
        </li>
    </ul>
);

const ServiceItem = ({ service }: { service: any }) => {
    const renderTitle = (title: string) => {
        const parts = title.split(/\*\*(.*?)\*\*/g);
        return parts.map((part, index) =>
            index % 2 === 1 ? <strong key={index}>{part}</strong> : part
        );
    };

    return (
        <li className="mb-4">
            <p className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
                {renderTitle(service.title)}
            </p>
            <p className="text-base md:text-lg text-gray-900/80 dark:text-white/80 mt-1">
                {service.description}
            </p>
        </li>
    );
};

export default function CVPage() {
    return (
        <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 min-h-screen font-noto">
            <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-60 py-10 sm:py-12 max-w-[1600px]">
                <ProfileSection profile={cvData.profile} />
                <main className="space-y-16">
                    <CVSection title="Education">
                        <ul className="space-y-3">
                            {cvData.education.map((edu, i) => <EducationItem key={i} edu={edu} />)}
                        </ul>
                    </CVSection>

                    <CVSection title="Professional Experience">
                        <ul className="space-y-3">
                            {cvData.experience.map((exp, i) => <ExperienceItem key={i} exp={exp} />)}
                        </ul>
                    </CVSection>

                    <CVSection title="Selective Honors and Awards" link="/awards">
                        <ul className="space-y-3">
                            {cvData.awards.map((award, i) => <AwardItem key={i} award={award} />)}
                        </ul>
                    </CVSection>

                    <CVSection title="Recent Publications" link="/publications">
                        <ul className="space-y-3">
                            {cvData.publications.map((pub, i) => <PublicationItem key={i} pub={pub} />)}
                        </ul>
                    </CVSection>

                    <CVSection title="Professional Services">
                        <ul className="space-y-3">
                            {cvData.services.map((service, i) => <ServiceItem key={i} service={service} />)}
                        </ul>
                    </CVSection>
                </main>
            </div>
        </div>
    );
}
