'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

// admin 경로에서는 Navbar/Footer를 숨기는 클라이언트 셸.
// (루트 layout은 서버 컴포넌트로 두어 metadata를 주입하기 위해 분리됨)
export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    return (
        <div className="min-h-screen bg-paper dark:bg-dark-bg transition-colors text-ink dark:text-dark-ink selection:bg-accent selection:text-white">
            {!isAdminPage && <Navbar />}
            <main className={isAdminPage ? '' : 'pt-20'}>
                {children}
            </main>
            {!isAdminPage && (
                <footer className="border-t border-line dark:border-dark-line mt-14">
                    <div className="container mx-auto px-6 lg:px-8 py-8">
                        <p className="text-center font-mono text-xs tracking-widest uppercase text-ink-3 dark:text-dark-ink-3">
                            &copy; 2026 Joohoon Kim. All rights reserved.
                        </p>
                    </div>
                </footer>
            )}
        </div>
    );
}
