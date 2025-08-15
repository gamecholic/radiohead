"use client";

import { MobileMenu } from "@/components/layout/mobile-menu";
import { useState, useEffect } from "react";
import { Playlist } from "@/lib/localStorageHandler";
import { RadioStation } from "@/lib/types";
import { StationIcon } from "@/components/station-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  Play, 
  MoreVertical,
  Trash2,
  Radio
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAudio } from "@/contexts/AudioContext";
import { usePlaylists } from "@/contexts/PlaylistContext";
import { MoreHorizontal } from "lucide-react";

export default function LibraryPage() {
  const { togglePlay } = useAudio();
  const { 
    playlists, 
    isLoading, 
    error, 
    loadPlaylists, 
    createPlaylist, 
    deletePlaylist, 
    removeStationFromPlaylist 
  } = usePlaylists();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  useEffect(() => {
    loadPlaylists("temp-user");
  }, []);

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    try {
      setIsCreatingPlaylist(true);
      // Create new playlist
      await createPlaylist("temp-user", newPlaylistName);
      setNewPlaylistName("");
      setIsCreatingPlaylist(false);
    } catch (error) {
      console.error("Error creating playlist:", error);
      setIsCreatingPlaylist(false);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist("temp-user", playlistId);
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handlePlayStation = (station: RadioStation, stations: RadioStation[]) => {
    togglePlay(station, stations, "Çalma Listesi");
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-gray-800 bg-black/20 p-4 backdrop-blur-md md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-white">Kütüphane</h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Kütüphane</h1>
              <p className="text-gray-400">
                Özel çalma listelerinizi burada yönetin
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-2">
              <Input
                placeholder="Yeni çalma listesi adı"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                className="bg-gray-800/50 border-gray-700 text-white max-w-xs"
              />
              <Button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim() || isCreatingPlaylist}
                className="bg-hero-gradient hover:opacity-90"
              >
                {isCreatingPlaylist ? (
                  <span>Oluşturuluyor...</span>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    <span>Oluştur</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : playlists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <div 
                  key={playlist.id} 
                  className="bg-gray-800/30 border border-gray-700 rounded-xl overflow-hidden hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg truncate">{playlist.name}</h3>
                        <p className="text-sm text-gray-400">
                          {playlist.stations.length} istasyon • {formatDate(playlist.updatedAt)}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                          <DropdownMenuItem 
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            className="text-red-400 focus:bg-red-900/20 focus:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    {playlist.stations.length > 0 ? (
                      <>
                        <div className="space-y-3 mb-4">
                          {playlist.stations.slice(0, 3).map((station, index) => (
                            <div 
                              key={station.stationName} 
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer group"
                            >
                              <div className="relative">
                                <StationIcon
                                  stationIconUrl={station.stationIconUrl}
                                  stationName={station.stationName}
                                  size="xxs"
                                />
                                {index === 0 && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Play className="h-3 w-3 text-white" fill="white" />
                                  </div>
                                )}
                              </div>
                              <div 
                                className="flex-1 min-w-0 cursor-pointer"
                                onClick={() => handlePlayStation(station, playlist.stations)}
                              >
                                <p className="text-sm font-medium truncate">{station.stationName}</p>
                                <p className="text-xs text-gray-400 truncate">
                                  {station.radioGroups[0] || "Radyo İstasyonu"}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800">
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeStationFromPlaylist("temp-user", playlist.id, station.stationName);
                                    }}
                                    className="text-red-400 focus:bg-red-900/20 focus:text-red-400"
                                  >
                                    <Trash2 className="h-3 w-3 mr-2" />
                                    Çalma Listesinden Kaldır
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          ))}
                          {playlist.stations.length > 3 && (
                            <div className="text-xs text-gray-400 text-center py-2">
                              +{playlist.stations.length - 3} daha fazla
                            </div>
                          )}
                        </div>
                        <Button
                          className="w-full bg-hero-gradient hover:opacity-90"
                          size="sm"
                          onClick={() => handlePlayStation(playlist.stations[0], playlist.stations)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Çal
                        </Button>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <Radio className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                        <p className="text-gray-500 text-sm">
                          Bu çalma listesi boş
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 text-center">
              <Radio className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Henüz çalma listeniz yok</h3>
              <p className="text-gray-400 mb-6">
                Yeni bir çalma listesi oluşturarak favori istasyonlarınızı ekleyin.
              </p>
              <div className="max-w-md mx-auto flex space-x-2">
                <Input
                  placeholder="Çalma listesi adı"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
                <Button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim() || isCreatingPlaylist}
                  className="bg-hero-gradient hover:opacity-90 whitespace-nowrap"
                >
                  {isCreatingPlaylist ? "Oluşturuluyor..." : "Oluştur"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </div>
  );
}

