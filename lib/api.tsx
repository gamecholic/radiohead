import categories from '@/lib/data/categories.json';
import radioGroups from '@/lib/data/radio-groups.json';
import radioStations from '@/lib/data/radio-stations.json';
import { RadioGroup, RadioStation } from '@/lib/types';

export const getCategories = async (): Promise<string[]> => {
  return categories;
};

export const getRadioGroups = async (): Promise<string[]> => {
  // Return just the group names for backward compatibility
  return radioGroups.map((group: RadioGroup) => group.groupName);
};

export const getRadioGroupsWithSlugs = async (): Promise<RadioGroup[]> => {
  return radioGroups;
};

export const getFeaturedStations = async (): Promise<RadioStation[]> => {
  // Return the first 10 stations as featured
  return radioStations.slice(0, 10);
};

export const getStationsByCategory = async (category: string): Promise<RadioStation[]> => {
  return radioStations.filter((station: RadioStation) => 
    station.stationCategories.includes(category)
  );
};

export const getStationsByGroup = async (groupName: string): Promise<RadioStation[]> => {
  return radioStations.filter((station: RadioStation) => 
    station.radioGroups.some((group: string) => group === groupName)
  );
};