"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Station, Playlist } from "@/lib/types";
import {
  getUserPlaylists,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addStationToPlaylist,
  removeStationFromPlaylist,
} from "@/lib/api";

interface LibraryContextType {
  playlists: Playlist[];
  refreshPlaylists: () => Promise<void>;
  createNewPlaylist: (name: string, stations?: Station[]) => Promise<Playlist>;
  updateExistingPlaylist: (
    playlistId: string,
    name?: string,
    stations?: Station[]
  ) => Promise<void>;
  deleteExistingPlaylist: (playlistId: string) => Promise<void>;
  addStationToExistingPlaylist: (
    playlistId: string,
    station: Station
  ) => Promise<void>;
  removeStationFromExistingPlaylist: (
    playlistId: string,
    stationName: string
  ) => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

const USER_ID = "temp-user"; // In a real app, this would come from auth

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const refreshPlaylists = async () => {
    try {
      const userPlaylists = await getUserPlaylists(USER_ID);
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error("Failed to refresh playlists:", error);
    }
  };

  const createNewPlaylist = async (
    name: string,
    stations: Station[] = []
  ): Promise<Playlist> => {
    try {
      const newPlaylist = await createPlaylist(USER_ID, name, stations);
      await refreshPlaylists();
      return newPlaylist;
    } catch (error) {
      console.error("Failed to create playlist:", error);
      throw error;
    }
  };

  const updateExistingPlaylist = async (
    playlistId: string,
    name?: string,
    stations?: Station[]
  ): Promise<void> => {
    try {
      await updatePlaylist(USER_ID, playlistId, name, stations);
      await refreshPlaylists();
    } catch (error) {
      console.error("Failed to update playlist:", error);
      throw error;
    }
  };

  const deleteExistingPlaylist = async (playlistId: string): Promise<void> => {
    try {
      await deletePlaylist(USER_ID, playlistId);
      await refreshPlaylists();
    } catch (error) {
      console.error("Failed to delete playlist:", error);
      throw error;
    }
  };

  const addStationToExistingPlaylist = async (
    playlistId: string,
    station: Station
  ): Promise<void> => {
    try {
      await addStationToPlaylist(USER_ID, playlistId, station);
      await refreshPlaylists();
    } catch (error) {
      console.error("Failed to add station to playlist:", error);
      throw error;
    }
  };

  const removeStationFromExistingPlaylist = async (
    playlistId: string,
    stationName: string
  ): Promise<void> => {
    try {
      await removeStationFromPlaylist(USER_ID, playlistId, stationName);
      await refreshPlaylists();
    } catch (error) {
      console.error("Failed to remove station from playlist:", error);
      throw error;
    }
  };

  // Load playlists on mount
  useEffect(() => {
    refreshPlaylists();
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        playlists,
        refreshPlaylists,
        createNewPlaylist,
        updateExistingPlaylist,
        deleteExistingPlaylist,
        addStationToExistingPlaylist,
        removeStationFromExistingPlaylist,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error("useLibrary must be used within a LibraryProvider");
  }
  return context;
}