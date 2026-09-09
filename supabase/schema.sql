

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'attendee' CHECK (role IN ('attendee', 'admin', 'organizer')),
  loyalty_points INTEGER DEFAULT 0,
  status TEXT DEFAULT 'member' CHECK (status IN ('member', 'insider', 'vip')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  city TEXT NOT NULL DEFAULT 'Accra',
  date_display TEXT NOT NULL,
  doors_open TEXT NOT NULL DEFAULT '6:30 PM',
  category TEXT NOT NULL CHECK (category IN ('music', 'sports', 'arts', 'festivals', 'comedy')),
  image_url TEXT NOT NULL,
  is_selling_fast BOOLEAN DEFAULT FALSE,
  is_verified_seller BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TICKET TIERS TABLE
CREATE TABLE IF NOT EXISTS public.ticket_tiers (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tier_label TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GHS',
  quantity INTEGER NOT NULL DEFAULT 100,
  available INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  event_id TEXT REFERENCES public.events(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL,
  ticket_type TEXT NOT NULL,
  ticket_count INTEGER NOT NULL DEFAULT 1,
  subtotal NUMERIC(10, 2) NOT NULL,
  fees NUMERIC(10, 2) NOT NULL DEFAULT 0,
  processing_fee NUMERIC(10, 2) NOT NULL DEFAULT 2.50,
  total NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  payment_method TEXT NOT NULL,
  receipt_email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'pending', 'cancelled')),
  paystack_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TICKETS TABLE (Passes generated per order)
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  event_id TEXT REFERENCES public.events(id) ON DELETE SET NULL,
  tier_id TEXT REFERENCES public.ticket_tiers(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL,
  date_display TEXT NOT NULL,
  venue TEXT NOT NULL,
  section TEXT DEFAULT 'General',
  row_num TEXT DEFAULT 'GA',
  seat_num TEXT DEFAULT '1',
  tier_label TEXT NOT NULL,
  qr_code_payload TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ADMIN AUDIT & ACCESS LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id TEXT,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RESALE LISTINGS TABLE (P2P Ticket Marketplace)
CREATE TABLE IF NOT EXISTS public.resale_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES public.tickets(id) ON DELETE CASCADE,
  seller_email TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  event_id TEXT REFERENCES public.events(id) ON DELETE SET NULL,
  event_title TEXT NOT NULL,
  event_date TEXT,
  venue TEXT,
  tier_label TEXT NOT NULL,
  original_price NUMERIC(10, 2),
  asking_price NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'sold')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ADD EXTERNAL EVENT COLUMNS (idempotent)
DO $$ BEGIN
  ALTER TABLE public.events ADD COLUMN IF NOT EXISTS is_external_listing BOOLEAN DEFAULT FALSE;
  ALTER TABLE public.events ADD COLUMN IF NOT EXISTS organizer_name TEXT;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resale_listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid collision
DROP POLICY IF EXISTS "Public can view all events" ON public.events;
DROP POLICY IF EXISTS "Public can insert events" ON public.events;
DROP POLICY IF EXISTS "Public can update events" ON public.events;
DROP POLICY IF EXISTS "Public can delete events" ON public.events;

DROP POLICY IF EXISTS "Public can view all ticket tiers" ON public.ticket_tiers;
DROP POLICY IF EXISTS "Public can insert ticket tiers" ON public.ticket_tiers;
DROP POLICY IF EXISTS "Public can update ticket tiers" ON public.ticket_tiers;
DROP POLICY IF EXISTS "Public can delete ticket tiers" ON public.ticket_tiers;

DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can create orders" ON public.orders;

DROP POLICY IF EXISTS "Public can view tickets" ON public.tickets;
DROP POLICY IF EXISTS "Public can create tickets" ON public.tickets;

DROP POLICY IF EXISTS "Public can view admin logs" ON public.admin_logs;
DROP POLICY IF EXISTS "Public can insert admin logs" ON public.admin_logs;

-- Re-create permissive policies for seamless application execution
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public can delete profiles" ON public.profiles;

CREATE POLICY "Public can view profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Public can delete profiles" ON public.profiles FOR DELETE USING (true);

CREATE POLICY "Public can view all events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public can insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Public can delete events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Public can view all ticket tiers" ON public.ticket_tiers FOR SELECT USING (true);
CREATE POLICY "Public can insert ticket tiers" ON public.ticket_tiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update ticket tiers" ON public.ticket_tiers FOR UPDATE USING (true);
CREATE POLICY "Public can delete ticket tiers" ON public.ticket_tiers FOR DELETE USING (true);

CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can create orders" ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Public can create tickets" ON public.tickets FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view admin logs" ON public.admin_logs FOR SELECT USING (true);
CREATE POLICY "Public can insert admin logs" ON public.admin_logs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view resale listings" ON public.resale_listings;
DROP POLICY IF EXISTS "Public can insert resale listings" ON public.resale_listings;
DROP POLICY IF EXISTS "Public can update resale listings" ON public.resale_listings;

CREATE POLICY "Public can view resale listings" ON public.resale_listings FOR SELECT USING (true);
CREATE POLICY "Public can insert resale listings" ON public.resale_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update resale listings" ON public.resale_listings FOR UPDATE USING (true);

-- ==============================================================================
-- 9. PERMISSIONS & GRANTS (Fixes 'permission denied for table events')
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ==============================================================================
-- SEED DATA (2026 EVENTS & TIERS)
-- ==============================================================================
INSERT INTO public.events (id, title, description, venue, venue_address, city, date_display, doors_open, category, image_url, is_selling_fast, is_verified_seller)
VALUES
(
  'neon-nights-2026',
  'Neon Nights Festival 2026',
  'Experience the electrifying soundscape of the Neon Nights Festival in Accra. Immersive visuals, thumping bass, and unforgettable memories at Downtown Arena.',
  'Downtown Arena',
  '12 Independence Ave, Accra',
  'Accra',
  'Fri, Oct 24, 2026 • 8:00 PM',
  '6:30 PM',
  'music',
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
  false,
  true
),
(
  'city-vipers-metro-stars',
  'City Vipers vs. Metro Stars 2026',
  'The rivalry continues! Watch the City Vipers take on the Metro Stars in this high-stakes championship showdown at Grand Stadium.',
  'Grand Stadium',
  'Accra Sports Complex',
  'Accra',
  'Sat, Nov 02, 2026 • 7:00 PM',
  '5:30 PM',
  'sports',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  true,
  true
),
(
  'glass-menagerie',
  'The Glass Menagerie Revival 2026',
  'A breathtaking modern revival of Tennessee Williams classic in an intimate theatre setting.',
  'Civic Playhouse',
  'Ring Road, Accra',
  'Accra',
  'Sun, Dec 15, 2026 • 7:30 PM',
  '7:00 PM',
  'arts',
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80',
  false,
  true
),
(
  'laugh-out-loud-gala',
  'Laugh Out Loud Gala 2026',
  'An evening of non-stop laughter featuring Ghana top comedians and special international guests.',
  'The Comedy Cellar',
  'Osu, Accra',
  'Accra',
  'Mon, Oct 28, 2026 • 8:00 PM',
  '7:30 PM',
  'comedy',
  'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1200&q=80',
  false,
  true
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  date_display = EXCLUDED.date_display,
  category = EXCLUDED.category;

-- Tiers Seed
INSERT INTO public.ticket_tiers (id, event_id, name, tier_label, description, price, currency, quantity, available)
VALUES
('neon-vip', 'neon-nights-2026', 'Front Row Access', 'VIP Pass', 'Includes early entry, exclusive merch bundle, and access to the VIP lounge.', 850.00, 'GHS', 50, 12),
('neon-ga', 'neon-nights-2026', 'General Admission', 'General', 'Standard entry to the festival grounds with access to all stages.', 150.00, 'GHS', 300, 145),
('vipers-vip', 'city-vipers-metro-stars', 'VIP Box', 'VIP', 'Premium box seating with complimentary refreshments.', 500.00, 'GHS', 30, 4),
('vipers-ga', 'city-vipers-metro-stars', 'Standard Seat', 'General', 'Standard stadium seating.', 80.00, 'GHS', 250, 88),
('glass-premium', 'glass-menagerie', 'Premium Orchestra', 'Premium', 'Front orchestra seating with post-show meet & greet.', 600.00, 'GHS', 40, 8),
('glass-standard', 'glass-menagerie', 'Standard Seat', 'Standard', 'Balcony and rear orchestra seating.', 200.00, 'GHS', 100, 42),
('laugh-vip', 'laugh-out-loud-gala', 'Front Row Table', 'VIP', 'Table for 2 with bottle service in the front row.', 400.00, 'GHS', 20, 3),
('laugh-ga', 'laugh-out-loud-gala', 'General Entry', 'General', 'Standard seating in the comedy hall.', 60.00, 'GHS', 150, 65)
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  available = EXCLUDED.available;

-- Initial Admin Log
INSERT INTO public.admin_logs (admin_email, action, target_type, target_id, details, ip_address)
VALUES
('admin@vibepass.com', 'SCHEMA_INIT', 'SYSTEM', '2026_RELEASE', '{"version": "2.0", "status": "active"}'::jsonb, '127.0.0.1');

-- FORCE RELOAD SCHEMA CACHE IN POSTGREST
NOTIFY pgrst, 'reload schema';
