'use client';

import { Button } from '@/components/ui/button';
import { StationIcon } from '@/components/station-icon';

interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
}

interface FeaturedStationProps {
  station: Station;
  onListenNow: () => void;
}

export function FeaturedStation({ station, onListenNow }: FeaturedStationProps) {
  if (!station) return null;

  return (
    <section className="mb-8 h-40 overflow-hidden rounded-xl bg-hero-gradient p-6 shadow-lg md:h-40">
      <div className="flex h-full items-center">
        <div className="mr-4">
          <StationIcon 
            stationIconUrl={station.stationIconUrl}
            stationName={station.stationName}
            size="md"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold md:text-2xl">{station.stationName}</h2>
          <p className="text-sm text-white/70 md:text-base">
            {station.radioGroups[0] || 'Radio Station'} • {station.stationCategories[0] || 'Music'}
          </p>
          <Button 
            className="mt-2 bg-primary-gradient text-white hover:opacity-90" 
            size="sm" 
            onClick={onListenNow}
          >
            Listen Now
          </Button>
        </div>
      </div>
    </section>
  );
}