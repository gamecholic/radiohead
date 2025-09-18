import { Station } from "@/lib/types";

/**
 * Generates a URL-friendly slug from a string
 * @param text The text to slugify
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Generates the canonical URL for a station
 * @param station The station object
 * @returns The canonical URL for the station
 */
export function getStationUrl(station: Station): string {
  // Since we don't have individual station pages, we'll link to the group page
  const groupSlug = station.radioGroups[0]
    ? slugify(station.radioGroups[0])
    : "radio";
  return `/group/${groupSlug}`;
}

/**
 * Generates the canonical URL for a group
 * @param groupName The name of the group
 * @returns The canonical URL for the group
 */
export function getGroupUrl(groupName: string): string {
  const groupSlug = slugify(groupName);
  return `/group/${groupSlug}`;
}

/**
 * Gets the base URL for the application
 * @returns The base URL
 */
export function getBaseUrl(): string {
  // In production, this should be set to your actual domain
  // For now, we'll use a placeholder
  return process.env.NEXT_PUBLIC_SITE_URL || "https://www.radyozen.com";
}
