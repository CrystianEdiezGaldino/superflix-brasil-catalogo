-- Drop existing table if it exists
DROP TABLE IF EXISTS public.device_access;

-- Create device_access table
CREATE TABLE public.device_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_info JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.device_access ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own device access records
CREATE POLICY "Users can view their own device access"
ON public.device_access FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow users to insert their own device access records
CREATE POLICY "Users can insert their own device access"
ON public.device_access FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own device access records
CREATE POLICY "Users can update their own device access"
ON public.device_access FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS device_access_user_id_idx ON public.device_access (user_id);
CREATE INDEX IF NOT EXISTS device_access_created_at_idx ON public.device_access (created_at); 