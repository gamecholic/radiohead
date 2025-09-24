"use client";

import { useState, useEffect } from "react";
import { StationIcon } from "@/components/station-icon";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Heart, Share2, MapPin, Phone, Globe, Facebook, Twitter, Instagram } from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Station, StationDetails } from "@/lib/types";
import { motion } from "framer-motion";
import { AddToPlaylist } from "@/components/add-to-playlist";

export function StationPageClient({
  station,
  stationDetails,
  similarStations = [],
}: {
  station: Station;
  stationDetails: StationDetails | null;
  similarStations: Station[];
}) {
  const { isPlaying, currentStation, togglePlay } = useAudio();
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if station is in favorites
  useEffect(() => {
    const fav = favorites.some(
      (fav) => fav.stationName === station.stationName
    );
    setIsFavorite(fav);
  }, [favorites, station.stationName]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(station.stationName);
    } else {
      addFavorite(station);
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: station.stationName,
          text: `RadyoZen'de ${station.stationName} radyosunu dinle!`,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Bağlantı panoya kopyalandı!");
    }
  };

  const isCurrentStation = currentStation?.stationName === station.stationName;
  const showPlayButton = isCurrentStation ? isPlaying : false;

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <ScrollArea className="flex-1">
        <div className="px-4 pb-24">
          {/* Station Header */}
          <div className="mt-4 mb-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="mb-4">
                <StationIcon
                  stationIconUrl={station.stationIconUrl}
                  stationName={station.stationName}
                  size="lg"
                  priority={true}
                />
              </div>
              <h1 className="text-2xl font-bold">{station.stationName}</h1>
              
              <div className="flex flex-wrap justify-center gap-2 mt-3 mb-4">
                {station.stationCategories.map((category, index) => (
                  <div
                    key={index}
                    className="bg-white/10 rounded-full px-3 py-1 text-sm"
                  >
                    {category}
                  </div>
                ))}
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                {stationDetails?.description?.substring(0, 200)}...
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                className="h-12 rounded-full bg-hero-gradient hover:opacity-90 flex items-center justify-center"
                onClick={() =>
                  togglePlay(
                    station,
                    [station, ...similarStations],
                    `Benzer İstasyonlar - ${station.stationName}`
                  )
                }
              >
                {showPlayButton ? (
                  <Pause className="h-5 w-5 mr-2" />
                ) : (
                  <Play className="h-5 w-5 mr-2" />
                )}
                {isCurrentStation && isPlaying ? "Durdur" : "Dinle"}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 hover:bg-white/10 flex items-center justify-center"
                  onClick={handleFavoriteToggle}
                >
                  <Heart
                    className={`h-5 w-5 mr-2 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                </Button>
                
                <Button
                  variant="outline"
                  className="h-12 rounded-full border-white/20 hover:bg-white/10 flex items-center justify-center"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Paylaş
                </Button>
              </div>
            </div>
            
            <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-6 mx-auto"></div>
          </div>

          {/* Description Section */}
          {stationDetails?.description && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Hakkında</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <p className="text-gray-300">
                  {stationDetails?.description}
                </p>
              </div>
            </div>
          )}

          {/* Frequencies Section */}
          {stationDetails?.frequencies && stationDetails?.frequencies?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Frekanslar</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {stationDetails?.frequencies?.map((freq, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center"
                  >
                    <span className="text-gray-300">{freq}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info Section */}
          {(stationDetails?.additionalInfo?.foundedDate ||
            stationDetails?.additionalInfo?.owner ||
            stationDetails?.additionalInfo?.slogan) && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Ek Bilgiler</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
                {stationDetails?.additionalInfo?.foundedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Kuruluş Tarihi:</span>
                    <span className="text-white">
                      {stationDetails?.additionalInfo?.foundedDate}
                    </span>
                  </div>
                )}
                {stationDetails?.additionalInfo?.owner && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sahibi:</span>
                    <span className="text-white">
                      {stationDetails?.additionalInfo?.owner}
                    </span>
                  </div>
                )}
                {stationDetails?.additionalInfo?.slogan && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Slogan:</span>
                    <span className="text-white italic">
                      {stationDetails?.additionalInfo?.slogan}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Info Section */}
          {(stationDetails?.contact?.address ||
            stationDetails?.contact?.phone ||
            stationDetails?.contact?.website) && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">İletişim</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-4">
                {stationDetails?.contact?.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">
                      {stationDetails?.contact?.address}
                    </span>
                  </div>
                )}
                {stationDetails?.contact?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <a
                      href={`tel:${stationDetails?.contact?.phone}`}
                      className="text-blue-400 hover:underline"
                    >
                      {stationDetails?.contact?.phone}
                    </a>
                  </div>
                )}
                {stationDetails?.contact?.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <a
                      href={stationDetails?.contact?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline truncate"
                    >
                      {stationDetails?.contact?.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Media Section */}
          {(stationDetails?.socialMedia?.facebook ||
            stationDetails?.socialMedia?.twitter ||
            stationDetails?.socialMedia?.instagram) && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Sosyal Medya</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="flex justify-center space-x-6">
                  {stationDetails?.socialMedia?.facebook && (
                    <a
                      href={stationDetails?.socialMedia?.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Facebook className="h-6 w-6 text-white" />
                    </a>
                  )}
                  {stationDetails?.socialMedia?.twitter && (
                    <a
                      href={stationDetails?.socialMedia?.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Twitter className="h-6 w-6 text-white" />
                    </a>
                  )}
                  {stationDetails?.socialMedia?.instagram && (
                    <a
                      href={stationDetails?.socialMedia?.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Instagram className="h-6 w-6 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Location Section */}
          {stationDetails?.location && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Konum</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-2">
                {stationDetails?.location?.city && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Şehir:</span>
                    <span className="text-white">
                      {stationDetails?.location?.city}
                    </span>
                  </div>
                )}
                {stationDetails?.location?.region && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bölge:</span>
                    <span className="text-white">
                      {stationDetails?.location?.region}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Information Source Links */}
          {stationDetails?.informationSourceLinks && 
           stationDetails.informationSourceLinks.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Kaynaklar</h2>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 space-y-3">
                {stationDetails.informationSourceLinks
                  .filter(link => link !== null && link.trim() !== "")
                  .map((link, index) => (
                    <div key={index} className="flex items-center">
                      <Globe className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <a
                        href={link || ""}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline truncate"
                      >
                        {link}
                      </a>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* Similar Stations */}
          {similarStations.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">
                {station.stationName} ile Benzer İstasyonlar
              </h2>
              <div className="space-y-3">
                {similarStations.map((similarStation) => (
                  <motion.div
                    key={similarStation.stationName}
                    className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                    whileTap={{ scale: 0.98 }}
                    onClick={() =>
                      togglePlay(similarStation, [station, ...similarStations], `Benzer İstasyonlar - ${station.stationName}`)
                    }
                  >
                    <div className="relative mr-4">
                      <StationIcon
                        stationIconUrl={similarStation.stationIconUrl}
                        stationName={similarStation.stationName}
                        size="md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">
                        {similarStation.stationName}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">
                        {similarStation.stationCity}
                      </p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <AddToPlaylist station={similarStation} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}