export interface RadioGroup {
  groupName: string;
  slug: string;
}

export interface RadioStation {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
  stationCity?: string; // Optional field that seems to be used in the client component
}

export interface Category {
  name: string;
}