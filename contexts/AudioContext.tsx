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
  isIOSSafari: boolean; // Expose iOS Safari detection
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Check if we're on iOS Safari
const isIOSSafari = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome/.test(ua);
  return isIOS && isSafari;
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [stationList, setStationList] = useState<Station[]>([]);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef<number>(80);
  const volumeUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasUserInteractedRef = useRef(false);
  const isIOSSafariRef = useRef(isIOSSafari());

  const togglePlay = (station: Station, stationList?: Station[]) => {
    // Mark that user has interacted (needed for iOS Safari)
    hasUserInteractedRef.current = true;
    
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

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentStation) {
      // Only set the source when the station changes, not when volume changes
      if (audioRef.current.src !== currentStation.stationPlaybackUrl) {
        audioRef.current.src = currentStation.stationPlaybackUrl;
      }
      
      // Set volume only if not on iOS Safari
      if (!isIOSSafariRef.current) {
        audioRef.current.volume = volumeRef.current / 100;
      }
      
      // For iOS Safari, we need to handle the play promise properly
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error);
          // On iOS Safari, autoplay is restricted and requires user interaction
          // We'll set isPlaying to false to reflect the actual state
          setIsPlaying(false);
        });
      }
    } else {
      // Special handling for iOS Safari to properly pause
      if (isIOSSafariRef.current) {
        // On iOS Safari, we might need to set the src to empty to properly stop
        audioRef.current.pause();
      } else {
        audioRef.current.pause();
      }
    }
    
    // Update media session playback state
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      } catch (error) {
        console.warn('Error updating media session playback state:', error);
      }
    }
  }, [isPlaying, currentStation]);

  // Handle volume state updates (for UI synchronization)
  useEffect(() => {
    volumeRef.current = volume;
    // Only update audio element volume if not on iOS Safari
    if (audioRef.current && !isIOSSafariRef.current) {
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
    if ('mediaSession' in navigator && currentStation) {
      try {
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
            // Mark user interaction for iOS Safari
            hasUserInteractedRef.current = true;
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
      } catch (error) {
        console.warn('Media Session API not fully supported:', error);
      }
    }

    // Clean up media session when component unmounts or station changes
    return () => {
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = null;
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
        } catch (error) {
          console.warn('Error cleaning up Media Session API:', error);
        }
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
        playPrevious,
        isIOSSafari: isIOSSafariRef.current
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