import Image from 'next/image';
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}: OptimizedImageProps) {
  // For external images, we'll use a regular img tag with loading="lazy"
  if (src.startsWith('http')) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn("object-cover", className)}
        loading="lazy"
        decoding="async"
      />
    );
  }
  
  // For local images, use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn("object-cover", className)}
      priority={priority}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}