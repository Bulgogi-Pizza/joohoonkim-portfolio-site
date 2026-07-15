'use client';

import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} font-sans`}>
        <Providers>
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
        </Providers>
      </body>
    </html>
  );
}
