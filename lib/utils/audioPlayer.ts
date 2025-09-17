// Audio playback utilities
import { isHLSNative } from '@/lib/utils/browser';
import { Station } from '@/lib/types';

// Type definition for Hls.js
interface HlsConfig {
  enableWorker: boolean;
  lowLatencyMode: boolean;
  backBufferLength: number;
}

// Event callback types
type HlsManifestParsedCallback = () => void;
type HlsErrorCallback = (event: string, data: HlsErrorData) => void;

interface HlsInstance {
  destroy: () => void;
  loadSource: (url: string) => void;
  attachMedia: (element: HTMLMediaElement) => void;
  on(event: 'hlsManifestParsed', callback: HlsManifestParsedCallback): void;
  on(event: 'hlsError', callback: HlsErrorCallback): void;
  startLoad: () => void;
  recoverMediaError: () => void;
}

interface HlsErrorData {
  fatal: boolean;
  type: string;
}

interface HlsStatic {
  new(config: HlsConfig): HlsInstance;
  isSupported: () => boolean;
  Events: {
    MANIFEST_PARSED: 'hlsManifestParsed';
    ERROR: 'hlsError';
  };
  ErrorTypes: {
    NETWORK_ERROR: string;
    MEDIA_ERROR: string;
  };
}

let Hls: HlsStatic | null = null;

export class AudioPlayer {
  private audioRef: HTMLAudioElement | null = null;
  private hlsRef: HlsInstance | null = null;
  private isIOSSafari: boolean;

  constructor(isIOSSafari: boolean) {
    this.isIOSSafari = isIOSSafari;
  }

  public setAudioElement(audioElement: HTMLAudioElement) {
    this.audioRef = audioElement;
  }

  public async playStation(station: Station, volume: number): Promise<boolean> {
    if (!this.audioRef) return false;

    // Clean up any existing HLS instance
    if (this.hlsRef) {
      this.hlsRef.destroy();
      this.hlsRef = null;
    }

    const videoUrl = station.stationPlaybackUrl;
    const isHLS = videoUrl.includes('.m3u8');

    try {
      if (isHLS && !isHLSNative()) {
        // Dynamically import hls.js only when needed
        if (!Hls) {
          const HlsModule = await import('hls.js');
          Hls = HlsModule.default as HlsStatic;
        }
        
        // Use hls.js for browsers that don't support HLS natively
        if (Hls.isSupported()) {
          this.hlsRef = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
          });
          
          this.hlsRef.loadSource(videoUrl);
          this.hlsRef.attachMedia(this.audioRef);
          
          // Set volume only if not on iOS Safari
          if (!this.isIOSSafari) {
            this.audioRef.volume = volume / 100;
          }

          return new Promise((resolve) => {
            if (Hls) {
              this.hlsRef!.on(Hls.Events.MANIFEST_PARSED, () => {
                if (this.audioRef) {
                  const playPromise = this.audioRef.play();
                  if (playPromise !== undefined) {
                    playPromise.then(() => resolve(true)).catch(() => resolve(false));
                  } else {
                    resolve(true);
                  }
                }
              });
              
              this.hlsRef!.on(Hls.Events.ERROR, (event, data: HlsErrorData) => {
                console.error('HLS error:', event, data);
                if (data.fatal) {
                  switch (data.type) {
                    case Hls!.ErrorTypes.NETWORK_ERROR:
                      console.log('Trying to recover network error...');
                      this.hlsRef?.startLoad();
                      break;
                    case Hls!.ErrorTypes.MEDIA_ERROR:
                      console.log('Trying to recover media error...');
                      this.hlsRef?.recoverMediaError();
                      break;
                    default:
                      console.error('Unrecoverable HLS error');
                      resolve(false);
                      break;
                  }
                }
              });
            }
          });
        } else {
          console.error('HLS is not supported in this browser');
          return false;
        }
      } else {
        // Handle regular audio sources or native HLS support
        this.audioRef.src = videoUrl;
        
        // Set volume only if not on iOS Safari
        if (!this.isIOSSafari) {
          this.audioRef.volume = volume / 100;
        }
        
        // For iOS Safari, we need to handle the play promise properly
        const playPromise = this.audioRef.play();
        if (playPromise !== undefined) {
          try {
            await playPromise;
            return true;
          } catch (error) {
            console.error('Error playing audio:', error);
            return false;
          }
        }
        return true;
      }
    } catch (error) {
      console.error('Error playing station:', error);
      return false;
    }
  }

  public pause() {
    if (!this.audioRef) return;
    
    // Special handling for iOS Safari to properly pause
    if (this.isIOSSafari) {
      // On iOS Safari, we might need to set the src to empty to properly stop
      this.audioRef.pause();
    } else {
      this.audioRef.pause();
    }
  }

  public setVolume(volume: number) {
    if (!this.audioRef || this.isIOSSafari) return;
    this.audioRef.volume = volume / 100;
  }

  public destroy() {
    if (this.hlsRef) {
      this.hlsRef.destroy();
      this.hlsRef = null;
    }
  }
}