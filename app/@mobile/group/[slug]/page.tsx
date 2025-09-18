"use client";

import { useState, useEffect } from "react";
import { StationIcon } from "@/components/station-icon";
import { Play, Pause, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { getStationsByGroup, getRadioGroupsWithSlugs } from "@/lib/api";
import { Station, RadioGroup } from "@/lib/types";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { AddToPlaylist } from "@/components/add-to-playlist";
import Head from "next/head";

export default function MobileGroup() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  useEffect(() => {
    const fetchStations = async () => {
      try {
        if (slug) {
          // Get all radio groups to find the matching one
          const radioGroups = await getRadioGroupsWithSlugs();
          const matchedGroup = radioGroups.find(
            (group: RadioGroup) => group.slug === slug
          );

          if (matchedGroup) {
            setGroupName(matchedGroup.groupName);
            setGroupDescription(
              `${matchedGroup.groupName} grubuna ait radyo istasyonları. Canlı radyo dinle ve favori istasyonlarını keşfet.`
            );

            // Fetch stations by the actual group name
            const stationsData = await getStationsByGroup(
              matchedGroup.groupName
            );
            setStations(stationsData);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stations:", error);
        setLoading(false);
      }
    };

    fetchStations();
  }, [slug]);

  const handleFavoriteToggle = async (station: Station) => {
    if (favorites.some((fav) => fav.stationName === station.stationName)) {
      await removeFavorite(station.stationName);
    } else {
      await addFavorite(station);
    }
  };

  return (
    <>
      <Head>
        <title>{groupName ? `${groupName} Radyo İstasyonları` : "Radyo Grubu"} - RadyoZen</title>
        <meta 
          name="description" 
          content={groupDescription || `RadyoZen'de ${groupName || "bu"} radyo grubuna ait istasyonları keşfedin. Canlı radyo dinle.`} 
        />
        <meta 
          name="keywords" 
          content={`radyo dinle, canlı radyo dinle, ${groupName?.toLowerCase() || "radyo"} istasyonları, müzik radyo`} 
        />
        <meta property="og:title" content={`${groupName ? `${groupName} Radyo İstasyonları` : "Radyo Grubu"} - RadyoZen`} />
        <meta 
          property="og:description" 
          content={groupDescription || `RadyoZen'de ${groupName || "bu"} radyo grubuna ait istasyonları keşfedin. Canlı radyo dinle.`} 
        />
        <meta property="og:url" content={`https://www.radyozen.com/group/${slug}`} />
        <meta property="og:site_name" content="RadyoZen" />
        <meta property="og:image" content="https://www.radyozen.com/icons/icon-512x512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${groupName ? `${groupName} Radyo İstasyonları` : "Radyo Grubu"} - RadyoZen`} />
        <meta 
          name="twitter:description" 
          content={groupDescription || `RadyoZen'de ${groupName || "bu"} radyo grubuna ait istasyonları keşfedin. Canlı radyo dinle.`} 
        />
        <meta name="twitter:image" content="https://www.radyozen.com/icons/icon-512x512.png" />
        <link rel="canonical" href={`https://www.radyozen.com/group/${slug}`} />
        <link rel="alternate" hrefLang="tr-TR" href={`https://www.radyozen.com/group/${slug}`} />
      </Head>
      <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white">
        <ScrollArea className="flex-1">
          <div className="px-4 pb-4">
            <div className="mt-4 mb-6">
              <h1 className="text-2xl font-bold capitalize">{groupName} Radyo İstasyonları</h1>
              <p className="text-gray-400">{stations.length} radyo istasyonu</p>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
              </div>
            ) : (
                <div className="space-y-3">
                  {stations.map((station) => (
                    <motion.div
                      key={station.stationName}
                      className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        togglePlay(station, stations, groupName || "Grup")
                      }
                    >
                      <div className="relative mr-4">
                        <StationIcon
                          stationIconUrl={station.stationIconUrl}
                          stationName={station.stationName}
                          size="md"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {station.stationName}
                        </h3>
                        <p className="text-sm text-gray-400 truncate">
                          {station.stationCity}
                        </p>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <AddToPlaylist station={station} />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFavoriteToggle(station);
                        }}
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.some(
                              (fav) => fav.stationName === station.stationName
                            )
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </Button>
                      <Button
                        size="icon"
                        className="ml-2 rounded-full bg-white text-black"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(station, stations, groupName || "Grup");
                        }}
                      >
                        {currentStation?.stationName === station.stationName &&
                        isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
