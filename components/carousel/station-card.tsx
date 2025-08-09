'use client';

interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
}

interface StationCardProps {
  station: Station;
  onPlay: (stationId: string) => void;
  isPlaying: boolean;
  isActive: boolean;
}

export function StationCard({ station, onPlay, isPlaying, isActive }: StationCardProps) {
  return (
    <div
      className={`group relative flex w-48 flex-row items-center rounded-xl bg-white/5 p-3 backdrop-blur-md transition-all hover:bg-white/10 hover:cursor-pointer md:w-56 ${
        isActive ? 'ring-hero-gradient bg-white/10' : ''
      }`}
      onClick={() => onPlay(station.stationName)}
    >
      {/* Station image container with fixed aspect ratio */}
      <div className="relative mr-3 aspect-square h-16 overflow-hidden rounded-xl bg-white/10">
        {station.stationIconUrl ? (
          <img
            src={station.stationIconUrl}
            alt={station.stationName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-xl font-bold">{station.stationName.charAt(0)}</div>
          </div>
        )}
        {/* Live tag for featured stations */}
        {station.stationCategories.includes('Pop') && (
          <div className="absolute left-1 top-1 rounded bg-red-500 px-1 py-0.5 text-[0.6rem] font-semibold">
            LIVE
          </div>
        )}
      </div>
      
      {/* Station info */}
      <div className="flex-1 overflow-hidden">
        <h3 className="truncate text-sm font-semibold text-white">{station.stationName}</h3>
        <p className="truncate text-xs text-white/80">{station.radioGroups[0] || 'Radio Station'}</p>
        
        {/* Genre tag */}
        <div className="mt-1">
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
            {station.stationCategories[0] || 'Music'}
          </span>
        </div>
      </div>
    </div>
  );
}