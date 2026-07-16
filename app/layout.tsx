import type { Metadata } from "next";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AppShell from "../components/AppShell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono" });

const SITE_URL = "https://joohoonkim.site";
const DESCRIPTION =
  "Joohoon Kim (김주훈) — Postdoctoral Researcher at POSTECH (포스텍), working on nanophotonics, metasurfaces, and scalable nanofabrication. 김주훈 포스텍 나노포토닉스 연구자 포트폴리오.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Joohoon Kim (김주훈) | Nanophotonics Researcher, POSTECH",
    template: "%s | Joohoon Kim (김주훈)",
  },
  description: DESCRIPTION,
  keywords: [
    "Joohoon Kim", "김주훈", "김주훈 교수", "김주훈 포스텍", "포스텍 김주훈",
    "성균관대 김주훈", "김주훈 성균관대", "성균관대학교", "SKKU",
    "POSTECH", "포스텍", "nanophotonics", "나노포토닉스",
    "metasurface", "메타표면", "메타서피스", "nanofabrication", "나노공정",
    "silicon photonics", "실리콘 포토닉스", "PIC", "photonic integrated circuit",
    "optical computing", "광컴퓨팅",
    "Junsuk Rho", "노준석", "박사후연구원",
  ],
  authors: [{ name: "Joohoon Kim", url: SITE_URL }],
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "profile",
    url: SITE_URL,
    siteName: "Joohoon Kim (김주훈)",
    title: "Joohoon Kim (김주훈) | Nanophotonics Researcher, POSTECH",
    description: DESCRIPTION,
    locale: "en_US",
    alternateLocale: ["ko_KR"],
  },
  twitter: {
    card: "summary",
    title: "Joohoon Kim (김주훈) | Nanophotonics Researcher, POSTECH",
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Joohoon Kim",
  alternateName: ["김주훈", "Kim Joohoon"],
  url: SITE_URL,
  jobTitle: "Postdoctoral Researcher",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "POSTECH (Pohang University of Science and Technology)",
    alternateName: "포스텍",
  },
  knowsAbout: [
    "Nanophotonics", "나노포토닉스", "Metasurfaces", "메타표면",
    "Nanofabrication", "나노공정", "Optics",
    "Silicon Photonics", "실리콘 포토닉스", "Photonic Integrated Circuits", "PIC",
    "Optical Computing", "광컴퓨팅",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${plexMono.variable} font-sans`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
