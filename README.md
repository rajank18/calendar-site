# Calendar Site
https://calendar-site-tau.vercel.app/

A handcrafted calendar web app built with React and Vite.

The app combines a wall-calendar layout with sticky notes, month navigation, range selection, local persistence, theme switching, and decorative desk elements (polaroid, analog clock, and audio player).

## Screenshot

<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/574118b6-12f0-4595-b87b-e7a5b4a74d7b" />
<img width="1919" height="917" alt="image" src="https://github.com/user-attachments/assets/02bc2611-5f51-4b55-8263-5f6efe04d59a" />

## Features

- Monthly calendar with previous and next navigation
- Date range selection (single date, click range, drag range)
- Keyboard navigation support for date focus and selection
- Sticky notes linked to selected date range
- Note tag support and delete actions
- Notes export as image files (`.png` and `.jpg`)
- Local storage persistence for notes and theme
- Dynamic time-based greeting
- Analog desk clock component
- Ambient desk audio player with track controls
- Responsive layout for desktop, tablet, and mobile

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Three.js
- GSAP
- page-flip

## Installed Libraries

The project currently includes these dependencies in `package.json`:

- `react`, `react-dom`
- `vite`, `@vitejs/plugin-react`
- `tailwindcss`, `@tailwindcss/vite`
- `framer-motion`
- `three`
- `gsap`
- `page-flip`
- `turn.js`
- `jquery`

## Project Structure

```text
calendar-site/
├─ public/
├─ src/
│  ├─ assets/
│  │  ├─ Audios/
│  │  └─ Images/
│  ├─ components/
│  │  ├─ Calendar/
│  │  │  ├─ CalendarGrid.jsx
│  │  │  ├─ DayCell.jsx
│  │  │  ├─ MonthNavigator.jsx
│  │  │  └─ PaperFlipCanvas.jsx
│  │  ├─ Desk/
│  │  │  ├─ DeskLayout.jsx
│  │  │  ├─ DeskAudioPlayer.jsx
│  │  │  └─ DeskAnalogClock.jsx
│  │  ├─ Polaroid/
│  │  │  └─ PolaroidHero.jsx
│  │  ├─ StickyPad/
│  │  │  └─ StickyPad.jsx
│  │  └─ UI/
│  │     ├─ Badge.jsx
│  │     ├─ Button.jsx
│  │     └─ TagChip.jsx
│  ├─ constants/
│  │  ├─ colors.js
│  │  ├─ monthImages.js
│  │  └─ months.js
│  ├─ hooks/
│  │  ├─ useCalendar.js
│  │  ├─ useDateRange.js
│  │  ├─ useNotes.js
│  │  └─ useTheme.js
│  ├─ utils/
│  │  ├─ dateHelpers.js
│  │  ├─ holidays.js
│  │  └─ storage.js
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ index.css
├─ index.html
├─ eslint.config.js
├─ vite.config.js
└─ package.json
```

## Main Components

### `App.jsx`

Top-level orchestrator that wires calendar state, theme state, date range interactions, note storage, and export logic.

### `components/Desk/DeskLayout.jsx`

Composes the desk scene and places major visual modules:

- Polaroid card
- Calendar panel
- Sticky note pad
- Analog clock
- Audio player

### `components/Calendar/CalendarGrid.jsx`

Renders monthly date cells, weekday row, month header, and page-curl interactions for month transitions.

### `components/StickyPad/StickyPad.jsx`

Manages note input, tag selection, note listing, and note deletion for the active date range.

### `components/Polaroid/PolaroidHero.jsx`

Displays month-specific image content to reinforce the current month mood.

## Custom Hooks

### `hooks/useCalendar.js`

- Owns current month state
- Provides `nextMonth` and `prevMonth`
- Computes month day data and holiday metadata

### `hooks/useDateRange.js`

- Handles click and drag date selection
- Normalizes start and end ordering
- Supports keyboard focus movement and selection

### `hooks/useNotes.js`

- Stores notes keyed by selected range
- Persists notes in local storage
- Filters visible notes by active range

### `hooks/useTheme.js`

- Manages light and dark theme state
- Persists selected theme in local storage

## Utility Modules

### `utils/dateHelpers.js`

Date math and formatting helpers used across calendar and export logic.

### `utils/holidays.js`

Holiday lookup and monthly holiday summary helpers.

### `utils/storage.js`

Safe wrappers for reading and writing browser local storage.

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm 9+ recommended

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Create production build
- `npm run preview` - Serve the production build locally
- `npm run lint` - Run ESLint checks

## Data Persistence

The app stores the following in browser local storage:

- Notes by selected range
- Theme preference

No backend or external database is required.

## Notes

- This project is currently JavaScript-based (not TypeScript).
- Styling is a mix of component-level classes and global styles.
- If you add or rename assets, update paths in constants and components accordingly.
