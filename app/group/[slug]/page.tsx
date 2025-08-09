import { getRadioGroupsWithSlugs, getStationsByGroup } from "@/lib/api";
import { notFound } from "next/navigation";
import { StationIcon } from "@/components/station-icon";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const radioGroups = await getRadioGroupsWithSlugs();
  const group = radioGroups.find((g: any) => g.slug === params.slug);
  
  if (!group) {
    return { title: "Group Not Found" };
  }
  
  return {
    title: `${group.groupName} Radio Stations - RadioHead`,
    description: `Listen to all ${group.groupName} radio stations on RadioHead`,
  };
}

export default async function GroupPage({ params }: { params: { slug: string } }) {
  const radioGroups = await getRadioGroupsWithSlugs();
  const group = radioGroups.find((g: any) => g.slug === params.slug);
  
  if (!group) {
    notFound();
  }
  
  // Use the group name for filtering stations
  const stations = await getStationsByGroup(group.groupName);
  
  return (
    <div className="flex-1 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
        {/* Header with group name */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{group.groupName}</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
        
        {/* Stations grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {stations.map((station: any) => (
            <div 
              key={station.stationName} 
              className="group relative flex flex-col rounded-xl bg-white/5 p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:cursor-pointer border border-white/10"
            >
              <div className="flex items-center">
                <StationIcon 
                  stationIconUrl={station.stationIconUrl}
                  stationName={station.stationName}
                  size="md"
                />
                <div className="ml-4 overflow-hidden">
                  <h2 className="truncate text-lg font-semibold text-white">{station.stationName}</h2>
                  <p className="truncate text-sm text-white/80">{station.stationCity}</p>
                  <div className="mt-1">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-xs">
                      {station.stationCategories[0] || 'Music'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
