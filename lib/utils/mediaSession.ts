// Media Session API integration
import { Station } from '@/lib/types';
import { getAbsoluteImageUrl } from '@/lib/utils/imageUtils';

export class MediaSessionManager {
  private currentStation: Station | null = null;
  private playCallback: (() => void) | null = null;
  private pauseCallback: (() => void) | null = null;
  private nextCallback: (() => void) | null = null;
  private previousCallback: (() => void) | null = null;
  private stopCallback: (() => void) | null = null;

  public setStation(station: Station | null) {
    this.currentStation = station;
    this.updateMediaSession();
  }

  public setCallbacks(
    play: () => void,
    pause: () => void,
    next: () => void,
    previous: () => void,
    stop?: () => void
  ) {
    // Store callbacks
    this.playCallback = play;
    this.pauseCallback = pause;
    this.nextCallback = next;
    this.previousCallback = previous;
    this.stopCallback = stop || null;
    
    // Update action handlers
    this.updateActionHandlers();
  }

  private updateMediaSession() {
    if ('mediaSession' in navigator && this.currentStation) {
      try {
        // Set metadata for the current station
        const imageUrl = getAbsoluteImageUrl(this.currentStation.stationIconUrl);
        // Determine image type based on file extension
        const imageType = imageUrl.endsWith('.webp') ? 'image/webp' : 'image/png';
        
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentStation.stationName,
          artist: this.currentStation.radioGroups[0] || 'Radyo İstasyonu',
          album: this.currentStation.stationCategories[0] || 'Radyo',
          artwork: this.currentStation.stationIconUrl 
            ? [
                { src: imageUrl, sizes: '96x96', type: imageType },
                { src: imageUrl, sizes: '128x128', type: imageType },
                { src: imageUrl, sizes: '192x192', type: imageType },
                { src: imageUrl, sizes: '256x256', type: imageType },
                { src: imageUrl, sizes: '384x384', type: imageType },
                { src: imageUrl, sizes: '512x512', type: imageType }
              ]
            : []
        });
        
        // For live streams, explicitly set position state with Infinity duration
        // This prevents the media session from showing a progress bar
        navigator.mediaSession.setPositionState({
          duration: Infinity,
          playbackRate: 1.0,
          position: 0
        });
      } catch (error) {
        console.warn('Error updating media session metadata:', error);
        // Fallback to minimal metadata if artwork fails
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: this.currentStation.stationName,
            artist: this.currentStation.radioGroups[0] || 'Radyo İstasyonu',
            album: this.currentStation.stationCategories[0] || 'Radyo'
          });
        } catch (fallbackError) {
          console.warn('Error setting fallback media session metadata:', fallbackError);
        }
      }
    }
  }

  private updateActionHandlers() {
    if ('mediaSession' in navigator) {
      try {
        // Set action handlers for system media controls
        navigator.mediaSession.setActionHandler('play', this.playCallback || null);
        navigator.mediaSession.setActionHandler('pause', this.pauseCallback || null);
        navigator.mediaSession.setActionHandler('nexttrack', this.nextCallback || null);
        navigator.mediaSession.setActionHandler('previoustrack', this.previousCallback || null);
        
        // Set stop handler if provided
        if (this.stopCallback) {
          navigator.mediaSession.setActionHandler('stop', this.stopCallback);
        } else {
          navigator.mediaSession.setActionHandler('stop', null);
        }
      } catch (error) {
        console.warn('Error setting media session action handlers:', error);
      }
    }
  }

  public updatePlaybackState(isPlaying: boolean) {
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
      } catch (error) {
        console.warn('Error updating media session playback state:', error);
      }
    }
  }

  public cleanup() {
    if ('mediaSession' in navigator) {
      try {
        // Reset all media session properties
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'paused';
        
        // Clear all possible action handlers
        const actions: MediaSessionAction[] = [
          'play', 'pause', 'nexttrack', 'previoustrack', 
          'stop', 'seekbackward', 'seekforward', 'seekto'
        ];
        
        actions.forEach(action => {
          try {
            navigator.mediaSession.setActionHandler(action, null);
          } catch (error) {
            // Ignore errors for unsupported actions
          }
        });
        
        // Clear position state to ensure clean reset
        if ('setPositionState' in navigator.mediaSession) {
          navigator.mediaSession.setPositionState({} as MediaPositionState);
        }
      } catch (error) {
        console.warn('Error cleaning up Media Session API:', error);
      }
    }
  }
}