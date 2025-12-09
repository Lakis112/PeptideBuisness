import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "MMN Pharmaceuticals | EU-GMP Pharma Grade Peptides",
    template: "%s | MMN Pharmaceuticals"
  },
  description: "Pharmaceutical-grade peptides manufactured under EU-GMP standards in Poland. Triple-quadrupole LC-MS/MS validation with full regulatory documentation for research use.",
  keywords: [
    "pharmaceutical peptides", 
    "EU-GMP peptides",
    "research peptides",
    "GLP-1 analogs",
    "BPC-157",
    "pharma grade",
    "clinical research",
    "laboratory peptides"
  ],
  authors: [{ name: "MMN Pharmaceuticals" }],
  creator: "MMN Pharmaceuticals",
  publisher: "MMN Pharmaceuticals",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mmn-pharma.com'), // REPLACE WITH YOUR DOMAIN
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mmn-pharma.com',
    title: 'MMN Pharmaceuticals | EU-GMP Pharma Grade Peptides',
    description: 'Pharmaceutical-grade peptides manufactured under EU-GMP standards in Poland.',
    siteName: 'MMN Pharmaceuticals',
    images: [
      {
        url: '/og-image.jpg', // ADD THIS IMAGE TO public/
        width: 1200,
        height: 630,
        alt: 'MMN Pharmaceuticals - Pharma Grade Peptides',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MMN Pharmaceuticals | EU-GMP Pharma Grade Peptides',
    description: 'Pharmaceutical-grade peptides manufactured under EU-GMP standards.',
    images: ['/twitter-image.jpg'], // ADD THIS IMAGE TO public/
    creator: '@mmn_pharma',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code', // ADD WHEN YOU HAVE IT
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}