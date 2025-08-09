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
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (station: Station) => {
    if (currentStation?.stationName === station.stationName && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentStation) {
      audioRef.current.src = currentStation.stationPlaybackUrl;
      audioRef.current.volume = volume / 100;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentStation, volume]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentStation,
        volume,
        togglePlay,
        setVolume
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