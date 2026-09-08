import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../contexts/AppContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ReferralTracker } from "../components/ReferralTracker";
import { GoogleAnalytics } from '@next/third-parties/google';
import { Toaster } from 'react-hot-toast';
import { organizationJsonLd, websiteJsonLd } from "./json-ld";
import { BackgroundWrapper } from "../components/BackgroundWrapper";
import { NativeAppBridge } from "../components/mobile/NativeAppBridge";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.oniromancy.com"),
  alternates: {
    canonical: "./",
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  title: {
    template: "%s | Oniromancy AI",
    default: "Oniromancy AI - Free Dream Interpretation, Tarot & Horoscope",
  },
  description:
    "Unlock the secrets of your subconscious with AI-powered Dream Interpretation, free Tarot readings, and daily Horoscope. Explore Jungian psychology and visual art.",
  keywords: [
    "Dream Interpretation",
    "Dream Meaning",
    "Free Tarot Reading",
    "Online Tarot",
    "Daily Horoscope",
    "Astrology",
    "Zodiac Signs",
    "AI Art",
    "Jungian Psychology",
    "Oniromancy",
    "Dream Analysis",
  ],
  openGraph: {
    title: "Oniromancy AI - Dream Interpretation & Tarot",
    description:
      "Analyze your dreams, get free tarot readings, and check your daily horoscope with AI-powered insights.",
    url: "https://www.oniromancy.com",
    siteName: "Oniromancy AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oniromancy AI - Dream Interpretation & Tarot",
    description:
      "Analyze your dreams, get free tarot readings, and check your daily horoscope with AI-powered insights.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon", type: "image/png", sizes: "192x192" },
    ],
    apple: "/apple-icon",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@100..900&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-inter: 'Inter', sans-serif;
            --font-cormorant: 'Cormorant Garamond', serif;
            --font-cinzel: 'Cinzel Decorative', serif;
          }
        `}} />
      </head>
      <body className={`font-sans antialiased bg-[#050208]`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Toaster position="bottom-right" />
        <AppProvider>
          <NativeAppBridge />
          <ReferralTracker />
          <div className="min-h-screen flex flex-col">
            <BackgroundWrapper />
            <Navbar />
            <main className="app-main flex-grow relative w-full max-w-7xl mx-auto px-4 pt-24 pb-12 flex flex-col items-center min-h-[80vh]">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
      </body>
    </html>
  );
}
