# The Nexuz

A Next.js 15 web application featuring three distinct brand experiences with interactive gaming elements:

## 🌌 Nexuz
The main site showcases a space-themed interface with interactive particle effects and modern UI components.

## ⚰️ Death Booty
A hardcore skating brand section featuring:
- Team members and profiles
- Merchandise showcase
- Media gallery
- Contact information

## 🎰 Epic RNG World
An immersive gambling/gaming platform featuring:
- **Epic Coins (EC)** virtual currency system
- **Spin the Wheel** - Interactive wheel game with various prizes and penalties
- **Gorbz Collectibles** - Rare collectible system with different rarities
- **Live Jackpot** - Real-time updating mega jackpot display
- User authentication with Supabase
- Real-time updates and notifications

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Radix UI primitives, Tailwind CSS
- **Database**: Supabase with PostgreSQL
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime subscriptions
- **TypeScript**: Full type safety
- **Styling**: Custom animations, gradients, and effects
- **Icons**: Lucide React

## Features

### Core Features
- Responsive design across all screen sizes
- Interactive particle animations
- Modern component architecture
- Dark theme optimized
- Type-safe development

### Gaming Features
- **Virtual Economy**: Epic Coins (EC) currency system
- **Wheel of Fortune**: Spin-to-win mechanics with weighted outcomes
- **User Profiles**: Username, coins, collectibles tracking
- **Real-time Updates**: Live jackpot and profile synchronization
- **Collectible System**: Gorbz with rarity tiers (Ahh, Crusty, Bombaclat, Epic, RayOfSunshine)
- **Authentication**: Secure user registration and login

### Database Schema
- **Users Table**: Profiles, coins, collectibles, stats
- **Gorbz Table**: Collectible catalog with rarity and pricing
- **Prizes Table**: Jackpot and reward tracking

## Getting Started

```bash
# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase credentials

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Environment Setup

Create a `.env.local` file with:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL script in `supabase-setup.sql` to create tables and policies
3. Configure Row Level Security (RLS) policies
4. Set up real-time subscriptions for live updates

## Project Structure

```
app/
├── page.tsx                    # Main Nexuz landing
├── layout.tsx                  # Root layout with auth provider
├── deathbooty/                 # Death Booty brand section
│   ├── page.tsx               # DB homepage
│   ├── members/               # Team profiles
│   ├── merch/                 # Merchandise
│   ├── media/                 # Gallery
│   └── contact/               # Contact info
├── epicrngworld/              # Gaming platform
│   ├── page.tsx               # Main gaming hub
│   └── wheel/                 # Wheel game
components/
├── auth/                      # Authentication components
├── nexuz-hero.tsx             # Main hero component
├── particles.tsx              # Particle effects
└── ui/                        # Radix UI components
contexts/
├── auth-context.tsx           # Authentication state management
lib/
├── supabase.ts               # Supabase client configuration
├── supabase-server.ts        # Server-side Supabase client
└── utils.ts                  # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Game Mechanics

### Epic Coins System
- Starting balance: 1,000 EC
- Wheel spin cost: 200 EC
- Prizes range from 150 EC to 100,000 EC
- Special outcomes: DOUBLE (2x coins), LOSE ALL, BANKRUPT

### Wheel Game
- 16 segments with weighted probabilities
- Higher value prizes have lower chances
- Real-time coin updates
- Animated celebrations for wins

### Collectibles (Gorbz)
- 5 rarity tiers with different drop rates
- Visual effects and styling variations
- Purchasable with Epic Coins or rare drops
- Customizable room themes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.