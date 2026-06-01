# Bird Dog Mission Control Pro

A badass, production-ready video production pipeline dashboard for "The Bird Dog and the Tweakers" series. Built with Next.js 16, shadcn/ui, and a cyberpunk dark theme.

![Dashboard](https://img.shields.io/badge/Dashboard-v2.0-cyan)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **Dashboard**: Real-time stats, episodes overview, GPU workers status, render queue
- **Episodes Management**: Full CRUD, scene breakdown, character assignment, dialogue editing
- **Characters**: Cast management with voice assignment, personality traits
- **Script Builder**: Screenplay editor with scene auto-breakdown
- **Mission Control**: Batch operations, AI model config, voice settings, system config
- **Asset Library**: Images, audio, and video management with drag-drop upload
- **Settings**: User preferences, API keys, notifications

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16+ | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Zustand | State management |
| TanStack Query | Data fetching |
| Axios | HTTP client |
| Lucide | Icons |

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://100.98.72.30:3456    # Backend API URL
NEXT_PUBLIC_COLAB_URL=                          # Colab GPU worker ngrok URL
```

## Backend Integration

This frontend connects to the FastAPI backend running on port 3456. Make sure the backend is running before starting the frontend.

## Project Structure

```
app/
  page.tsx              # Dashboard
  episodes/
    page.tsx            # Episodes list
    [id]/page.tsx       # Episode detail
  characters/page.tsx   # Character management
  script-builder/       # Script editor
  mission-control/      # Batch operations
  assets/               # Asset library
  settings/             # User settings
  layout.tsx            # Root layout
  globals.css           # Theme styles

components/
  layout/               # Sidebar, Header
  providers/            # React Query provider
  ui/                   # shadcn components

hooks/                  # React Query hooks
stores/                 # Zustand stores
lib/                    # API client, utilities
types/                  # TypeScript types
```

## Theme

Cyberpunk-inspired dark theme with:
- Primary: Cyan (#00d4ff)
- Secondary: Purple (#a855f7)
- Success: Emerald (#10b981)
- Warning: Amber (#f59e0b)
- Background: Deep black (#0a0a0f)

## License

MIT

## Author

Built for The Bird Dog and the Tweakers production.
