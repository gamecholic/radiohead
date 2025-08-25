import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout";
import { AudioProvider } from "@/contexts/AudioContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { NowPlayingPanel } from "@/components/layout/now-playing-panel";
import { DynamicTitleHandler } from "@/components/DynamicTitleHandler";
import { getCachedRadioGroups } from "@/lib/cachedRadioGroups";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RadioHead - Çevrimiçi Radyo Uygulaması",
  description: "Favori radyo istasyonlarınızı modern arayüzle dinleyin",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  openGraph: {
    title: "RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Favori radyo istasyonlarınızı modern arayüzle dinleyin",
    url: "https://radiohead-one.vercel.app",
    siteName: "RadioHead",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
        alt: "RadioHead Logo",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RadioHead - Çevrimiçi Radyo Uygulaması",
    description: "Favori radyo istasyonlarınızı modern arayüzle dinleyin",
    images: ["/icons/icon-512x512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
  viewportFit: "cover", // Enable edge-to-edge display for iOS
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const radioGroups = await getCachedRadioGroups();

  return (
    <html lang="tr">
      <head>
        <meta name="application-name" content="RadioHead" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="RadioHead" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full relative text-foreground bg-background-gradient`}
      >
        <AudioProvider>
          <FavoritesProvider>
            <div className="flex h-full flex-col">
              <div className="flex flex-1 overflow-hidden">
                <Sidebar radioGroups={radioGroups} />

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                  <DynamicTitleHandler />
                  {children}
                  <NowPlayingPanel />
                </main>
              </div>
            </div>
          </FavoritesProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
