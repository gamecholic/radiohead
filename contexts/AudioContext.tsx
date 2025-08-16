'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { getFeaturedStations } from '@/lib/api';
import {
  getSavedVolume,
  getSavedCurrentStation,
  getSavedStationList,
  getSavedStationListSource,
  saveVolume,
  saveCurrentStation,
  saveStationList,
  saveStationListSource
} from '@/lib/localStorageHandler';
import { Station } from '@/lib/types';
import { isIOSSafari } from '@/lib/utils/browser';
import { AudioPlayer } from '@/lib/utils/audioPlayer';
import { MediaSessionManager } from '@/lib/utils/mediaSession';

interface AudioContextType {
  isPlaying: boolean;
  currentStation: Station | null;
  stationList: Station[];
  stationListSource: string | null;
  volume: number;
  togglePlay: (station: Station, stationList?: Station[], source?: string) => void;
  setVolume: (volume: number) => void;
  updateVolume: (volume: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  isIOSSafari: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [stationList, setStationList] = useState<Station[]>([]);
  const [stationListSource, setStationListSource] = useState<string | null>(null);
  
  // Load volume from localStorage or default to 80
  const [volume, setVolume] = useState(() => {
    return getSavedVolume();
  });
  
  // Initialize state with saved data from localStorage
  useEffect(() => {
    // Load saved station data
    const savedStation = getSavedCurrentStation<Station>();
    const savedStationList = getSavedStationList<Station>();
    const savedStationListSource = getSavedStationListSource();
    
    if (savedStation) {
      setCurrentStation(savedStation);
    }
    
    if (savedStationList) {
      setStationList(Array.isArray(savedStationList) ? savedStationList : []);
    }
    
    if (savedStationListSource) {
      setStationListSource(savedStationListSource);
    }
  }, []);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(80);
  const volumeUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserInteractedRef = useRef(false);
  const isIOSSafariRef = useRef(isIOSSafari());
  
  // Initialize utility classes
  const audioPlayerRef = useRef<AudioPlayer>(new AudioPlayer(isIOSSafariRef.current));
  const mediaSessionRef = useRef<MediaSessionManager>(new MediaSessionManager());

  // Set up audio element reference
  useEffect(() => {
    if (audioRef.current) {
      audioPlayerRef.current.setAudioElement(audioRef.current);
    }
  }, []);

  const togglePlay = (station: Station, stationList?: Station[], source?: string) => {
    // Mark that user has interacted (needed for iOS Safari)
    hasUserInteractedRef.current = true;
    
    if (currentStation?.stationName === station.stationName && isPlaying) {
      // Pause playback but keep the current station
      setIsPlaying(false);
    } else {
      // If we're switching stations or starting from stopped state
      if (currentStation?.stationName !== station.stationName) {
        setCurrentStation(station);
        if (stationList && stationList.length > 0) {
          setStationList(stationList);
          setStationListSource(source || null);
        }
      }
      // Start/restart playback
      setIsPlaying(true);
    }
  };

  const playNext = () => {
    if (!currentStation || stationList.length === 0) return;
    
    // If there's only one station in the current list, switch to featured stations
    if (stationList.length === 1) {
      // Use the same temp user ID as in FavoritesContext
      const USER_ID = "temp-user";
      
      // Fetch featured stations and play the first one
      getFeaturedStations(USER_ID).then(featuredStations => {
        if (featuredStations.length > 0) {
          // Set the featured stations as the new station list
          setStationList(featuredStations);
          setStationListSource('Öne Çıkanlar');

          // Play the first featured station
          setCurrentStation(featuredStations[0]);
          setIsPlaying(true);
        }
      }).catch(error => {
        console.error('Failed to fetch featured stations:', error);
      });
      return;
    }
    
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
    
    // If there's only one station in the current list, switch to featured stations
    if (stationList.length === 1) {
      // Use the same temp user ID as in FavoritesContext
      const USER_ID = "temp-user";
      
      // Fetch featured stations and play the last one
      getFeaturedStations(USER_ID).then(featuredStations => {
        if (featuredStations.length > 0) {
          // Set the featured stations as the new station list
          setStationList(featuredStations);
          setStationListSource('Öne Çıkanlar');

          // Play the last featured station
          setCurrentStation(featuredStations[featuredStations.length - 1]);
          setIsPlaying(true);
        }
      }).catch(error => {
        console.error('Failed to fetch featured stations:', error);
      });
      return;
    }
    
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
    
    // Update the volume reference
    volumeRef.current = newVolume;
    
    // Update the audio element volume if supported
    if (audioRef.current) {
      // iOS Safari doesn't allow programmatic volume control
      if (!isIOSSafariRef.current) {
        audioRef.current.volume = newVolume / 100;
      }
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

  // Handle audio playback with HLS support
  useEffect(() => {
    if (!audioRef.current) return;

    // If there's no current station, stop playback completely
    if (!currentStation) {
      audioRef.current.src = '';
      audioRef.current.load(); // Reset the media element
      return;
    }

    const playStation = async () => {
      if (isPlaying && currentStation) {
        const success = await audioPlayerRef.current.playStation(currentStation, volumeRef.current);
        if (!success) {
          setIsPlaying(false);
        }
      } else {
        audioPlayerRef.current.pause();
      }
      
      // Update media session playback state
      mediaSessionRef.current.updatePlaybackState(isPlaying);
    };

    playStation();
  }, [isPlaying, currentStation]);

  // Handle volume state updates (for UI synchronization)
  useEffect(() => {
    // Save volume to localStorage whenever it changes
    saveVolume(volume);
    
    volumeRef.current = volume;
    // Only update audio element volume if not on iOS Safari
    if (audioRef.current && !isIOSSafariRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Save station data to localStorage whenever it changes
  useEffect(() => {
    saveCurrentStation<Station>(currentStation);
  }, [currentStation]);

  useEffect(() => {
    saveStationList<Station>(stationList);
  }, [stationList]);

  useEffect(() => {
    saveStationListSource(stationListSource);
  }, [stationListSource]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (volumeUpdateTimeoutRef.current) {
        clearTimeout(volumeUpdateTimeoutRef.current);
      }
      // Clean up audio player on unmount
      audioPlayerRef.current.destroy();
    };
  }, []);

  // Handle user interaction for iOS Safari
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (audioRef.current && !hasUserInteractedRef.current) {
        // Initialize audio element for mobile browsers
        audioRef.current.load();
        hasUserInteractedRef.current = true;
        
        // Remove event listeners after first interaction
        window.removeEventListener('touchstart', handleFirstUserInteraction);
        window.removeEventListener('click', handleFirstUserInteraction);
      }
    };

    // Add event listeners for first user interaction
    window.addEventListener('touchstart', handleFirstUserInteraction);
    window.addEventListener('click', handleFirstUserInteraction);

    return () => {
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('click', handleFirstUserInteraction);
    };
  }, []);

  // Setup Media Session API for system-wide media controls
  useEffect(() => {
    mediaSessionRef.current.setStation(currentStation);
    
    // Update playback state
    mediaSessionRef.current.updatePlaybackState(isPlaying);
    
    // Set action handlers
    mediaSessionRef.current.setCallbacks(
      () => {
        if (currentStation) {
          // Mark user interaction for iOS Safari
          hasUserInteractedRef.current = true;
          setIsPlaying(true);
        }
      },
      () => setIsPlaying(false),
      () => playNext(),
      () => playPrevious()
    );

    // Clean up media session when component unmounts or station changes
    return () => {
      mediaSessionRef.current.cleanup();
    };
  }, [currentStation, stationList]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentStation,
        stationList,
        stationListSource,
        volume,
        togglePlay,
        setVolume,
        updateVolume,
        playNext,
        playPrevious,
        isIOSSafari: isIOSSafariRef.current
      }}
    >
      {children}
      <audio ref={audioRef} crossOrigin="anonymous" />
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