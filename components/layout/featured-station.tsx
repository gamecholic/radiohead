'use client';

import { Button } from '@/components/ui/button';

interface Station {
  id: string;
  name: string;
  frequency: string;
  genre: string;
}

interface FeaturedStationProps {
  station: Station;
  onListenNow: () => void;
}

export function FeaturedStation({ station, onListenNow }: FeaturedStationProps) {
  return (
    <section className="mb-8 h-40 overflow-hidden rounded-xl bg-hero-gradient p-6 shadow-lg md:h-40">
      <div className="flex h-full items-center">
        <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-xl bg-white/10 md:h-24 md:w-24">
          <div className="text-2xl font-bold">{station.name.charAt(0)}</div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold md:text-2xl">{station.name}</h2>
          <p className="text-sm text-white/70 md:text-base">{station.frequency} • {station.genre}</p>
          <Button className="mt-2 bg-primary-gradient text-white hover:opacity-90" size="sm" onClick={onListenNow}>
            Listen Now
          </Button>
        </div>
      </div>
    </section>
  );
}