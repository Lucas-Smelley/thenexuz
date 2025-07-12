# The Nexuz

A Next.js 15 web application featuring two distinct brand experiences:

## 🌌 Nexuz
The main site showcases a space-themed interface with interactive particle effects and modern UI components.

## ⚰️ Death Booty
A hardcore skating brand section featuring:
- Team members and profiles
- Merchandise showcase
- Media gallery
- Contact information

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Radix UI primitives, Tailwind CSS
- **TypeScript**: Full type safety
- **Styling**: Custom animations, gradients, and effects

## Getting Started

```bash
# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
app/
├── page.tsx                    # Main Nexuz landing
├── layout.tsx                  # Root layout
├── deathbooty/                 # Death Booty brand section
│   ├── page.tsx               # DB homepage
│   ├── members/               # Team profiles
│   ├── merch/                 # Merchandise
│   ├── media/                 # Gallery
│   └── contact/               # Contact info
components/
├── nexuz-hero.tsx             # Main hero component
├── particles.tsx              # Particle effects
└── ui/                        # Radix UI components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

- Responsive design
- Interactive particle animations
- Modern component architecture
- Dark theme optimized
- Type-safe development