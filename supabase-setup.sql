-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;

-- Create users table (based on users-table-schema.md)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  created_at BIGINT NOT NULL DEFAULT extract(epoch from now()) * 1000, -- Timestamp in milliseconds
  
  -- Currency System
  epic_coins INTEGER DEFAULT 1000,
  
  -- Gorbz Collectible System
  gorbz TEXT[] DEFAULT '{}', -- Array of Gorbz IDs
  main_gorb TEXT, -- Currently equipped Gorbz ID
  
  -- Login & Activity
  daily_bonus_claimed_at BIGINT, -- Timestamp in milliseconds
  last_login BIGINT, -- Timestamp in milliseconds
  
  -- Stats and Tracking
  gorbz_collected_total INTEGER DEFAULT 0,
  gorbz_fused INTEGER DEFAULT 0,
  
  -- Customization & Access
  custom_room_theme TEXT DEFAULT 'classic',
  is_admin BOOLEAN DEFAULT false,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create gorbz reference table (simple catalog of all available Gorbz)
CREATE TABLE public.gorbz (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  rarity TEXT NOT NULL, -- 'Ahh', 'Crusty', 'Bombaclat', 'Epic', 'RayOfSunshine'
  style_data JSONB NOT NULL, -- Visual styling information
  price_epic_coins INTEGER, -- Cost in EpicCoins (NULL if not purchasable)
  drop_rate DECIMAL(6,5), -- Chance to drop (0.00001 = 0.001%)
  is_purchasable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gorbz ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for gorbz (everyone can read the catalog)
CREATE POLICY "Anyone can view gorbz catalog" ON public.gorbz
  FOR SELECT USING (true);

-- Function to handle user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for automatic user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert starter Gorbz catalog
INSERT INTO public.gorbz (id, name, description, rarity, style_data, price_epic_coins, drop_rate) VALUES
-- Ahh Gorbz (most common)
('basic_gold', 'Basic Gold', 'A simple golden orb', 'Ahh', '{"colors": ["#FFD700"], "effects": ["glow"]}', 50, 0.15000),
('silver_shine', 'Silver Shine', 'Classic silver look', 'Ahh', '{"colors": ["#C0C0C0"], "effects": ["shine"]}', 40, 0.18000),
('bronze_glow', 'Bronze Glow', 'Warm bronze finish', 'Ahh', '{"colors": ["#CD7F32"], "effects": ["warm_glow"]}', 30, 0.20000),

-- Crusty Gorbz
('neon_pulse', 'Neon Pulse', 'Pulsing neon energy', 'Crusty', '{"colors": ["#00FFFF", "#FF00FF"], "effects": ["pulse", "neon"]}', 200, 0.08000),
('fire_ring', 'Fire Ring', 'Blazing fire effect', 'Crusty', '{"colors": ["#FF4500", "#FFD700"], "effects": ["fire", "flicker"]}', 250, 0.06000),
('ice_crystal', 'Ice Crystal', 'Crystalline ice structure', 'Crusty', '{"colors": ["#ADD8E6", "#FFFFFF"], "effects": ["frost", "sparkle"]}', 300, 0.05000),

-- Bombaclat Gorbz
('plasma_core', 'Plasma Core', 'Swirling plasma energy', 'Bombaclat', '{"colors": ["#8A2BE2", "#FF1493"], "effects": ["plasma", "swirl"]}', 1000, 0.02000),
('galaxy_spiral', 'Galaxy Spiral', 'Miniature galaxy', 'Bombaclat', '{"colors": ["#191970", "#4B0082", "#FFFFFF"], "effects": ["rotate", "stars"]}', 1500, 0.01500),
('lightning_storm', 'Lightning Storm', 'Electric energy sphere', 'Bombaclat', '{"colors": ["#FFFF00", "#FFFFFF"], "effects": ["lightning", "storm"]}', 2000, 0.01000),

-- Epic Gorbz
('quantum_matrix', 'Quantum Matrix', 'Reality-bending quantum field', 'Epic', '{"colors": ["#FF00FF", "#00FFFF", "#FFFFFF"], "effects": ["quantum", "matrix"]}', 10000, 0.00200),
('phoenix_rebirth', 'Phoenix Rebirth', 'Eternal phoenix fire', 'Epic', '{"colors": ["#FF4500", "#FFD700", "#FFFFFF"], "effects": ["phoenix", "rebirth"]}', 15000, 0.00150),

-- RayOfSunshine Gorbz (ultra rare)
('universe_heart', 'Universe Heart', 'The beating heart of reality', 'RayOfSunshine', '{"colors": ["#800080", "#FF1493", "#FFD700"], "effects": ["universe", "heartbeat"]}', null, 0.00010),
('rng_god_avatar', 'RNG God Avatar', 'Avatar of the RNG Gods', 'RayOfSunshine', '{"colors": ["#FFD700", "#FFFFFF", "#FF69B4"], "effects": ["divine", "rng_blessing"]}', null, 0.00005);