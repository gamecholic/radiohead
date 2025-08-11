import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout";
import { AudioProvider } from "@/contexts/AudioContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { NowPlayingPanel } from "@/components/layout/now-playing-panel";
import { PWAPrompt } from "@/components/pwa-prompt";

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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta name="application-name" content="RadioHead" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="RadioHead" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-[100dvh] text-foreground bg-background-gradient`}
      >
        <AudioProvider>
          <FavoritesProvider>
            <div className="flex min-h-[100dvh] max-h-[100dvh] flex-col">
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 flex flex-col overflow-hidden relative">
                  {children}
                  <NowPlayingPanel />
                </main>
              </div>
            </div>
            <PWAPrompt />
          </FavoritesProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
