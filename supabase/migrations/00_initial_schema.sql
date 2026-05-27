-- Initial schema creation for Luxeora luxury jewellery database (CamelCase exact match for frontend)

-- 1. Luxury Moods Config table
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

-- 2. Products table
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

-- 3. Product Reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" TEXT REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    author TEXT NOT NULL,
    rating NUMERIC NOT NULL,
    date TEXT,
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews("productId");

-- 4. Showroom Zones table
CREATE TABLE IF NOT EXISTS showroom_zones (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    "bgHex" TEXT,
    "imageUrl" TEXT,
    "spotlightTarget" TEXT REFERENCES products(id) ON DELETE SET NULL
);

-- 5. Showroom Hotspots table
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

-- 6. Stories table
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
