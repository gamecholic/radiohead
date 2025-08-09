"use client";

import { ScrollArea } from "@/components/ui/scroll-area";

export function Sidebar() {
  return (
    <aside className="hidden w-64 max-h-screen flex-col border-r border-gray-800 bg-black/30 backdrop-blur-md md:flex">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">RadioHead</h1>
      </div>
      <nav className="px-4">
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
      <div className="min-h-0 flex-1 px-4 py-6 border-t border-gray-700">
        <ScrollArea className="h-full w-full rounded-md">
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
              "Jazz FM",
              "Rock Radio",
              "Classical Music",
              "Electronic Waves",
              "Hip Hop Nation",
              "Country Roads",
              "Jazz Classics",
              "Rock Legends",
              "Jazz FM",
              "Rock Radio",
              "Classical Music",
              "Electronic Waves",
              "Hip Hop Nation",
              "Country Roads",
              "Jazz Classics",
              "Rock Legends",
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
  );
}
