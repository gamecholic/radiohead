# RadioHead Design Guide

This design guide describes the visual and structural specifications for building the RadioHead app UI in **Next.js** using **shadcn/ui** and **Tailwind CSS**.

## 🎨 Color Palette

- **Background Gradient:**
  - From: `#0d1117`
  - To: `#0b0f14`
- **Primary Accent:** `#3b82f6` (Electric Blue)
- **Secondary Gradient:**
  - From: `#ec4899` (Pink)
  - To: `#f59e0b` (Amber)
- **Text Colors:**
  - Primary: `#ffffff`
  - Secondary: `rgba(255,255,255,0.7)`
  - Muted: `rgba(255,255,255,0.5)`

## 🖌 Visual Style

- **Glassmorphism:** Use `bg-white/5` or `bg-black/20` with `backdrop-blur-md` for panels.
- **Station Icons:**
  - Shape: `rounded-xl`
  - Size: Consistent square frames (e.g., `w-32 h-32` in grid, `w-16 h-16` in now-playing)
  - Background: Neutral or gradient if logo is missing.
  - Optional: `shadow-inner` for depth.
- **Gradients:** For CTAs and featured content backgrounds.
- **Hover Effects:**
  - Slight background lightening (`hover:bg-white/10`)
  - Cursor pointer for clickable icons.

## 📐 Layout Structure

### 1. Sidebar

- **Width:** `w-64`
- **Content:**
  - Logo at top
  - Nav links (Home, Browse, Library, Favorites)
  - Divider
  - "Your Stations" list (scrollable)

### 2. Top Bar

- **Height:** \~`h-16`
- **Content:**
  - Page title
  - Search bar (shadcn Input)
  - Profile Avatar

### 3. Hero Featured Station

- **Height:** \~`h-40`
- **Content:**
  - Large station image (placeholder if none)
  - Title, description
  - Gradient overlay for vibrancy
  - "Listen Now" button (gradient background)

### 4. Station Grid

- **Desktop:** `grid-cols-4`
- **Tablet:** `grid-cols-3`
- **Mobile:** `grid-cols-2`
- **Item Structure:**
  - Card with rounded-xl, background blur
  - Station icon inside consistent frame
  - Title + subtext (genre, listeners)

### 5. Now Playing Dock

- **Position:** Fixed bottom, full width (minus sidebar on desktop)
- **Background:** Glassmorphic black
- **Content:**
  - Left: Artwork, track title, station name, favorite star
  - Center: Playback controls + progress bar
  - Right: Volume slider

## 📱 Mobile Variants

- **Sidebar:** Collapsed into top hamburger menu.
- **Top Bar:**
  - Hamburger icon (left)
  - App title centered
  - Profile avatar or search icon (right)
- **Hero:** Full-width image with overlay, text stacked below.
- **Station Grid:** `grid-cols-2` with smaller icons (`w-24 h-24`).
- **Now Playing Dock:**
  - Height reduced (`h-16`)
  - Controls in center with smaller icons.
  - Volume hidden or in overflow menu.

## 📦 Component Mapping (shadcn/ui)

- **Button** → All CTAs and main playback buttons.
- **Card** → Station items, featured station block.
- **Input** → Search bar.
- **ScrollArea** → Sidebar "Your Stations" list.
- **Avatar** → Profile image.

## 🛠 Implementation Notes for AI Agent

1. **Normalize station logos**: Fit inside `rounded-xl` container with `object-cover`, `bg-white/10` if empty.
2. **Responsive breakpoints**:
   - `sm`: Collapse sidebar, adjust grids.
   - `md`: Show 3 columns grid.
   - `lg`: Full layout with sidebar + 4 columns.
3. **State styles**:
   - Favorite star toggles between muted and yellow.
   - Play button toggles to pause icon.
4. **Animation Suggestions**:
   - Fade-in for hero and grid on page load.
   - Scale-up hover effect for station cards.
5. **Accessibility**:
   - Use `aria-label` for icons.
   - Ensure color contrast meets WCAG AA.

## 📷 Example Color/Gradient Usage

```css
.bg-hero-gradient {
  background: linear-gradient(90deg, rgba(236,72,153,0.4) 0%, rgba(245,158,11,0.4) 100%);
}
.bg-primary-gradient {
  background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%);
}
```

---

This guide ensures the RadioHead app maintains a clean, cohesive, and responsive aesthetic across desktop and mobile while being easy to implement with Next.js + shadcn/ui + Tailwind.

