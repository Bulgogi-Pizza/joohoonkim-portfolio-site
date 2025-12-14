export const researchAreas = [
    {
        id: 1,
        slug: 'nanophotonics',
        title: 'Nanophotonics',
        description: '## Nanophotonics\n\nStudy of light at the nanoscale. This involves the interaction of light with structures that are much smaller than the wavelength of light.'
    },
    {
        id: 2,
        slug: 'metasurfaces',
        title: 'Metasurfaces',
        description: '## Metasurfaces\n\nArtificial sheet materials with sub-wavelength thickness. They can be designed to have specific optical properties that are not found in nature.'
    },
    {
        id: 3,
        slug: 'plasmonics',
        title: 'Plasmonics',
        description: '## Plasmonics\n\nInteraction between electromagnetic field and free electrons in a metal. This field explores how electromagnetic fields can be confined over dimensions on the order of or smaller than the wavelength.'
    },
];

export const representativeWorks = [
    {
        id: 1,
        title: 'High-Efficiency Metasurface',
        description: 'Demonstration of high-efficiency metasurface for visible light.',
        image_path: '/assets/images/hero-image.png',
    },
    {
        id: 2,
        title: 'Optical Computing',
        description: 'All-optical neural network using diffractive optics.',
        image_path: '/assets/images/publication-thumb1.png',
    },
];

export const publications = [
    {
        id: 1,
        number: 10,
        title: 'Wide-field-of-view, switchable, multi-dimensional light-field display using a metasurface lenticular lens',
        authors: 'J. Kim, et al.',
        journal: 'Nature',
        year: '2025',
        status: 'In revision',
        featured_info: 'Featured in Nature News',
        doi: '',
        arxiv: 'https://arxiv.org/abs/example',
        link: 'https://www.nature.com/'
    },
    {
        id: 2,
        number: 9,
        title: 'Scalable manufacturing of high-index atomic layer-polymer hybrid metasurfaces for metaphotonics in the visible',
        authors: 'J. Kim, et al.',
        journal: 'Nature Materials',
        volume: '22',
        pages: '474-481',
        year: '2023',
        doi: '10.1038/s41563-023-01485-5',
        image_path: '/assets/images/publication-thumb1.png',
    },
    {
        id: 3,
        number: 8,
        title: 'Metasurface Holography',
        authors: 'J. Kim, et al.',
        journal: 'Nature Photonics',
        year: '2024',
        doi: '10.1038/s41566-024-00000-x',
    },
];

export const awards = [
    {
        id: 1,
        title: "Editage Grant",
        organization: "Editage",
        details: "2nd place",
        year: "2024"
    },
    {
        id: 2,
        title: "Presidential Science Fellowship",
        organization: "Government of Korea",
        details: "Ph.D.",
        year: "2024"
    },
    {
        id: 3,
        title: "Samsung Humantech Paper Award",
        organization: "Samsung Electronics",
        details: "Silver",
        year: "2023"
    }
];

export const conferences = [
    {
        id: 1,
        conference_name: "CLEO 2024",
        location: "Charlotte, USA",
        date: "2024-05-05",
        presentation_type: "Oral",
        award: "Best Student Paper",
    },
    {
        id: 2,
        conference_name: "SPIE Photonics West",
        location: "San Francisco, USA",
        date: "2024-01-27",
        presentation_type: "Poster",
    }
];

export const media = [
    {
        id: 1,
        title: "Breakthrough in Metasurface Manufacturing",
        source: "Science Daily",
        date: "2023-04-15",
        category: "news",
        url: "https://www.sciencedaily.com",
        description: "Researchers develop a new method for scalable manufacturing of metasurfaces.",
        image_url: "/assets/images/hero-image.png"
    },
    {
        id: 2,
        title: "Interview with Joohoon Kim",
        source: "POSTECH News",
        date: "2023-05-01",
        category: "interview",
        url: "https://www.postech.ac.kr",
        description: "Discussing the future of nanophotonics.",
    }
];

export const cvData = {
    profile: {
        name: "Joohoon Kim",
        title: "Ph.D Candidate, Mechanical Engineering, Pohang University of Science and Technology (POSTECH)",
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
            to: "2026, expected",
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
            period: "2026 – 2027, expected",
            description: "In substitution of a mandatory military service"
        },
        {
            role: "Visiting Researcher",
            institution: "Plant and Food Research",
            location: "New Zealand",
            period: "2023",
            description: "Host: Dr. Jonghyun Choi"
        }
    ],
    awards: awards, // Reuse awards data
    publications: publications, // Reuse publications data
    services: [
        {
            title: "**Proposal Reviewer**",
            description: "Served as proposal reviewer for Israeli Ministry of Innovation, Science and Technology",
        },
        {
            title: "**Journal Reviewer**",
            description: "Regular reviewer for Nature Communications, Light: Science & Applications, etc."
        }
    ]
};

export const researchHighlights = [
    {
        id: 1,
        description: "Featured in Nature News",
        image_path: "/assets/images/hero-image.png",
        link: "/publications"
    },
    {
        id: 2,
        description: "Best Paper Award at CLEO",
        image_path: "/assets/images/publication-thumb1.png",
        link: "/awards"
    }
];

export const coverArts = [
    {
        id: 1,
        title: 'Nature Materials Cover',
        journal: 'Nature Materials',
        year: '2023',
        image_path: '/assets/images/hero-image.png',
        link: 'https://www.nature.com/'
    },
    {
        id: 2,
        title: 'Advanced Materials Cover',
        journal: 'Advanced Materials',
        year: '2024',
        image_path: '/assets/images/publication-thumb1.png',
        link: '/publications'
    }
];
