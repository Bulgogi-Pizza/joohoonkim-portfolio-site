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

function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [researchDropdownOpen, setResearchDropdownOpen] = useState(false);
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

    const menuItems = [
        { name: 'Home', to: '/' },
        { name: 'Research', to: '/research', hasDropdown: true },
        { name: 'CV', to: '/cv' },
        { name: 'Publications', to: '/publications' },
        { name: 'Awards', to: '/awards' },
        { name: 'Talks', to: '/conferences' },
    ];

    const navClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${scrolled
        ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-brand-dark/5 dark:border-white/5 shadow-sm py-2'
        : 'bg-transparent py-4'
        } `;

    return (
        <nav className={navClasses}>
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="text-2xl font-heading font-bold text-brand-dark dark:text-white hover:text-brand-primary transition-colors"
                    >
                        Joohoon Kim
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {menuItems.map((item) => (
                            <div
                                key={item.name}
                                className="relative group"
                                onMouseEnter={() => item.hasDropdown && setResearchDropdownOpen(true)}
                                onMouseLeave={() => item.hasDropdown && setResearchDropdownOpen(false)}
                            >
                                <Link
                                    href={item.to}
                                    className={`
                          flex items-center gap-1 text-base font-medium transition-all duration-300 relative
                          ${pathname === item.to ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-300 hover:text-brand-dark dark:hover:text-white'}
after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px]
after:bg-brand-primary after:transition-all after:duration-300 hover:after:w-full
  `}
                                >
                                    {item.name}
                                    {item.hasDropdown && <FiChevronDown className={`transition-transform duration-300 ${researchDropdownOpen ? 'rotate-180' : ''} `} />}
                                </Link>

                                {/* Research Dropdown */}
                                <AnimatePresence>
                                    {item.hasDropdown && researchDropdownOpen && researchAreas.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute top-full left-0 mt-2 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-brand-dark/5 dark:border-white/5 rounded-xl shadow-xl overflow-hidden"
                                        >
                                            {researchAreas.map((area) => (
                                                <Link
                                                    key={area.slug}
                                                    href={`/research/${area.slug}`}
                                                    className="block px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-brand-light dark:hover:bg-gray-700 hover:text-brand-primary transition-colors"
                                                >
                                                    {area.title}
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
                            className="p-2 rounded-full bg-brand-light dark:bg-gray-800 hover:bg-slate-200 dark:hover:bg-gray-700 text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-all"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors"
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
                            className="lg:hidden overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-brand-dark/5 dark:border-white/5 mt-4 rounded-xl shadow-lg"
                        >
                            <div className="px-4 py-6 space-y-4">
                                {menuItems.map((item) => (
                                    <div key={item.name}>
                                        <Link
                                            href={item.to}
                                            className={`
                          block text-lg font-medium transition-colors
                          ${pathname === item.to ? 'text-brand-primary' : 'text-slate-600 dark:text-slate-300 hover:text-brand-dark dark:hover:text-white'}
`}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>

                                        {item.hasDropdown && (
                                            <div className="ml-4 mt-2 space-y-2 border-l border-brand-dark/10 dark:border-white/10 pl-4">
                                                {researchAreas.map((area) => (
                                                    <Link
                                                        key={area.slug}
                                                        href={`/research/${area.slug}`}
                                                        className="block text-sm text-slate-500 dark:text-slate-400 hover:text-brand-primary transition-colors"
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                    >
                                                        {area.title}
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
