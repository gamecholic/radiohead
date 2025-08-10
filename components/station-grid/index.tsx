import { RadioStation } from "@/lib/types";
import { StationCard } from "@/components/station-grid/station-card";

interface StationGridProps {
  stations: RadioStation[];
  allStations?: RadioStation[];
}

export function StationGrid({ stations, allStations = stations }: StationGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {stations.map((station) => (
        <div key={station.stationName} className="flex-shrink-0">
          <StationCard station={station} stationList={allStations} layout="vertical" />
        </div>
      ))}
    </div>
  );
}