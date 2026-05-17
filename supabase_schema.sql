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
