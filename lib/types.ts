export interface RadioGroup {
  groupName: string;
  slug: string;
}

export interface Category {
  name: string;
}

export interface Station {
  slug?: string;
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
  stationCity?: string;
}

export interface StationDetails {
  "station-slug": string;
  description?: string | null;
  frequencies?: (string | null)[];
  contact?: {
    address?: string | null;
    phone?: string | null;
    fax?: string | null;
    website?: string | null;
  };
  socialMedia?: {
    facebook?: string | null;
    twitter?: string | null;
    instagram?: string | null;
  };
  location?: {
    city?: string | null;
    region?: string | null;
  };
  additionalInfo?: {
    foundedDate?: string | null;
    owner?: string | null;
    slogan?: string | null;
  };
  informationSourceLinks?: (string | null)[];
}

export interface Playlist {
  id: string;
  name: string;
  stations: Station[];
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface HistoryItem {
  station: Station;
  playedAt: number; // timestamp
}
