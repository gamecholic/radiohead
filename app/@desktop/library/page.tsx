"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  History,
  Play,
  Pause,
  Plus,
  MoreHorizontal,
  ListMusic,
  Pencil,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLibrary } from "@/contexts/LibraryContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useAudio } from "@/contexts/AudioContext";
import { Playlist } from "@/lib/types";
import { StationIcon } from "@/components/station-icon";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("playlists");
  const [showNewPlaylistForm, setShowNewPlaylistForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [editingPlaylistName, setEditingPlaylistName] = useState("");
  const [deletingPlaylist, setDeletingPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "history") {
      setActiveTab("history");
    }
  }, [searchParams]);

  const {
    playlists,
    createNewPlaylist,
    updateExistingPlaylist,
    deleteExistingPlaylist,
  } = useLibrary();

  const { history, clearHistory } = useHistory();
  const { togglePlay, currentStation, isPlaying } = useAudio();

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        await createNewPlaylist(newPlaylistName.trim());
        setNewPlaylistName("");
        setShowNewPlaylistForm(false);
      } catch (error) {
        console.error("Failed to create playlist:", error);
      }
    }
  };

  const handleUpdatePlaylist = async () => {
    if (editingPlaylist && editingPlaylistName.trim()) {
      try {
        await updateExistingPlaylist(
          editingPlaylist.id,
          editingPlaylistName.trim()
        );
        setEditingPlaylist(null);
        setEditingPlaylistName("");
      } catch (error) {
        console.error("Failed to update playlist:", error);
      }
    }
  };

  const handleDeletePlaylist = async () => {
    if (deletingPlaylist) {
      try {
        await deleteExistingPlaylist(deletingPlaylist.id);
        setDeletingPlaylist(null);
      } catch (error) {
        console.error("Failed to delete playlist:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold">Kütüphane</h1>
        <p className="text-gray-400 mt-1">
          Çalma geçmişinizi ve çalma listelerinizi görüntüleyin
        </p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-800 p-2">
          <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1">
            <Button
              variant="ghost"
              className={`justify-start w-full ${activeTab === "playlists" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white button-hero-hover"}`}
              onClick={() => setActiveTab("playlists")}
            >
              <Play className="h-4 w-4 mr-2" />
              Çalma Listeleri
            </Button>
            <Button
              variant="ghost"
              className={`justify-start w-full ${activeTab === "history" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white button-hero-hover"}`}
              onClick={() => setActiveTab("history")}
            >
              <History className="h-4 w-4 mr-2" />
              Geçmiş
            </Button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full p-6">
            {activeTab === "history" ? (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Çalma Geçmişi</h2>
                  {history.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-400 border-blue-400/30 hover:bg-blue-400/10 button-hero-hover"
                      onClick={clearHistory}
                    >
                      Temizle
                    </Button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="bg-gray-800/50 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                      <History className="h-8 w-8" />
                    </div>
                    <p className="text-center">Henüz çalma geçmişiniz yok</p>
                    <p className="text-center text-sm mt-1">
                      Radyo istasyonlarını dinledikçe burada görünecek
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {history.map((station, index) => (
                      <motion.div
                        key={`${station.stationName}-${index}`}
                        className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative mr-3">
                          <StationIcon
                            stationIconUrl={station.stationIconUrl}
                            stationName={station.stationName}
                            size="sm"
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
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full bg-hero-gradient hover:opacity-90 flex-shrink-0"
                          onClick={() => togglePlay(station)}
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
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Çalma Listelerim</h2>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={() => setShowNewPlaylistForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Liste
                  </Button>
                </div>

                {/* Create Playlist Dialog */}
                <Dialog open={showNewPlaylistForm} onOpenChange={setShowNewPlaylistForm}>
                  <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Yeni Çalma Listesi</DialogTitle>
                      <DialogDescription>
                        Yeni bir çalma listesi oluşturun
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                          id="name"
                          placeholder="Çalma listesi adı"
                          className="col-span-4"
                          value={newPlaylistName}
                          onChange={(e) => setNewPlaylistName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleCreatePlaylist();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowNewPlaylistForm(false);
                          setNewPlaylistName("");
                        }}
                      >
                        İptal
                      </Button>
                      <Button
                        onClick={handleCreatePlaylist}
                        disabled={!newPlaylistName.trim()}
                      >
                        Oluştur
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Edit Playlist Dialog */}
                <Dialog open={!!editingPlaylist} onOpenChange={(open) => !open && setEditingPlaylist(null)}>
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
                          value={editingPlaylistName}
                          onChange={(e) => setEditingPlaylistName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleUpdatePlaylist();
                            }
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setEditingPlaylist(null)}
                      >
                        İptal
                      </Button>
                      <Button
                        onClick={handleUpdatePlaylist}
                        disabled={!editingPlaylistName.trim()}
                      >
                        Güncelle
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Delete Playlist Dialog */}
                <Dialog open={!!deletingPlaylist} onOpenChange={(open) => !open && setDeletingPlaylist(null)}>
                  <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
                    <DialogHeader>
                      <DialogTitle>Çalma Listesini Sil</DialogTitle>
                      <DialogDescription>
                        Bu işlem geri alınamaz. &quot;{deletingPlaylist?.name}&quot; çalma listesini silmek istediğinizden emin misiniz?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setDeletingPlaylist(null)}
                      >
                        İptal
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeletePlaylist}
                      >
                        Sil
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {playlists.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <div className="bg-gray-800/50 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                      <Play className="h-8 w-8" />
                    </div>
                    <p className="text-center">Henüz çalma listeniz yok</p>
                    <p className="text-center text-sm mt-1">
                      İlk çalma listenizi oluşturmak için &quot;Yeni Liste&quot;
                      butonuna tıklayın
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {playlists.map((playlist: Playlist) => (
                      <Link
                        key={playlist.id}
                        href={`/library/${playlist.id}`}
                        className="block"
                      >
                        <div className="group relative flex flex-col h-full rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition-colors overflow-hidden">
                          {/* Dark overlay on hover */}
                          <div className="absolute inset-0 bg-black/30 rounded-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          
                          <div className="bg-hero-gradient h-32 flex items-center justify-center relative">
                            <ListMusic className="h-12 w-12 text-white" />
                            
                            {/* Play button overlay */}
                            {playlist.stations.length > 0 && (
                              <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  className="h-12 w-12 rounded-full bg-white/70 hover:bg-white/90 hover:cursor-pointer"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    togglePlay(
                                      playlist.stations[0],
                                      playlist.stations,
                                      playlist.name
                                    );
                                  }}
                                >
                                  {currentStation?.stationName === playlist.stations[0].stationName &&
                                  isPlaying ? (
                                    <Pause className="h-6 w-6 text-black" />
                                  ) : (
                                    <Play className="h-6 w-6 text-black" />
                                  )}
                                </Button>
                              </div>
                            )}
                          </div>
                          
                          <div className="p-4 flex-1 flex flex-col relative z-10">
                            <div className="flex-1">
                              <h3 className="font-bold truncate text-lg">
                                {playlist.name}
                              </h3>
                              <p className="text-sm text-gray-400 mt-1">
                                {playlist.stations.length} istasyon
                              </p>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="rounded-full mr-1 button-hero-hover"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEditingPlaylist(playlist);
                                    setEditingPlaylistName(playlist.name);
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="rounded-full button-hero-hover"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDeletingPlaylist(playlist);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full button-hero-hover"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  // This will navigate to the playlist detail page
                                  window.location.href = `/library/${playlist.id}`;
                                }}
                              >
                                <MoreHorizontal className="h-5 w-5 text-gray-400" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
