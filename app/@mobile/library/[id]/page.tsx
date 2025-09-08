"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { PlayCircle, ArrowLeft, MoreHorizontal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useLibrary } from "@/contexts/LibraryContext";
import { useAudio } from "@/contexts/AudioContext";
import { Station, Playlist } from "@/lib/types";

export default function PlaylistDetail() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  const {
    playlists,
    removeStationFromExistingPlaylist,
    deleteExistingPlaylist,
  } = useLibrary();

  const { togglePlay } = useAudio();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (playlists.length > 0 && playlistId) {
      const foundPlaylist = playlists.find((p) => p.id === playlistId);
      setPlaylist(foundPlaylist || null);
    }
  }, [playlists, playlistId]);

  const handleRemoveStation = async (stationName: string) => {
    if (playlistId) {
      try {
        await removeStationFromExistingPlaylist(playlistId, stationName);
      } catch (error) {
        console.error("Failed to remove station from playlist:", error);
      }
    }
  };

  const handleDeletePlaylist = async () => {
    if (playlistId) {
      try {
        await deleteExistingPlaylist(playlistId);
        // Redirect to library page after deletion
        router.push("/library");
      } catch (error) {
        console.error("Failed to delete playlist:", error);
      }
    }
  };

  if (!playlist) {
    return (
      <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white h-full">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <Link href="/library">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Çalma Listesi</h1>
          </div>
          <div className="flex items-center justify-center h-64">
            <p>Çalma listesi bulunamadı</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white h-full">
      <ScrollArea className="flex-1 pb-16">
        <div className="px-4 py-4">
          <div className="flex items-center mb-4">
            <Link href="/library">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold truncate mr-2">{playlist.name}</h1>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          {showDeleteConfirm && (
            <div className="mb-4 p-4 rounded-xl bg-red-900/50 backdrop-blur-sm border border-red-800">
              <p className="mb-3">
                Bu çalma listesini silmek istediğinizden emin misiniz?
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="flex-1 border-red-500 text-red-500 hover:bg-red-500/20"
                  onClick={handleDeletePlaylist}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Sil
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  İptal
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">{playlist.stations.length} istasyon</p>
            {playlist.stations.length > 0 && (
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600"
                onClick={() =>
                  togglePlay(
                    playlist.stations[0],
                    playlist.stations,
                    playlist.name
                  )
                }
              >
                <PlayCircle className="h-4 w-4 mr-1" />
                Çal
              </Button>
            )}
          </div>

          {playlist.stations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="bg-gray-800 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                <PlayCircle className="h-8 w-8" />
              </div>
              <p className="text-center">
                Bu çalma listesinde henüz istasyon yok
              </p>
              <p className="text-center text-sm mt-1">
                İstasyon eklemek için diğer sayfalardaki menüleri kullanın
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {playlist.stations.map((station: Station) => (
                <motion.div
                  key={station.stationName}
                  className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative mr-3">
                    {station.stationIconUrl ? (
                      <img
                        src={station.stationIconUrl}
                        alt={station.stationName}
                        className="w-12 h-12 rounded-xl object-contain p-1"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.parentElement!.innerHTML = `
                            <div class="w-12 h-12 rounded-xl bg-gray-800 border-2 border-dashed flex items-center justify-center">
                              <span class="text-xs font-bold text-gray-400">${station.stationName.charAt(
                                0
                              )}</span>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-800 border-2 border-dashed flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-400">
                          {station.stationName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">
                      {station.stationName}
                    </h3>
                    {station.stationCity && (
                      <p className="text-sm text-gray-400 truncate">
                        {station.stationCity}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full mr-1"
                      onClick={() =>
                        togglePlay(station, playlist.stations, playlist.name)
                      }
                    >
                      <PlayCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full"
                      onClick={() => handleRemoveStation(station.stationName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
