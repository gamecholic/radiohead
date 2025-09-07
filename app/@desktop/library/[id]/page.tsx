"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Play,
  Pause,
  ArrowLeft,
  MoreHorizontal,
  Trash2,
  Edit3,
  Search,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLibrary } from "@/contexts/LibraryContext";
import { useAudio } from "@/contexts/AudioContext";
import { Station, Playlist } from "@/lib/types";
import { StationIcon } from "@/components/station-icon";
import { searchStations } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PlaylistDetail() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;

  const {
    playlists,
    removeStationFromExistingPlaylist,
    deleteExistingPlaylist,
    updateExistingPlaylist,
    addStationToExistingPlaylist,
  } = useLibrary();

  const { togglePlay, currentStation, isPlaying } = useAudio();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [showAddStationDialog, setShowAddStationDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStations, setSelectedStations] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (playlists.length > 0 && playlistId) {
      const foundPlaylist = playlists.find((p) => p.id === playlistId);
      setPlaylist(foundPlaylist || null);
      if (foundPlaylist) {
        setEditName(foundPlaylist.name);
      }
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

  const handleUpdatePlaylist = async () => {
    if (playlistId && editName.trim()) {
      try {
        await updateExistingPlaylist(playlistId, editName.trim());
        setShowEditDialog(false);
      } catch (error) {
        console.error("Failed to update playlist:", error);
      }
    }
  };

  const handleSearchStations = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStations(query);
      // Filter out stations that are already in the playlist
      const filteredResults = results.filter(
        (station) =>
          !playlist?.stations.some((s) => s.stationName === station.stationName)
      );
      setSearchResults(filteredResults);
    } catch (error) {
      console.error("Error searching stations:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleStationSelect = (stationName: string) => {
    const newSelected = new Set(selectedStations);
    if (newSelected.has(stationName)) {
      newSelected.delete(stationName);
    } else {
      newSelected.add(stationName);
    }
    setSelectedStations(newSelected);
  };

  const handleAddStationsToPlaylist = async () => {
    if (!playlistId || selectedStations.size === 0) return;

    try {
      // Find the full station objects from search results
      const stationsToAdd = searchResults.filter((station) =>
        selectedStations.has(station.stationName)
      );

      // Add each selected station to the playlist
      for (const station of stationsToAdd) {
        await addStationToExistingPlaylist(playlistId, station);
      }

      // Clear selection and close dialog
      setSelectedStations(new Set());
      setSearchQuery("");
      setSearchResults([]);
      setShowAddStationDialog(false);
    } catch (error) {
      console.error("Failed to add stations to playlist:", error);
    }
  };

  if (!playlist) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center">
            <Link href="/library">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Çalma Listesi</h1>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <p>Çalma listesi bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center mb-4">
          <Link href="/library">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 button-hero-hover"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold truncate mr-4">{playlist.name}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto mr-2 button-hero-hover"
            onClick={() => {
              setShowEditDialog(true);
              setEditName(playlist.name);
            }}
          >
            <Edit3 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="button-hero-hover"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-gray-400">{playlist.stations.length} istasyon</p>
          <div className="flex space-x-2">
            <Button
              className="h-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={() => setShowAddStationDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              İstasyon Ekle
            </Button>
            {playlist.stations.length > 0 && (
              <Button
                className="h-8 w-8 rounded-full bg-hero-gradient hover:opacity-90 flex-shrink-0"
                size="icon"
                onClick={() =>
                  togglePlay(
                    playlist.stations[0],
                    playlist.stations,
                    playlist.name
                  )
                }
              >
                {currentStation?.stationName ===
                  playlist.stations[0].stationName && isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Playlist Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Çalma Listesini Düzenle</DialogTitle>
            <DialogDescription>
              Çalma listesinin adını değiştirin
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="name"
                placeholder="Çalma listesi adı"
                className="col-span-4"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUpdatePlaylist();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              İptal
            </Button>
            <Button
              onClick={handleUpdatePlaylist}
              disabled={!editName.trim() || editName.trim() === playlist.name}
            >
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Playlist Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle>Çalma Listesini Sil</DialogTitle>
            <DialogDescription>
              Bu işlem geri alınamaz. &apos;{playlist.name}&apos; çalma
              listesini silmek istediğinizden emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeletePlaylist}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Station Dialog */}
      <Dialog open={showAddStationDialog} onOpenChange={(open) => {
        setShowAddStationDialog(open);
        if (!open) {
          // Reset search when closing
          setSearchQuery("");
          setSearchResults([]);
          setSelectedStations(new Set());
        }
      }}>
        <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>İstasyon Ekle</DialogTitle>
            <DialogDescription>
              Çalma listenize eklemek için istasyon arayın
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Search Input */}
            <div className="relative mb-4">
              <Input
                placeholder="İstasyon adı, şehir veya kategori ara..."
                value={searchQuery}
                onChange={(e) => handleSearchStations(e.target.value)}
                className="pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                >
                  ×
                </Button>
              )}
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-hidden min-h-[300px]">
              {isSearching ? (
                <div className="flex items-center justify-center h-full">
                  <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <ScrollArea className="h-full w-full pr-4 max-h-[400px]">
                  <div className="space-y-2">
                    {searchResults.map((station) => (
                      <div
                        key={station.stationName}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedStations.has(station.stationName)
                            ? "bg-blue-500/20 border-blue-500"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => handleStationSelect(station.stationName)}
                      >
                        <div className="relative mr-3">
                          <StationIcon
                            stationIconUrl={station.stationIconUrl}
                            stationName={station.stationName}
                            size="xs"
                          />
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
                        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                          {selectedStations.has(station.stationName) && (
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : searchQuery.trim() !== "" ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="bg-gray-800/50 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                    <Play className="h-8 w-8" />
                  </div>
                  <p>İstasyon bulunamadı</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="bg-gray-800/50 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                    <Search className="h-8 w-8" />
                  </div>
                  <p>İstasyon aramak için bir şeyler yazın</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAddStationDialog(false)}
            >
              İptal
            </Button>
            <Button
              onClick={handleAddStationsToPlaylist}
              disabled={selectedStations.size === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ekle ({selectedStations.size})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full p-6">
          {playlist.stations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div className="bg-gray-800/50 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                <Play className="h-8 w-8" />
              </div>
              <p className="text-center">
                Bu çalma listesinde henüz istasyon yok
              </p>
              <p className="text-center text-sm mt-1">
                İstasyon eklemek için aşağıdaki &quot;İstasyon Ekle&quot; butonunu
                kullanın
              </p>
              <Button
                className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => setShowAddStationDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                İstasyon Ekle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlist.stations.map((station: Station) => (
                <motion.div
                  key={station.stationName}
                  className="flex flex-col h-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors overflow-hidden"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="p-4">
                    <div className="flex justify-center mb-3">
                      <StationIcon
                        stationIconUrl={station.stationIconUrl}
                        stationName={station.stationName}
                        size="lg"
                      />
                    </div>
                    <h3 className="font-bold truncate text-center">
                      {station.stationName}
                    </h3>
                    {station.stationCity && (
                      <p className="text-sm text-gray-400 truncate text-center mt-1">
                        {station.stationCity}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 border-t border-white/10 mt-auto">
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full bg-hero-gradient hover:opacity-90 flex-shrink-0"
                      onClick={() =>
                        togglePlay(station, playlist.stations, playlist.name)
                      }
                    >
                      {currentStation?.stationName === station.stationName &&
                      isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full button-hero-hover"
                      onClick={() => handleRemoveStation(station.stationName)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <MoreHorizontal className="h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
