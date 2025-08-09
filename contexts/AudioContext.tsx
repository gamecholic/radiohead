'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
}

interface AudioContextType {
  isPlaying: boolean;
  currentStation: Station | null;
  volume: number;
  togglePlay: (station: Station) => void;
  setVolume: (volume: number) => void;
  updateVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(80);
  const volumeUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = (station: Station) => {
    if (currentStation?.stationName === station.stationName && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  // Custom volume setter that updates audio element immediately with debouncing
  const updateVolume = (newVolume: number) => {
    // Skip if volume hasn't changed
    if (volumeRef.current === newVolume) return;
    
    // Update the audio element immediately
    volumeRef.current = newVolume;
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    
    // Clear any existing timeout
    if (volumeUpdateTimeoutRef.current) {
      clearTimeout(volumeUpdateTimeoutRef.current);
    }
    
    // Set a new timeout to update state after a short delay
    volumeUpdateTimeoutRef.current = setTimeout(() => {
      setVolume(newVolume);
    }, 50); // More aggressive debouncing for 50ms
  };

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentStation) {
      // Only set the source when the station changes, not when volume changes
      if (audioRef.current.src !== currentStation.stationPlaybackUrl) {
        audioRef.current.src = currentStation.stationPlaybackUrl;
      }
      audioRef.current.volume = volumeRef.current / 100;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentStation]);

  // Handle volume state updates (for UI synchronization)
  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (volumeUpdateTimeoutRef.current) {
        clearTimeout(volumeUpdateTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentStation,
        volume,
        togglePlay,
        setVolume,
        updateVolume
      }}
    >
      {children}
      <audio ref={audioRef} />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}