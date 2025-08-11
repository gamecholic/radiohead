declare module 'next-pwa' {
  import { NextConfig } from 'next';
  
  interface PWAConfig {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    sw?: string;
  }
  
  export default function withPWA(options: PWAConfig): (nextConfig: NextConfig) => NextConfig;
}