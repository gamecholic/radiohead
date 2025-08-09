'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface Station {
  stationName: string;
  stationIconUrl: string;
  stationCategories: string[];
  stationPlaybackUrl: string;
  radioGroups: string[];
}

interface AudioContextType {
  isPlaying: boolean;
  currentStation: Station | null;
  stationList: Station[];
  volume: number;
  togglePlay: (station: Station, stationList?: Station[]) => void;
  setVolume: (volume: number) => void;
  updateVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [stationList, setStationList] = useState<Station[]>([]);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(80);
  const volumeUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = (station: Station, stationList?: Station[]) => {
    if (currentStation?.stationName === station.stationName && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentStation(station);
      if (stationList && stationList.length > 0) {
        setStationList(stationList);
      }
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentStation || stationList.length === 0) return;
    
    const currentIndex = stationList.findIndex(
      station => station.stationName === currentStation.stationName
    );
    
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % stationList.length;
    const nextStation = stationList[nextIndex];
    
    setCurrentStation(nextStation);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!currentStation || stationList.length === 0) return;
    
    const currentIndex = stationList.findIndex(
      station => station.stationName === currentStation.stationName
    );
    
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + stationList.length) % stationList.length;
    const prevStation = stationList[prevIndex];
    
    setCurrentStation(prevStation);
    setIsPlaying(true);
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
    
    // Update media session playback state
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
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

  // Setup Media Session API for system-wide media controls
  useEffect(() => {
    if ('mediaSession' in navigator && currentStation) {
      // Set metadata for the current station
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentStation.stationName,
        artist: currentStation.radioGroups[0] || 'Radio Station',
        album: currentStation.stationCategories[0] || 'Radio',
        artwork: currentStation.stationIconUrl 
          ? [{ src: currentStation.stationIconUrl, sizes: '96x96', type: 'image/png' }]
          : []
      });

      // Set action handlers for system media controls
      navigator.mediaSession.setActionHandler('play', () => {
        if (currentStation) {
          setIsPlaying(true);
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        playNext();
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        playPrevious();
      });
    }

    // Clean up media session when component unmounts or station changes
    return () => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
      }
    };
  }, [currentStation, stationList]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentStation,
        stationList,
        volume,
        togglePlay,
        setVolume,
        updateVolume,
        playNext,
        playPrevious
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