import {
  getStationBySlug,
  getStationDetailsBySlug,
  getStationsByCategory,
  getStationSlugsWithDetails,
} from "@/lib/api";
import { notFound } from "next/navigation";
import { StationPageClient } from "./client";
import { Station } from "@/lib/types";

export async function generateStaticParams() {
  // We'll generate static params for all stations that have details
  const stationSlugs = await getStationSlugsWithDetails();

  return stationSlugs.map((slug) => ({
    slug,
  }));
}

export default async function MobileStationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const station = await getStationBySlug(resolvedParams.slug);
  const stationDetails = await getStationDetailsBySlug(resolvedParams.slug);

  if (!station) {
    notFound();
  }

  // Get similar stations (first 5 from the same category)
  let similarStations: Station[] = [];
  if (station.stationCategories.length > 0) {
    similarStations = await getStationsByCategory(station.stationCategories[0]);
    // Filter out the current station and stations without slugs
    similarStations = similarStations.filter(
      (s) => s.slug && s.slug !== station.slug
    );
    // Take only first 10
    similarStations = similarStations.slice(0, 10);
  }

  return (
    <StationPageClient
      station={station}
      stationDetails={stationDetails}
      similarStations={similarStations}
    />
  );
}