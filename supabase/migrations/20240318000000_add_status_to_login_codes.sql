-- Add status column to login_codes table
ALTER TABLE public.login_codes ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.login_codes ADD COLUMN IF NOT EXISTS validated_at TIMESTAMPTZ;

-- Update existing records
UPDATE public.login_codes SET status = 'validated' WHERE user_id IS NOT NULL;
UPDATE public.login_codes SET status = 'expired' WHERE expires_at < NOW();

-- Create index for status column
CREATE INDEX IF NOT EXISTS login_codes_status_idx ON public.login_codes (status);

-- Update RLS policies to include status
DROP POLICY IF EXISTS "Users can update their own login codes" ON public.login_codes;
DROP POLICY IF EXISTS "Users can update login codes" ON public.login_codes;

-- Allow authenticated users to update pending codes
CREATE POLICY "Users can update pending codes"
ON public.login_codes FOR UPDATE
TO authenticated
USING (status = 'pending')
WITH CHECK (status = 'pending');

-- Allow authenticated users to read any code
CREATE POLICY "Users can read any code"
ON public.login_codes FOR SELECT
TO authenticated
USING (true); 