import categories from '@/lib/data/categories.json';
import radioGroups from '@/lib/data/radio-groups.json';
import radioStations from '@/lib/data/radio-stations.json';

export const getCategories = async () => {
  return categories;
};

export const getRadioGroups = async () => {
  // Return just the group names for backward compatibility
  return radioGroups.map((group: any) => group.groupName);
};

export const getRadioGroupsWithSlugs = async () => {
  return radioGroups;
};

export const getFeaturedStations = async () => {
  // Return the first 10 stations as featured
  return radioStations.slice(0, 10);
};

export const getStationsByCategory = async (category: string) => {
  return radioStations.filter(station => 
    station.stationCategories.includes(category)
  );
};

export const getStationsByGroup = async (groupName: string) => {
  return radioStations.filter(station => 
    station.radioGroups.some((group: string | { groupName: string }) => 
      typeof group === 'string' ? group === groupName : group.groupName === groupName
    )
  );
};