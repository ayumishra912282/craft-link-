-- CraftLink Database Schema for Supabase PostgreSQL (SIH 2026)

-- 1. Enable pgvector extension for AI embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Profiles / Users Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('artisan', 'buyer', 'admin')),
    phone TEXT,
    craft_type TEXT,
    state TEXT,
    region TEXT,
    preferred_language TEXT DEFAULT 'en',
    craft_story TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || substr(md5(random()::text), 1, 8)),
    artisan_id TEXT NOT NULL,
    artisan_name TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    short_description TEXT,
    category TEXT NOT NULL,
    craft_type TEXT NOT NULL,
    material TEXT NOT NULL,
    colors JSONB DEFAULT '[]'::jsonb,
    region TEXT NOT NULL,
    state TEXT NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.0,
    tags JSONB DEFAULT '[]'::jsonb,
    buyer_segments JSONB DEFAULT '[]'::jsonb,
    craft_story TEXT,
    image_url TEXT NOT NULL,
    status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    ai_generated BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    embedding vector(768), -- Embedding vector for Gemini text-embedding-004
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Inquiries Table
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Indexes for fast search & filtering
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_artisan_id ON public.products(artisan_id);
CREATE INDEX IF NOT EXISTS idx_products_craft_type ON public.products(craft_type);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_state ON public.products(state);

-- 6. Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Public can read published products
CREATE POLICY "Public read published products" ON public.products
    FOR SELECT USING (status = 'published');

-- Artisans can view, create, update, delete their own products
CREATE POLICY "Artisan full access to own products" ON public.products
    FOR ALL USING (auth.uid()::text = artisan_id);

-- Profiles readable by authenticated users
CREATE POLICY "Public profiles viewable by all" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Anyone can submit an inquiry
CREATE POLICY "Anyone can insert inquiry" ON public.inquiries
    FOR INSERT WITH CHECK (true);
