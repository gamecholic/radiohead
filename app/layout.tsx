import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout";
import { AudioProvider } from "@/contexts/AudioContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { NowPlayingPanel } from "@/components/layout/now-playing-panel";

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
};;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
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
          </FavoritesProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
