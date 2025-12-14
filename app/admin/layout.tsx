'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { AdminAPI } from '@/lib/adminApi';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const isAdmin = await AdminAPI.checkAuth();
            setIsAuthenticated(isAdmin);
            if (!isAdmin && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        } catch (error) {
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AdminAPI.logout();
        router.push('/admin/login');
    };

    if (pathname === '/admin/login') {
        return children;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const navItems = [
        { name: 'Hero Content', href: '/admin/hero' },
        { name: 'Publications', href: '/admin/publications' },
        { name: 'Awards', href: '/admin/awards' },
        { name: 'Education', href: '/admin/education' },
        { name: 'Experience', href: '/admin/experience' },
        { name: 'Research Areas', href: '/admin/research-areas' },
        { name: 'Research Highlights', href: '/admin/research-highlights' },
        { name: 'Representative Works', href: '/admin/representative-works' },
        { name: 'Cover Arts', href: '/admin/cover-arts' },
        { name: 'Conferences', href: '/admin/conferences' },
        { name: 'Media', href: '/admin/media' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <div className="h-full flex flex-col">
                    {/* Logo/Title */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Portfolio Management</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition ${pathname === item.href
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            View Site
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
