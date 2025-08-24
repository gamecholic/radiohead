// Media Session API integration
import { Station } from '@/lib/types';

export class MediaSessionManager {
  private currentStation: Station | null = null;
  private playCallback: (() => void) | null = null;
  private pauseCallback: (() => void) | null = null;
  private nextCallback: (() => void) | null = null;
  private previousCallback: (() => void) | null = null;

  public setStation(station: Station | null) {
    this.currentStation = station;
    this.updateMediaSession();
  }

  public setCallbacks(
    play: () => void,
    pause: () => void,
    next: () => void,
    previous: () => void
  ) {
    this.playCallback = play;
    this.pauseCallback = pause;
    this.nextCallback = next;
    this.previousCallback = previous;
    this.updateActionHandlers();
  }

  private updateMediaSession() {
    if ('mediaSession' in navigator && this.currentStation) {
      try {
        // Set metadata for the current station
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.currentStation.stationName,
          artist: this.currentStation.radioGroups[0] || 'Radyo İstasyonu',
          album: this.currentStation.stationCategories[0] || 'Radyo',
          artwork: this.currentStation.stationIconUrl 
            ? [{ src: this.currentStation.stationIconUrl, sizes: '96x96', type: 'image/png' }]
            : []
        });
      } catch (error) {
        console.warn('Error updating media session metadata:', error);
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
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
      } catch (error) {
        console.warn('Error cleaning up Media Session API:', error);
      }
    }
  }

  public reset() {
    if ('mediaSession' in navigator) {
      try {
        // Reset all media session properties
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = 'paused';
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
      } catch (error) {
        console.warn('Error resetting Media Session API:', error);
      }
    }
  }
}