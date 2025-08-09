import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScrollArea } from "@/components/ui/scroll-area";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RadioHead - Online Radio App",
  description: "Listen to your favorite radio stations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen text-foreground bg-background-gradient`}
      >
        <div className="flex min-h-screen flex-col">
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - hidden on mobile */}
            <aside className="hidden w-64 flex-col border-r border-gray-800 bg-black/30 backdrop-blur-md md:flex">
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white">RadioHead</h1>
              </div>
              <nav className="flex-1 space-y-1 px-4">
                {[
                  { name: "Home", href: "#" },
                  { name: "Browse", href: "#" },
                  { name: "Library", href: "#" },
                  { name: "Favorites", href: "#" },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block rounded-lg px-4 py-2 text-white hover:bg-white/10 transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <div className="px-4 py-6 border-t border-gray-700">
                <h2 className="px-4 text-sm font-semibold text-gray-300 mb-2">
                  Your Stations
                </h2>
                <ScrollArea className="h-64 w-full rounded-md">
                  <div className="space-y-1 pr-2">
                    {[
                      "Jazz FM",
                      "Rock Radio",
                      "Classical Music",
                      "Electronic Waves",
                      "Hip Hop Nation",
                      "Country Roads",
                      "Jazz Classics",
                      "Rock Legends",
                    ].map((station) => (
                      <a
                        key={station}
                        href="#"
                        className="block rounded-lg px-4 py-2 text-sm text-gray-200 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        {station}
                      </a>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}