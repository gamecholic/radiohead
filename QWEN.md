# RadioHead Project Context for Qwen Code

## Project Overview

RadioHead is a modern, sleek online radio application built with Next.js 15 and shadcn/ui. It provides a Spotify/Youtube Music-inspired interface for listening to various radio stations. The application is designed to be responsive, working well on both desktop and mobile devices.

### Key Features

- Browse and play various radio stations
- Modern UI with a dark theme and glassmorphism effects
- Responsive design for all devices
- Volume control (with special handling for iOS Safari limitations)
- Station favorites
- Resume playback - Remembers the last played station
- Media Session API integration for system-wide media controls
- PWA (Progressive Web App) support

### Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **UI Library:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Audio Streaming:** [hls.js](https://github.com/video-dev/hls.js/) for HLS streams
- **HTTP Client:** [axios](https://axios-http.com/)
- **State Management:** React Context API (`AudioContext`, `FavoritesContext`)
- **Component Utility:** [class-variance-authority](https://cva.style/docs), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## Project Structure

The project follows a standard Next.js 15 App Router structure:

```
app/              # Next.js app directory (contains routing and page components)
components/       # Reusable UI components
contexts/         # React Context providers for global state (Audio, Favorites)
hooks/            # Custom React hooks
i18n/             # Internationalization (likely for Turkish support)
lib/              # Utility functions, API handlers, local storage
messages/         # Translation files
public/           # Static assets (images, icons, PWA manifest)
```

### Important Files

- `next.config.ts`: Next.js configuration with PWA setup.
- `tailwind.config.ts` (likely in `lib/` or root): Tailwind CSS configuration.
- `tsconfig.json`: TypeScript configuration.
- `package.json`: Project dependencies and scripts.
- `components.json`: shadcn/ui configuration.
- `design_guide.md`: Detailed UI/UX guidelines for the application.
- `README.md`: General project information and setup instructions.

## Development Conventions

### UI/UX

- **Design Guide:** The `design_guide.md` file is the authoritative source for visual style, color palette, layout structure, component mapping, and implementation notes. All UI development should adhere to this guide.
- **Responsiveness:** The application is designed for both desktop and mobile. Specific mobile variants are detailed in `design_guide.md`.
- **Components:** UI components are built using shadcn/ui primitives and styled with Tailwind CSS. New components should follow the existing patterns.
- **Icons:** Lucide React icons are used throughout the application.

### State Management

- **Audio Context (`contexts/AudioContext.tsx`):** This is the core of the application's playback functionality. It manages:
  - Current playback state (`isPlaying`, `currentStation`).
  - Station list and its source.
  - Volume control (with specific handling for iOS Safari).
  - Playback controls (play/pause, next, previous).
  - Integration with `hls.js` for HLS streams.
  - Saving/loading state to/from `localStorage`.
  - Media Session API integration.
- **Favorites Context (`contexts/FavoritesContext.tsx`):** Manages the user's list of favorite stations.

### Data Handling

- **Local Storage:** The application heavily uses `localStorage` to persist user preferences like volume, current station, and favorite stations. Helper functions for this are in `lib/localStorageHandler.ts` (not fully explored but inferred from `AudioContext.tsx`).
- **API Calls:** Functions to fetch station data (e.g., `getFeaturedStations`) are located in `lib/api.ts` (not fully explored but inferred from `AudioContext.tsx`).

### Audio Streaming

- **HLS Support:** Uses `hls.js` for browsers that don't support HLS natively, with fallbacks for native support.
- **iOS Safari Limitations:** Special handling is implemented for iOS Safari's restrictions on programmatic volume control and autoplay. The `AudioContext` detects iOS Safari and adjusts behavior accordingly (e.g., disabling volume slider, requiring user interaction for initial play).

## Building and Running

### Prerequisites

- Node.js (version not specified, but likely LTS)
- npm, yarn, pnpm, or bun

### Commands

- **Install Dependencies:**
  ```bash
  npm install
  # or
  yarn install
  # or
  pnpm install
  # or
  bun install
  ```
- **Development Server:**
  ```bash
  npm run dev
  # or
  yarn dev
  # or
  pnpm dev
  # or
  bun dev
  ```
  This starts the development server, typically on `http://localhost:3000`.

- **Build for Production:**
  ```bash
  npm run build
  # or
  yarn build
  # or
  pnpm build
  # or
  bun build
  ```
- **Start Production Server:**
  ```bash
  npm run start
  # or
  yarn start
  # or
  pnpm start
  # or
  bun start
  ```
- **Linting:**
  ```bash
  npm run lint
  # or
  yarn lint
  # or
  pnpm lint
  # or
  bun lint
  ```

### PWA

The application is configured as a PWA using `next-pwa`. The service worker is generated at `/sw.js`.

## Key Implementation Details

1.  **`AudioContext` (`contexts/AudioContext.tsx`)**: This is a complex provider that handles all audio-related state and logic. Understanding its structure and the `Station` interface is crucial for audio-related features.
2.  **`NowPlayingPanel` (`components/layout/now-playing-panel.tsx`)**: This component represents the fixed bottom player dock. It consumes the `AudioContext` and provides UI controls for playback, volume (with iOS handling), favorites, and the station list queue.
3.  **Design Guide (`design_guide.md`)**: This file is essential for maintaining visual consistency. It details colors, gradients, layout specifics, component usage, and responsive behavior.
4.  **iOS Safari Handling:** Specific logic exists in both `AudioContext` and `NowPlayingPanel` to handle the limitations of iOS Safari regarding autoplay and volume control. The `isIOSSafari` flag is used to conditionally render/disable UI elements.