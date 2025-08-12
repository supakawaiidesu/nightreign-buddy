# Nightreign Buddy

A companion app for Elden Ring Nightreign that helps players track the day/night cycle and boss information during their runs.

## Features

- **Real-time Day/Night Cycle Timer**: Track all 4 phases with visual progress bars and customizable audio warnings
- **Boss Information System**: View detailed stats for all 8 Night bosses including resistances, weaknesses, and health
- **Clean Modular Architecture**: Components are split for easy maintenance and updates

## Project Structure

```
app/
├── page.tsx          # Main page component
├── layout.tsx        # Root layout
└── globals.css       # Global styles

components/
├── Timer.tsx         # Day/night cycle timer with phase progress
├── BossSelector.tsx  # Boss selection grid
└── BossInfoPanel.tsx # Detailed boss stats display

types/
└── index.ts          # TypeScript type definitions

constants/
└── index.ts          # Game constants and boss data

utils/
├── loadBossData.ts   # Boss data loading utilities
├── parseBossData.ts  # CSV parsing logic
└── images.ts         # Image path helpers
```

## Development

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
```

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Web Audio API for sound alerts