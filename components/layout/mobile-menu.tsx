'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden">
      <div className="absolute left-0 top-0 h-full w-64 bg-black/30 backdrop-blur-md border-r border-gray-700 p-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">RadioHead</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            ✕
          </Button>
        </div>
        <nav className="space-y-1">
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
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h2 className="px-4 text-sm font-semibold text-gray-300 mb-2">
            Your Stations
          </h2>
          <ScrollArea className="h-48 w-full rounded-md">
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
      </div>
    </div>
  );
}