-- ==========================================
-- LUXEORA DATABASE SCHEMA & SECURITY SETUP
-- ==========================================

-- NOTE: Ensure the uuid-ossp extension is enabled for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. PUBLIC CONTENT TABLES (Catalog, Zones, etc.)
-- ==========================================

CREATE TABLE IF NOT EXISTS luxury_moods (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "ambientBg" TEXT,
    "accentColor" TEXT,
    "cardStyle" TEXT,
    "glowStyle" TEXT,
    fonts TEXT
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    rating NUMERIC,
    category TEXT CHECK (category IN ('gold', 'silver', 'diamond', 'precious-stones', 'bridal')) NOT NULL,
    image TEXT,
    metal TEXT,
    stone TEXT,
    weight TEXT,
    hallmark TEXT,
    purity TEXT,
    description TEXT,
    "longDescription" TEXT,
    specifications JSONB,
    "isTrending" BOOLEAN DEFAULT FALSE,
    "isFeatured" BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    author TEXT NOT NULL,
    rating NUMERIC NOT NULL,
    date TEXT,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews("productId");

CREATE TABLE IF NOT EXISTS showroom_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "bgHex" TEXT,
    "imageUrl" TEXT,
    "spotlightTarget" TEXT REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS showroom_hotspots (
    id TEXT PRIMARY KEY,
    "zoneId" TEXT REFERENCES showroom_zones(id) ON DELETE CASCADE NOT NULL,
    "productId" TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    x NUMERIC NOT NULL,
    y NUMERIC NOT NULL,
    title TEXT,
    price TEXT,
    "shimmerColor" TEXT
);
CREATE INDEX IF NOT EXISTS idx_showroom_hotspots_zone_id ON showroom_hotspots("zoneId");

CREATE TABLE IF NOT EXISTS stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tag TEXT,
    excerpt TEXT,
    content TEXT,
    image TEXT,
    duration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 2. PRIVATE/USER DATA TABLES (Profiles, Cart, Wishlist, Orders)
-- ==========================================

-- PROFILES (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'customer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent errors on multiple runs
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- CART ITEMS
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    selected_size TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id, selected_size) -- Prevent duplicate identical items, just update qty
);
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart_items(user_id);

-- WISHLIST ITEMS
CREATE TABLE IF NOT EXISTS wishlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist_items(user_id);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
    shipping_method TEXT NOT NULL,
    items_subtotal NUMERIC NOT NULL,
    shipping_cost NUMERIC NOT NULL,
    insurance_cost NUMERIC NOT NULL,
    promo_discount NUMERIC NOT NULL DEFAULT 0,
    final_total NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL, -- Keep item even if product is deleted
    product_name TEXT NOT NULL, -- snapshot of name
    price NUMERIC NOT NULL, -- snapshot of price at purchase
    quantity INTEGER NOT NULL,
    selected_size TEXT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE luxury_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE showroom_hotspots ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. SECURE ADMIN CHECK FUNCTION
-- ==========================================

-- Function to check if the current auth user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT (role = 'admin') INTO is_admin FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(is_admin, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 5. RLS POLICIES
-- ==========================================

-- -----------------------------------------------------
-- PUBLIC CONTENT (Read for everyone, Write for Admins)
-- -----------------------------------------------------

DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY['luxury_moods', 'products', 'showroom_zones', 'showroom_hotspots', 'stories'])
    LOOP
        -- Drop existing to avoid conflicts if re-running
        EXECUTE format('DROP POLICY IF EXISTS "Public Read %I" ON %I;', tbl, tbl);
        EXECUTE format('DROP POLICY IF EXISTS "Admin Write %I" ON %I;', tbl, tbl);

        -- Public Read
        EXECUTE format('CREATE POLICY "Public Read %I" ON %I FOR SELECT USING (true);', tbl, tbl);
        -- Admin All Operations
        EXECUTE format('CREATE POLICY "Admin Write %I" ON %I FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());', tbl, tbl);
    END LOOP;
END $$;

-- Product Reviews: Public read, Authenticated users can insert their own (or admin manages)
DROP POLICY IF EXISTS "Public Read Reviews" ON product_reviews;
DROP POLICY IF EXISTS "Auth Users Insert Reviews" ON product_reviews;
DROP POLICY IF EXISTS "Admin Write Reviews" ON product_reviews;

CREATE POLICY "Public Read Reviews" ON product_reviews FOR SELECT USING (true);
CREATE POLICY "Auth Users Insert Reviews" ON product_reviews FOR INSERT TO authenticated WITH CHECK (true); 
CREATE POLICY "Admin Write Reviews" ON product_reviews FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- -----------------------------------------------------
-- PRIVATE USER DATA (Owner Read/Write, Admin Read/Write)
-- -----------------------------------------------------

-- PROFILES
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin read/write profiles" ON profiles;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Admin read/write profiles" ON profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CART ITEMS
DROP POLICY IF EXISTS "Users manage own cart" ON cart_items;
DROP POLICY IF EXISTS "Admin manage all carts" ON cart_items;

CREATE POLICY "Users manage own cart" ON cart_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage all carts" ON cart_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- WISHLIST ITEMS
DROP POLICY IF EXISTS "Users manage own wishlist" ON wishlist_items;
DROP POLICY IF EXISTS "Admin manage all wishlists" ON wishlist_items;

CREATE POLICY "Users manage own wishlist" ON wishlist_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage all wishlists" ON wishlist_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ORDERS
DROP POLICY IF EXISTS "Users read own orders" ON orders;
DROP POLICY IF EXISTS "Users insert own orders" ON orders;
DROP POLICY IF EXISTS "Admin manage all orders" ON orders;

CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admin manage all orders" ON orders FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ORDER ITEMS
DROP POLICY IF EXISTS "Users read own order items" ON order_items;
DROP POLICY IF EXISTS "Users insert own order items" ON order_items;
DROP POLICY IF EXISTS "Admin manage all order items" ON order_items;

-- A user can read/insert order items if they own the parent order
CREATE POLICY "Users read own order items" ON order_items FOR SELECT 
USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Users insert own order items" ON order_items FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

CREATE POLICY "Admin manage all order items" ON order_items FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
