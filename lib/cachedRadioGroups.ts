import { getRadioGroupsWithSlugs } from "@/lib/api";
import { RadioGroup } from "@/lib/types";

// Manual cache implementation for ISR-like behavior
let cache: { data: RadioGroup[] | null; timestamp: number } | null = null;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds

export async function getCachedRadioGroups() {
  const now = Date.now();

  // Check if we have valid cached data
  if (cache && cache.data && now - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }

  // Fetch fresh data
  const radioGroups = await getRadioGroupsWithSlugs();

  // Update cache
  cache = {
    data: radioGroups,
    timestamp: now,
  };

  return radioGroups;
}