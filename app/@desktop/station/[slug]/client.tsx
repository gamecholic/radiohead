"use client";

import { useState, useEffect } from "react";
import { StationIcon } from "@/components/station-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Carousel } from "@/components/carousel/carousel";
import {
  Play,
  Pause,
  Star,
  Share2,
  MapPin,
  Phone,
  Globe,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import { useAudio } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Station } from "@/lib/types";
import Script from "next/script";
import { generateStationStructuredData } from "@/lib/utils/structuredDataGenerators";
import { StationDetails } from "@/lib/types";

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

  // Structured data for SEO
  const stationStructuredData = generateStationStructuredData(station);

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
    <>
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full pb-16">
          <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
            {/* Station Header */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <StationIcon
                  stationIconUrl={station.stationIconUrl}
                  stationName={station.stationName}
                  size="lg"
                  priority={true}
                />
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {station.stationName}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {station.stationCategories.map((category, index) => (
                      <div
                        key={index}
                        className="bg-white/10 rounded-full px-3 py-1 text-sm"
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-4">
                    {stationDetails?.description?.substring(0, 200)}...
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="h-12 px-6 rounded-full bg-hero-gradient hover:opacity-90"
                      size="lg"
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
                    <Button
                      variant="outline"
                      className="h-12 px-6 rounded-full border-white/20 hover:bg-white/10"
                      size="lg"
                      onClick={handleFavoriteToggle}
                    >
                      <Star
                        className={`h-5 w-5 mr-2 ${
                          isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                      {isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12 px-6 rounded-full border-white/20 hover:bg-white/10"
                      size="lg"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Paylaş
                    </Button>
                  </div>
                </div>
              </div>

              <div className="h-1 w-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-white">
                      Hakkında
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      {stationDetails?.description ||
                        "Bu istasyon hakkında detaylı bilgi bulunmamaktadır."}
                    </p>
                  </CardContent>
                </Card>

                {/* Frequencies */}
                {stationDetails?.frequencies &&
                  stationDetails?.frequencies?.length > 0 && (
                    <Card className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">
                          Frekanslar
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {stationDetails?.frequencies?.map((freq, index) => (
                            <div
                              key={index}
                              className="bg-white/5 rounded-lg p-3 text-center"
                            >
                              <span className="text-sm text-gray-300">
                                {freq}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Additional Info */}
                {(stationDetails?.additionalInfo?.foundedDate ||
                  stationDetails?.additionalInfo?.owner ||
                  stationDetails?.additionalInfo?.slogan) && (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">
                        Ek Bilgiler
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {stationDetails?.additionalInfo?.foundedDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Kuruluş Tarihi:
                            </span>
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
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                {(stationDetails?.contact?.address ||
                  stationDetails?.contact?.phone ||
                  stationDetails?.contact?.website) && (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">
                        İletişim
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
                    </CardContent>
                  </Card>
                )}

                {/* Social Media */}
                {(stationDetails?.socialMedia?.facebook ||
                  stationDetails?.socialMedia?.twitter ||
                  stationDetails?.socialMedia?.instagram) && (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">
                        Sosyal Medya
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4">
                        {stationDetails?.socialMedia?.facebook && (
                          <a
                            href={stationDetails?.socialMedia?.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Facebook className="h-5 w-5 text-white" />
                          </a>
                        )}
                        {stationDetails?.socialMedia?.twitter && (
                          <a
                            href={stationDetails?.socialMedia?.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Twitter className="h-5 w-5 text-white" />
                          </a>
                        )}
                        {stationDetails?.socialMedia?.instagram && (
                          <a
                            href={stationDetails?.socialMedia?.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                          >
                            <Instagram className="h-5 w-5 text-white" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Location */}
                {stationDetails?.location && (
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-white">
                        Konum
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
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
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Similar Stations */}
            {similarStations.length > 0 && (
              <div className="mt-8">
                <Carousel
                  title={`${station.stationName} ile Benzer İstasyonlar`}
                  stations={[station, ...similarStations]}
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Structured Data for SEO */}
      <Script
        id={`station-${station.slug}-structured-data`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(stationStructuredData),
        }}
      />
    </>
  );
}
