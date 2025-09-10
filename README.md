# RadioHead - Online Radio App

A modern, sleek online radio application built with Next.js 15 and shadcn/ui. Listen to your favorite radio stations with a Spotify/Youtube Music-inspired interface.

## Features

- Browse and play various radio stations
- Modern UI with dark theme
- Responsive design for all devices
- Volume control
- Station favorites
- Resume playback - Remembers your last played station and continues from where you left off
- Optimized images - All station logos are downloaded, resized, compressed, and converted to WebP format

## Tech Stack

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/)
- [Sharp](https://sharp.pixelplumbing.com/) - For image processing

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Image Optimization

All radio station images have been optimized for web use. The process includes:

1. Downloading images from external sources
2. Resizing to a maximum of 256x256 pixels
3. Compressing with 80% quality
4. Converting to WebP format for better performance

To run the image optimization process:

```bash
node downloadAndOptimizeImages.js
```

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to manage Git hooks. Before each commit, the following checks are automatically run:

1. **Linting**: Runs `npm run lint` to check for code style issues
2. **TypeScript Compilation**: Runs `npx tsc --noEmit` to check for TypeScript errors

If either of these checks fail, the commit will be aborted. Please fix any issues before committing your changes.

## Project Structure

```
app/              # Next.js app directory
components/       # Reusable components
lib/              # Utility functions
public/           # Static assets
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [shadcn/ui Documentation](https://ui.shadcn.com/) - learn about building with shadcn/ui
- [Tailwind CSS Documentation](https://tailwindcss.com/docs/) - learn about Tailwind CSS

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.