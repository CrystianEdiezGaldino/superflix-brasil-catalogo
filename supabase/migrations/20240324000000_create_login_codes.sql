-- Create login_codes table
CREATE TABLE IF NOT EXISTS public.login_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    device_info JSONB
);

-- Add RLS policies
ALTER TABLE public.login_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create a login code
CREATE POLICY "Anyone can create login codes"
ON public.login_codes FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to read login codes
CREATE POLICY "Anyone can read login codes"
ON public.login_codes FOR SELECT
TO public
USING (true);

-- Allow authenticated users to update their own login codes
CREATE POLICY "Users can update their own login codes"
ON public.login_codes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS login_codes_code_idx ON public.login_codes (code);
CREATE INDEX IF NOT EXISTS login_codes_user_id_idx ON public.login_codes (user_id); 