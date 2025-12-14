'use client';

import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors text-slate-900 dark:text-slate-200 selection:bg-brand-accent selection:text-brand-dark">
            {!isAdminPage && <Navbar />}
            <main className={isAdminPage ? '' : 'pt-20'}>
              {children}
            </main>
            {!isAdminPage && (
              <footer className="bg-brand-light dark:bg-slate-900 border-t border-brand-dark/5 dark:border-white/5 mt-20">
                <div className="container mx-auto px-6 lg:px-8 py-8">
                  <div className="text-center text-slate-400">
                    <p>&copy; 2025 Joohoon Kim. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            )}
          </div>
        </Providers>
      </body>
    </html>
  );
}

