/**
 * Convert a relative image path to an absolute URL
 * @param relativePath - The relative path to the image (e.g., "/images/station.webp")
 * @returns The absolute URL to the image
 */
export function getAbsoluteImageUrl(relativePath: string): string {
  // If it's already an absolute URL, return it as is
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  
  // If it's a relative path, convert it to absolute
  if (relativePath.startsWith('/')) {
    // In a browser environment, we can use the window.location
    if (typeof window !== 'undefined') {
      return `${window.location.origin}${relativePath}`;
    }
    
    // For server-side rendering, we need to use the NEXT_PUBLIC_BASE_URL environment variable
    // or fallback to a default
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://radiohead-one.vercel.app';
    return `${baseUrl}${relativePath}`;
  }
  
  // If it's neither absolute nor relative starting with '/', return as is
  return relativePath;
}

/**
 * Convert all relative image paths in a station object to absolute URLs
 * @param station - The station object with potentially relative image paths
 * @returns The station object with absolute image URLs
 */
export function convertStationIconUrlsToAbsolute<T extends { stationIconUrl?: string }>(station: T): T {
  if (!station.stationIconUrl) {
    return station;
  }
  
  return {
    ...station,
    stationIconUrl: getAbsoluteImageUrl(station.stationIconUrl)
  };
}