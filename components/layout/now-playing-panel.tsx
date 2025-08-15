"use client";

import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  ListMusic,
  Radio,
  Star,
  MoreVertical,
  AlertTriangle,
  Plus,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StationIcon } from "@/components/station-icon";
import { useAudio, Station } from "@/contexts/AudioContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { usePlaylists } from "@/contexts/PlaylistContext";
import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function NowPlayingPanel() {
  const {
    currentStation,
    isPlaying,
    volume,
    stationList,
    stationListSource,
    togglePlay,
    setVolume,
    updateVolume,
    playNext,
    playPrevious,
    isIOSSafari, // Use iOS detection from context
  } = useAudio();

  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const { playlists, loadPlaylists, createPlaylist, addStationToPlaylist } =
    usePlaylists();
  const [isFavorite, setIsFavorite] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
  const volumeAreaRef = useRef<HTMLDivElement>(null);

  // Check if the current station is a favorite when it changes or when favorites update
  useEffect(() => {
    if (currentStation) {
      const favoriteStatus = favorites.some(
        (fav) => fav.stationName === currentStation.stationName
      );
      setIsFavorite(favoriteStatus);
    }
  }, [currentStation, favorites]);

  // Load user playlists
  useEffect(() => {
    loadPlaylists("temp-user");
  }, []);

  // Reload playlists when dialog opens
  useEffect(() => {
    if (isAddToPlaylistOpen) {
      loadPlaylists("temp-user");
    }
  }, [isAddToPlaylistOpen]);

  // Handle mouse wheel volume control
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isVolumeHovered || isIOSSafari) return;

      e.preventDefault();
      const delta = e.deltaY > 0 ? -5 : 5;
      const newVolume = Math.min(100, Math.max(0, volume + delta));
      updateVolume(newVolume);
      setVolume(newVolume);
    };

    const volumeArea = volumeAreaRef.current;
    if (volumeArea) {
      volumeArea.addEventListener("wheel", handleWheel, { passive: false });
      return () => volumeArea.removeEventListener("wheel", handleWheel);
    }
  }, [isVolumeHovered, volume, isIOSSafari, updateVolume, setVolume]);

  if (!currentStation) return null;

  const handleStationSelect = (station: Station) => {
    togglePlay(station, stationList, stationListSource ?? undefined);
  };

  const toggleFavorite = async () => {
    if (!currentStation) return;

    if (isFavorite) {
      await removeFavorite(currentStation.stationName);
    } else {
      await addFavorite(currentStation);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPreviousVolume(volume);
      setVolume(0);
    } else {
      setVolume(previousVolume);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!currentStation) return;

    try {
      await addStationToPlaylist("temp-user", playlistId, currentStation);
      setIsAddToPlaylistOpen(false);
    } catch (error) {
      console.error("Error adding station to playlist:", error);
    }
  };

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

  return (
    <div className="border-t border-gray-800 bg-black/20 backdrop-blur-md absolute bottom-0 left-0 right-0 z-50">
      <div className="w-full max-w-6xl mx-auto">
        {/* Desktop view */}
        <div className="hidden md:flex items-center justify-between p-4">
          <div className="flex items-center space-x-4 w-1/3">
            <StationIcon
              stationIconUrl={currentStation.stationIconUrl}
              stationName={currentStation.stationName}
              size="sm"
            />
            <div className="min-w-0">
              <h3 className="font-semibold truncate">
                {currentStation.stationName}
              </h3>
              <p className="text-sm text-white/70 truncate">
                {currentStation.radioGroups[0] || "Radyo İstasyonu"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover"
              onClick={toggleFavorite}
            >
              <Star
                className={`h-5 w-5 ${
                  isFavorite ? "fill-yellow-400 text-yellow-400" : "text-white"
                }`}
              />
            </Button>
            <Dialog
              open={isAddToPlaylistOpen}
              onOpenChange={setIsAddToPlaylistOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="button-hero-hover"
                  disabled={!currentStation}
                >
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-black/90 backdrop-blur-md border-gray-800 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle>Çalma Listesine Ekle</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    {currentStation?.stationName} istasyonunu eklemek
                    istediğiniz çalma listesini seçin.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Yeni çalma listesi adı"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="flex-1 bg-gray-800 border-gray-700 text-white"
                    />
                    <Button
                      onClick={handleCreatePlaylist}
                      disabled={!newPlaylistName.trim() || isCreatingPlaylist}
                      className="bg-hero-gradient hover:opacity-90"
                    >
                      {isCreatingPlaylist ? "Oluşturuluyor..." : "Oluştur"}
                    </Button>
                  </div>
                  <ScrollArea className="h-60 rounded-md border border-gray-800">
                    {playlists.length > 0 ? (
                      playlists.map((playlist) => (
                        <div
                          key={playlist.id}
                          className="flex items-center justify-between p-3 hover:bg-white/10 cursor-pointer border-b border-gray-800 last:border-b-0"
                          onClick={() => handleAddToPlaylist(playlist.id)}
                        >
                          <div>
                            <h4 className="font-medium">{playlist.name}</h4>
                            <p className="text-sm text-gray-400">
                              {playlist.stations.length} istasyon
                            </p>
                          </div>
                          <Plus className="h-4 w-4 text-gray-400" />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-400">
                        Henüz çalma listeniz yok. Yukarıdan yeni bir tane
                        oluşturabilirsiniz.
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover"
              onClick={playPrevious}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              className="h-10 w-10 rounded-full bg-hero-gradient hover:opacity-90"
              size="icon"
              onClick={() => togglePlay(currentStation)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover"
              onClick={playNext}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="button-hero-hover"
                >
                  <ListMusic className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="center"
                className="w-64 p-0 bg-black/90 backdrop-blur-md border-gray-800"
              >
                <DropdownMenuLabel className="px-3 py-2 text-white/80 font-semibold">
                  Oynatma Listesi
                </DropdownMenuLabel>
                {stationListSource ? (
                  <DropdownMenuLabel className="px-3 py-1 text-xs text-white/60 font-normal flex items-center">
                    Kaynak: {stationListSource}
                  </DropdownMenuLabel>
                ) : (
                  <DropdownMenuLabel className="px-3 py-1 text-xs text-white/60 font-normal flex items-center">
                    Kaynak:{" "}
                    {currentStation?.radioGroups[0] || "Radyo İstasyonu"}
                  </DropdownMenuLabel>
                )}
                <DropdownMenuSeparator className="bg-gray-800" />
                <ScrollArea className="h-60 rounded-md">
                  {stationList.map((station) => (
                    <DropdownMenuItem
                      key={station.stationName}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer focus:bg-white/10 ${
                        station.stationName === currentStation.stationName
                          ? "bg-white/10"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => handleStationSelect(station)}
                    >
                      <div className="flex items-center space-x-2">
                        <StationIcon
                          stationIconUrl={station.stationIconUrl}
                          stationName={station.stationName}
                          size="xxs"
                        />
                        <span
                          className={`text-sm ${
                            station.stationName === currentStation.stationName
                              ? "font-semibold text-white"
                              : "text-white/80"
                          }`}
                        >
                          {station.stationName}
                        </span>
                      </div>
                      {station.stationName === currentStation.stationName && (
                        <Radio className="h-4 w-4 text-white animate-pulse" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div
            className="flex items-center space-x-2 w-1/3 justify-end"
            ref={volumeAreaRef}
            onMouseEnter={() => setIsVolumeHovered(true)}
            onMouseLeave={() => setIsVolumeHovered(false)}
          >
            {isIOSSafari && (
              <div
                className="flex items-center text-yellow-500 mr-2"
                title="iOS Safari'de ses kontrolü kullanılamaz"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="text-xs">Ses kontrolü yok</span>
              </div>
            )}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="button-hero-hover"
                onClick={toggleMute}
                disabled={isIOSSafari} // Disable mute button on iOS
              >
                {volume > 0 ? (
                  <Volume2 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
              {isIOSSafari && (
                <span
                  className="absolute -top-1 -right-1 text-yellow-500"
                  title="Not available on iOS Safari"
                >
                  <AlertTriangle className="h-3 w-3" />
                </span>
              )}
            </div>
            <Slider
              value={[volume]}
              onValueChange={([newVolume]) => updateVolume(newVolume)}
              onValueCommit={([newVolume]) => setVolume(newVolume)}
              max={100}
              step={1}
              className="w-24"
              disabled={isIOSSafari} // Disable slider on iOS
            />
          </div>
        </div>

        {/* Mobile view */}
        <div className="flex md:hidden items-center justify-between p-3">
          <div className="flex items-center space-x-3 w-1/2">
            <StationIcon
              stationIconUrl={currentStation.stationIconUrl}
              stationName={currentStation.stationName}
              size="xxs"
            />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate">
                {currentStation.stationName}
              </h3>
              <p className="text-xs text-white/70 truncate">
                {currentStation.radioGroups[0] || "Radyo İstasyonu"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover h-8 w-8"
              onClick={playPrevious}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              className="h-8 w-8 rounded-full bg-hero-gradient hover:opacity-90"
              size="icon"
              onClick={() => togglePlay(currentStation)}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="button-hero-hover h-8 w-8"
              onClick={playNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="button-hero-hover h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                align="end"
                className="w-56 p-0 bg-black/90 backdrop-blur-md border-gray-800"
              >
                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 cursor-pointer focus:bg-white/10"
                  onClick={toggleFavorite}
                >
                  <Star
                    className={`h-4 w-4 ${
                      isFavorite
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white"
                    }`}
                  />
                  <span>
                    {isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 cursor-pointer focus:bg-white/10"
                  onClick={() => setIsAddToPlaylistOpen(true)}
                  disabled={!currentStation}
                >
                  <PlusCircle className="h-4 w-4 text-white" />
                  <span>Çalma Listesine Ekle</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuItem
                  className="flex items-center space-x-2 px-3 py-2 cursor-pointer focus:bg-white/10"
                  onClick={toggleMute}
                  disabled={isIOSSafari} // Disable mute button on iOS
                >
                  {volume > 0 ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  <span>{volume > 0 ? "Sessize Al" : "Sesi Aç"}</span>
                  {isIOSSafari && (
                    <span
                      className="text-yellow-500"
                      title="Not available on iOS Safari"
                    >
                      <AlertTriangle className="h-3 w-3" />
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuLabel className="px-3 py-2 text-white/80 font-semibold flex items-center">
                  Ses
                  {isIOSSafari && (
                    <span
                      className="flex items-center text-yellow-500 ml-2"
                      title="iOS Safari'de ses kontrolü kullanılamaz"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      <span className="text-xs">Kullanılamaz</span>
                    </span>
                  )}
                </DropdownMenuLabel>
                <div
                  className="px-3 py-2"
                  ref={volumeAreaRef}
                  onMouseEnter={() => setIsVolumeHovered(true)}
                  onMouseLeave={() => setIsVolumeHovered(false)}
                >
                  <Slider
                    value={[volume]}
                    onValueChange={([newVolume]) => updateVolume(newVolume)}
                    onValueCommit={([newVolume]) => setVolume(newVolume)}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={isIOSSafari} // Disable slider on iOS
                  />
                  {isIOSSafari && (
                    <p className="text-xs text-yellow-500 mt-1">
                      Ses seviyesini kontrol etmek için cihazınızın ses
                      düğmelerini kullanın
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-gray-800" />
                <DropdownMenuLabel className="px-3 py-2 text-white/80 font-semibold">
                  Oynatma Listesi
                </DropdownMenuLabel>
                {stationListSource ? (
                  <DropdownMenuLabel className="px-3 py-1 text-xs text-white/60 font-normal flex items-center">
                    Kaynak: {stationListSource}
                  </DropdownMenuLabel>
                ) : (
                  <DropdownMenuLabel className="px-3 py-1 text-xs text-white/60 font-normal flex items-center">
                    Kaynak:{" "}
                    {currentStation?.radioGroups[0] || "Radyo İstasyonu"}
                  </DropdownMenuLabel>
                )}
                <ScrollArea className="h-40 rounded-md">
                  {stationList.map((station) => (
                    <DropdownMenuItem
                      key={station.stationName}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer focus:bg-white/10 ${
                        station.stationName === currentStation.stationName
                          ? "bg-white/10"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => handleStationSelect(station)}
                    >
                      <div className="flex items-center space-x-2">
                        <StationIcon
                          stationIconUrl={station.stationIconUrl}
                          stationName={station.stationName}
                          size="xxs"
                        />
                        <span
                          className={`text-sm ${
                            station.stationName === currentStation.stationName
                              ? "font-semibold text-white"
                              : "text-white/80"
                          }`}
                        >
                          {station.stationName}
                        </span>
                      </div>
                      {station.stationName === currentStation.stationName && (
                        <Radio className="h-3 w-3 text-white animate-pulse" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
