# RadyoZen - Online Radio Application Documentation

## Overview

RadyoZen is a modern online radio application built with Next.js 15 and shadcn/ui. It provides a Spotify/Youtube Music-inspired interface for listening to various radio stations with features like favorites, playlists, and listening history.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Audio Streaming**: hls.js for HLS streams
- **State Management**: React Context API
- **Animation**: Framer Motion

## Project Structure

```
app/              # Next.js app directory (contains routing and page components)
components/       # Reusable UI components
contexts/         # React Context providers for global state (Audio, Favorites, Library, History)
hooks/            # Custom React hooks
lib/              # Utility functions, API handlers, local storage
public/           # Static assets (images, icons, PWA manifest)
```

### Key Directories

#### `app/`
The application uses Next.js parallel routes to handle different layouts for desktop and mobile:

- `@desktop/` - Desktop-specific layouts and pages
- `@mobile/` - Mobile-specific layouts and pages
- Each route contains:
  - `page.tsx` - Main page component
  - `layout.tsx` - Route-specific layout
  - `components/` - Route-specific components

#### `components/`
Contains reusable UI components organized by functionality:

- `audio/` - Audio player controls for desktop and mobile
- `carousel/` - Carousel components for displaying stations
- `layout/` - Main layout components (header, sidebar, now playing panel)
- `mobile/` - Mobile-specific layout components (bottom navigation, current station)
- `station-grid/` - Components for displaying station grids
- `ui/` - shadcn/ui components

#### `contexts/`
Global state management using React Context API:

- `AudioContext.tsx` - Audio playback state and controls
- `FavoritesContext.tsx` - User favorites management
- `LibraryContext.tsx` - User playlists management
- `HistoryContext.tsx` - Listening history management

#### `lib/`
Utility functions and data handling:

- `data/` - Static JSON data files (radio stations, groups, categories)
- `types/` - TypeScript interfaces and types
- `utils/` - Helper functions
- `api.tsx` - Data fetching and manipulation functions
- `localStorageHandler.ts` - Local storage operations
- `deviceDetection.ts` - Device type detection
- `cachedRadioGroups.ts` - Radio groups caching

## Core Features

### 1. Audio Playback
The `AudioContext` is the core of the application's playback functionality, managing:
- Current playback state (`isPlaying`, `currentStation`)
- Station list and its source
- Volume control (with specific handling for iOS Safari limitations)
- Playback controls (play/pause, next, previous)
- Integration with `hls.js` for HLS streams
- Saving/loading state to/from `localStorage`
- Media Session API integration

### 2. Responsive Design
The application uses Next.js parallel routes to provide different layouts for desktop and mobile:
- Desktop: Sidebar navigation with full-featured player controls
- Mobile: Bottom navigation with simplified player controls

### 3. Data Management
The application uses static JSON files for radio station data:
- `radio-stations.json` - Complete list of radio stations
- `radio-groups.json` - Radio station groups with slugs for routing
- `categories.json` - Station categories

User data is persisted using localStorage:
- Favorites
- Playlists
- Listening history
- Volume settings
- Current station

### 4. State Management
The application uses React Context API for global state management:
- `AudioContext` - Audio playback state
- `FavoritesContext` - User favorites
- `LibraryContext` - User playlists
- `HistoryContext` - Listening history

## Key Implementation Details

### Audio Playback
- Uses `hls.js` for browsers that don't support HLS natively
- Special handling for iOS Safari limitations (programmatic volume control and autoplay)
- Media Session API integration for system-wide media controls
- PWA support with service worker

### Responsive Design
- Desktop layout with sidebar navigation
- Mobile layout with bottom navigation
- Different player controls for each platform
- Adaptive grid layouts for station displays

### Data Persistence
- All user data (favorites, playlists, history) is stored in localStorage
- Volume and current station state is persisted between sessions
- Featured stations are dynamically selected based on user favorites

### Performance Optimizations
- Static generation for radio groups and categories
- Dynamic imports for heavy components
- Lazy loading for images
- Code splitting for routes

## Development

### Prerequisites
- Node.js (version not specified, but likely LTS)
- npm, yarn, pnpm, or bun

### Installation
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Build for Production
```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Linting
The project uses Husky to run linting and TypeScript checks before each commit:
- `npm run lint` - ESLint checks
- `npx tsc --noEmit` - TypeScript compilation checks

## Deployment
The application is configured for deployment on Vercel with PWA support enabled. The service worker is generated at `/sw.js`.

## AI Development Context

This application was primarily developed by AI agents, with Qwen Code playing a significant role in its creation. Key aspects of the AI development process include:

### Development Approach
- The application was built using a component-based architecture with Next.js 15 and React 19
- State management was implemented using React Context API rather than external state libraries
- The UI was built with shadcn/ui components and Tailwind CSS for rapid development
- Data is persisted using localStorage for a client-side only solution

### Key AI Implementation Patterns
- Used parallel routes in Next.js App Router to handle responsive layouts (desktop vs mobile)
- Implemented a comprehensive audio system with hls.js support for various streaming formats
- Created reusable component patterns for station displays, carousels, and grids
- Developed context providers for managing global state (audio, favorites, library, history)

### Development Workflow
- The AI agent analyzed existing codebase structure and conventions before making changes
- Components were built following established patterns in the codebase
- Special attention was paid to responsive design requirements for both desktop and mobile
- iOS Safari limitations were specifically addressed in the audio implementation

This documentation serves as context for future AI agents working on this project, explaining both the technical implementation and the development approach used.