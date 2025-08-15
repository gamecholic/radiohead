'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserPlaylists, addUserPlaylist as addPlaylist, removeUserPlaylist as removePlaylist, addStationToPlaylist as addStation, removeStationFromPlaylist as removeStation } from '@/lib/api';
import { Playlist } from '@/lib/localStorageHandler';
import { RadioStation } from '@/lib/types';

interface PlaylistContextType {
  playlists: Playlist<RadioStation>[];
  isLoading: boolean;
  error: string | null;
  loadPlaylists: (userId: string) => Promise<void>;
  createPlaylist: (userId: string, name: string) => Promise<Playlist<RadioStation> | null>;
  deletePlaylist: (userId: string, playlistId: string) => Promise<void>;
  addStationToPlaylist: (userId: string, playlistId: string, station: RadioStation) => Promise<Playlist<RadioStation> | null>;
  removeStationFromPlaylist: (userId: string, playlistId: string, stationName: string) => Promise<Playlist<RadioStation> | null>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist<RadioStation>[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlaylists = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const userPlaylists = await getUserPlaylists<RadioStation>(userId);
      setPlaylists(userPlaylists);
    } catch (err) {
      setError('Failed to load playlists');
      console.error('Error loading playlists:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createPlaylist = async (userId: string, name: string) => {
    try {
      setError(null);
      const newPlaylist = await addPlaylist(userId, name);
      setPlaylists(prev => [...prev, newPlaylist]);
      return newPlaylist;
    } catch (err) {
      setError('Failed to create playlist');
      console.error('Error creating playlist:', err);
      return null;
    }
  };

  const deletePlaylist = async (userId: string, playlistId: string) => {
    try {
      setError(null);
      await removePlaylist(userId, playlistId);
      setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    } catch (err) {
      setError('Failed to delete playlist');
      console.error('Error deleting playlist:', err);
    }
  };

  const addStationToPlaylist = async (userId: string, playlistId: string, station: RadioStation) => {
    try {
      setError(null);
      const updatedPlaylist = await addStation(userId, playlistId, station);
      
      if (updatedPlaylist) {
        // Update the specific playlist in state
        setPlaylists(prevPlaylists => 
          prevPlaylists.map(playlist => 
            playlist.id === playlistId ? updatedPlaylist : playlist
          )
        );
        
        // Dispatch a custom event to notify other components
        window.dispatchEvent(new CustomEvent('playlistUpdated', { detail: { playlistId } }));
        
        return updatedPlaylist;
      }
      
      return null;
    } catch (err) {
      setError('Failed to add station to playlist');
      console.error('Error adding station to playlist:', err);
      return null;
    }
  };

  const removeStationFromPlaylist = async (userId: string, playlistId: string, stationName: string) => {
    try {
      setError(null);
      await removeStation(userId, playlistId, stationName);
      
      // Reload the playlists to get the updated state
      await loadPlaylists(userId);
      
      const updatedPlaylist = playlists.find(p => p.id === playlistId) || null;
      return updatedPlaylist;
    } catch (err) {
      setError('Failed to remove station from playlist');
      console.error('Error removing station from playlist:', err);
      return null;
    }
  };

  // Listen for playlist updates from other components
  useEffect(() => {
    const handlePlaylistUpdate = () => {
      // Reload playlists when notified of updates
      loadPlaylists("temp-user");
    };

    window.addEventListener('playlistUpdated', handlePlaylistUpdate);
    
    return () => {
      window.removeEventListener('playlistUpdated', handlePlaylistUpdate);
    };
  }, []);

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        isLoading,
        error,
        loadPlaylists,
        createPlaylist,
        deletePlaylist,
        addStationToPlaylist,
        removeStationFromPlaylist
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylists must be used within a PlaylistProvider');
  }
  return context;
}