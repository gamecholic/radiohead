export interface RadioGroup {
  groupName: string;
  slug: string;
}

export interface Category {
  name: string;
}

export interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
  stationCity?: string;
}