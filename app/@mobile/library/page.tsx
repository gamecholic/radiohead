"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  History,
  PlayCircle,
  Clock,
  Plus,
  MoreHorizontal,
  X,
  ListMusic,
  Pencil,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLibrary } from "@/contexts/LibraryContext";
import { useHistory } from "@/contexts/HistoryContext";
import { useAudio } from "@/contexts/AudioContext";
import { Playlist } from "@/lib/types";

export default function MobileLibrary() {
  const [activeTab, setActiveTab] = useState("history");
  const [showNewPlaylistForm, setShowNewPlaylistForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingPlaylistId, setEditingPlaylistId] = useState<string | null>(
    null
  );
  const [editingPlaylistName, setEditingPlaylistName] = useState("");

  const {
    playlists,
    createNewPlaylist,
    updateExistingPlaylist,
    deleteExistingPlaylist: _, // Mark as unused
  } = useLibrary();

  const { history, clearHistory } = useHistory();

  const { togglePlay } = useAudio();

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
    if (editingPlaylistId && editingPlaylistName.trim()) {
      try {
        await updateExistingPlaylist(
          editingPlaylistId,
          editingPlaylistName.trim()
        );
        setEditingPlaylistId(null);
        setEditingPlaylistName("");
      } catch (error) {
        console.error("Failed to update playlist:", error);
      }
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-b from-gray-900 to-black text-white h-full">
      <ScrollArea className="flex-1">
        <div className="px-4 pb-16">
          <div className="mt-4 mb-6">
            <h1 className="text-2xl font-bold">Kütüphane</h1>
            <p className="text-gray-400">
              Çalma geçmişinizi ve çalma listelerinizi görüntüleyin
            </p>
          </div>

          <div className="flex border-b border-gray-800">
            <Button
              variant="ghost"
              className={`flex-1 rounded-none py-4 ${
                activeTab === "history"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("history")}
            >
              <History className="h-4 w-4 mr-2" />
              Geçmiş
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 rounded-none py-4 ${
                activeTab === "playlists"
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("playlists")}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Çalma Listeleri
            </Button>
          </div>

          <div className="mt-4">
            {activeTab === "history" ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Çalma Geçmişi</h2>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400"
                      onClick={clearHistory}
                    >
                      Temizle
                    </Button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="bg-gray-800 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                      <History className="h-8 w-8" />
                    </div>
                    <p className="text-center">Henüz çalma geçmişiniz yok</p>
                    <p className="text-center text-sm mt-1">
                      Radyo istasyonlarını dinledikçe burada görünecek
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((station, index) => (
                      <motion.div
                        key={`${station.stationName}-${index}`}
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
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-full"
                          onClick={() => togglePlay(station)}
                        >
                          <PlayCircle className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Çalma Listelerim</h2>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600"
                    onClick={() => setShowNewPlaylistForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Yeni
                  </Button>
                </div>

                {showNewPlaylistForm && (
                  <div className="mb-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Yeni Çalma Listesi</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setShowNewPlaylistForm(false);
                          setNewPlaylistName("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Çalma listesi adı"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="mb-3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleCreatePlaylist();
                        }
                      }}
                    />
                    <Button
                      className="w-full"
                      onClick={handleCreatePlaylist}
                      disabled={!newPlaylistName.trim()}
                    >
                      Oluştur
                    </Button>
                  </div>
                )}

                {editingPlaylistId && (
                  <div className="mb-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Çalma Listesini Düzenle</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingPlaylistId(null);
                          setEditingPlaylistName("");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      placeholder="Çalma listesi adı"
                      value={editingPlaylistName}
                      onChange={(e) => setEditingPlaylistName(e.target.value)}
                      className="mb-3"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUpdatePlaylist();
                        }
                      }}
                    />
                    <Button
                      className="w-full"
                      onClick={handleUpdatePlaylist}
                      disabled={!editingPlaylistName.trim()}
                    >
                      Güncelle
                    </Button>
                  </div>
                )}

                {playlists.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <div className="bg-gray-800 border-2 border-dashed rounded-xl w-16 h-16 mb-4 flex items-center justify-center">
                      <PlayCircle className="h-8 w-8" />
                    </div>
                    <p className="text-center">Henüz çalma listeniz yok</p>
                    <p className="text-center text-sm mt-1">
                      İlk çalma listenizi oluşturmak için &#34;Yeni&#34;
                      butonuna tıklayın
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {playlists.map((playlist: Playlist) => (
                      <Link
                        key={playlist.id}
                        href={`/library/${playlist.id}`}
                        className="block"
                      >
                        <div className="flex items-center p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl w-12 h-12 mr-3 flex items-center justify-center">
                            <ListMusic className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">
                              {playlist.name}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {playlist.stations.length} istasyon
                            </p>
                          </div>
                          <div className="flex items-center">
                            {playlist.stations.length > 0 && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full mr-1"
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
                                <PlayCircle className="h-5 w-5" />
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-full mr-1"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingPlaylistId(playlist.id);
                                setEditingPlaylistName(playlist.name);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <MoreHorizontal className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
