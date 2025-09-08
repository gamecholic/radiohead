"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  PlayCircle,
  Check,
  PlusCircle,
  Music4,
  ListMusic,
} from "lucide-react";
import { useLibrary } from "@/contexts/LibraryContext";
import { Station, Playlist } from "@/lib/types";

interface AddToPlaylistProps {
  station: Station;
  trigger?: React.ReactNode;
}

export function AddToPlaylist({ station, trigger }: AddToPlaylistProps) {
  const [open, setOpen] = useState(false);
  const [newPlaylistOpen, setNewPlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null
  );

  const {
    playlists,
    addStationToExistingPlaylist,
    createNewPlaylist,
    refreshPlaylists,
  } = useLibrary();

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      await addStationToExistingPlaylist(playlistId, station);
      setSelectedPlaylistId(playlistId);
      // Close the dialog after a short delay
      setTimeout(() => {
        setOpen(false);
        setSelectedPlaylistId(null);
      }, 1000);
    } catch (error) {
      console.error("Failed to add station to playlist:", error);
    }
  };

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      try {
        const newPlaylist = await createNewPlaylist(newPlaylistName.trim(), [
          station,
        ]);
        // Refresh playlists to show the new one
        await refreshPlaylists();
        setNewPlaylistName("");
        setNewPlaylistOpen(false);
        setOpen(false);
      } catch (error) {
        console.error("Failed to create playlist:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => e.stopPropagation()}
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-800 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Çalma listesine ekle</DialogTitle>
        </DialogHeader>

        {newPlaylistOpen ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Yeni Çalma Listesi</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewPlaylistOpen(false)}
              >
                İptal
              </Button>
            </div>
            <Input
              placeholder="Çalma listesi adı"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
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
              <Plus className="h-4 w-4 mr-2" />
              Oluştur ve Ekle
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full button-hero-hover"
              onClick={() => setNewPlaylistOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Yeni Çalma Listesi Oluştur
            </Button>

            {playlists.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Henüz çalma listeniz yok</p>
                <p className="text-sm mt-1">
                  Yukarıdan yeni bir tane oluşturun
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto p-4">
                {playlists.map((playlist: Playlist) => {
                  const isAlreadyInPlaylist = playlist.stations.some(
                    (s) => s.stationName === station.stationName
                  );

                  return (
                    <Button
                      key={playlist.id}
                      variant="ghost"
                      className="w-full justify-between button-hero-hover"
                      onClick={() =>
                        !isAlreadyInPlaylist && handleAddToPlaylist(playlist.id)
                      }
                      disabled={isAlreadyInPlaylist}
                    >
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg w-8 h-8 mr-3 flex items-center justify-center">
                          <ListMusic className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{playlist.name}</div>
                          <div className="text-xs text-gray-400">
                            {playlist.stations.length} istasyon
                          </div>
                        </div>
                      </div>
                      {isAlreadyInPlaylist ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : selectedPlaylistId === playlist.id ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Plus className="h-5 w-5" />
                      )}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
