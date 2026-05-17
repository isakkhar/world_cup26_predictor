-- ==========================================
-- 🏆 WORLD CUP 2026 BRACKET PREDICTOR SCHEMA
-- ==========================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/zyelexoolsfyvdipyvgy/sql/new)

-- 1. Create the predictions table
CREATE TABLE IF NOT EXISTS public.predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL,
    selections JSONB NOT NULL,
    score INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS) to keep the database secure
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;

-- 3. Create Public Read Access Policy (Allow anyone to read brackets for sharing and leaderboard)
CREATE POLICY "Allow public read access" 
ON public.predictions
FOR SELECT 
USING (true);

-- 4. Create Public Insert Access Policy (Allow anyone to submit/save their predictions)
CREATE POLICY "Allow public insert access" 
ON public.predictions
FOR INSERT 
WITH CHECK (true);

-- 5. Create index on score for ultra-fast leaderboard ranking queries
CREATE INDEX IF NOT EXISTS predictions_score_idx ON public.predictions (score DESC);


-- ====================================================================
-- 🔐 USER AUTHENTICATION & MULTI-DEVICE BRACKET SYNC UPDATE
-- ====================================================================
-- Run the following script in your Supabase SQL Editor (https://supabase.com/dashboard/project/zyelexoolsfyvdipyvgy/sql/new)
-- if you are upgrading an existing project!

-- 1. Add user_id column linking to auth.users table
ALTER TABLE public.predictions 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Make user_id UNIQUE so each authenticated user has exactly 1 active bracket
-- (This allows us to perform high-performance UPSERTS: 1 User = 1 Bracket)
ALTER TABLE public.predictions 
ADD CONSTRAINT predictions_user_id_key UNIQUE (user_id);

-- 3. Create Update Access Policy (Allow authenticated users to edit/update their own predictions)
CREATE POLICY "Allow authenticated users to update their own predictions" 
ON public.predictions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. Create Delete Access Policy (Allow users to delete/reset their predictions if needed)
CREATE POLICY "Allow authenticated users to delete their own predictions" 
ON public.predictions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

