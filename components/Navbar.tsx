'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../app/providers';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiChevronDown } from 'react-icons/fi';

interface ResearchArea {
    slug: string;
    title: string;
}

interface MenuChild {
    name: string;
    to: string;
}

interface MenuItem {
    name: string;
    to: string;
    section?: string;
    children?: MenuChild[];
}

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const pathname = usePathname();
    const [researchAreas, setResearchAreas] = useState<ResearchArea[]>([]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch('/api/research-areas')
            .then(res => res.json())
            .then(data => setResearchAreas(data))
            .catch(err => console.error(err));
    }, []);

    const menuItems: MenuItem[] = [
        { name: 'Home', to: '/' },
        {
            name: 'Members', to: '/members/current', section: '/members', children: [
                { name: 'Joohoon Kim (PI)', to: '/members/pi' },
                { name: 'Current Team', to: '/members/current' },
                { name: 'Alumni', to: '/members/alumni' },
            ]
        },
        {
            name: 'Research', to: '/research', section: '/research',
            children: researchAreas.map(area => ({ name: area.title, to: `/research/${area.slug}` })),
        },
        { name: 'Publications', to: '/publications' },
        { name: 'Talks', to: '/conferences' },
        {
            name: 'Awards', to: '/awards/pi', section: '/awards', children: [
                { name: 'PI', to: '/awards/pi' },
                { name: 'Students', to: '/awards/students' },
            ]
        },
        { name: 'Opening', to: '/opening' },
    ];

    const isActive = (item: MenuItem) =>
        pathname === item.to || (!!item.section && !!pathname?.startsWith(`${item.section}/`));

    const navClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-paper/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-line dark:border-dark-line py-2'
        : 'bg-transparent py-4'
        } `;

    return (
        <nav className={navClasses}>
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-3">
                        <img
                            src="/images/skku-logo.png"
                            alt="Sungkyunkwan University"
                            className="w-11 h-11 rounded-full dark:bg-white"
                        />
                        <div className="leading-none">
                            <span className="block font-heading text-xl font-bold tracking-tight text-ink dark:text-dark-ink group-hover:text-accent dark:group-hover:text-dark-accent transition-colors">
                                PhoS Lab
                            </span>
                            <span className="block mt-1.5 pt-1.5 border-t border-ink/20 dark:border-white/20 text-[11px] text-ink-3 dark:text-dark-ink-3">
                                광반도체 설계·제조 연구실
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group"
                                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                                onMouseLeave={() => item.children && setOpenDropdown(null)}
                            >
                                <Link
                                    href={item.to}
                                    className={`
                          flex items-center gap-1 font-mono text-xs font-semibold uppercase tracking-[0.14em] transition-all duration-300 relative
                          ${isActive(item) ? 'text-ink dark:text-dark-ink after:w-full' : 'text-ink-3 dark:text-dark-ink-3 hover:text-ink dark:hover:text-dark-ink'}
after:content-[''] after:absolute after:left-0 after:bottom-[-5px] after:w-0 after:h-[2px]
after:bg-ink dark:after:bg-dark-ink after:transition-all after:duration-300 hover:after:w-full
  `}
                                >
                                    {item.name}
                                    {item.children && <FiChevronDown className={`transition-transform duration-300 ${openDropdown === item.name ? 'rotate-180' : ''} `} />}
                                </Link>

                                <AnimatePresence>
                                    {item.children && openDropdown === item.name && item.children.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-64 bg-card dark:bg-dark-card border border-line dark:border-dark-line rounded-xl shadow-elev-hover overflow-hidden"
                                        >
                                            {item.children.map((child) => (
                                                <Link
                                                    key={child.to}
                                                    href={child.to}
                                                    className="block px-4 py-3 text-sm text-ink-2 dark:text-dark-ink-2 hover:bg-line/40 dark:hover:bg-white/5 hover:text-accent dark:hover:text-dark-accent transition-colors"
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-full border border-line dark:border-dark-line hover:border-ink/30 dark:hover:border-white/25 text-ink-2 dark:text-dark-ink-2 hover:text-ink dark:hover:text-dark-ink transition-all"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <FiMoon size={18} /> : <FiSun size={18} />}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-ink-2 dark:text-dark-ink-2 hover:text-accent dark:hover:text-dark-accent transition-colors"
                        >
                            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden overflow-hidden bg-card dark:bg-dark-card border border-line dark:border-dark-line mt-4 rounded-xl shadow-elev"
                        >
                            <div className="px-4 py-6 space-y-4">
                                {menuItems.map((item) => (
                                    <div key={item.name}>
                                        <Link
                                            href={item.to}
                                            className={`
                          block font-mono text-sm font-semibold uppercase tracking-[0.14em] transition-colors
                          ${isActive(item) ? 'text-ink dark:text-dark-ink' : 'text-ink-3 dark:text-dark-ink-3 hover:text-ink dark:hover:text-dark-ink'}
`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>

                                        {item.children && (
                                            <div className="ml-4 mt-2 space-y-2 border-l border-line dark:border-dark-line pl-4">
                                                {item.children.map((child) => (
                                                    <Link
                                                        key={child.to}
                                                        href={child.to}
                                                        className="block text-sm text-ink-3 dark:text-dark-ink-3 hover:text-accent dark:hover:text-dark-accent transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

export default Navbar;
