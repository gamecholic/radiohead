import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/contexts/AudioContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { LibraryProvider } from "@/contexts/LibraryContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { getCachedRadioGroups } from "@/lib/cachedRadioGroups";
import { LayoutManager } from "@/components/LayoutManager";

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
  desktop,
  mobile,
}: Readonly<{
  children: React.ReactNode;
  desktop: React.ReactNode;
  mobile: React.ReactNode;
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full relative text-foreground bg-gradient-to-b`}
      >
        <HistoryProvider>
          <AudioProvider>
            <FavoritesProvider>
              <LibraryProvider>
                <LayoutManager
                  radioGroups={radioGroups}
                  desktop={desktop}
                  mobile={mobile}
                >
                  {children}
                </LayoutManager>
              </LibraryProvider>
            </FavoritesProvider>
          </AudioProvider>
        </HistoryProvider>
      </body>
    </html>
  );
}
