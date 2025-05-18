-- Add status column to login_codes table
ALTER TABLE public.login_codes ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Update existing records
UPDATE public.login_codes SET status = 'validated' WHERE user_id IS NOT NULL;
UPDATE public.login_codes SET status = 'expired' WHERE expires_at < NOW();

-- Create index for status column
CREATE INDEX IF NOT EXISTS login_codes_status_idx ON public.login_codes (status);

-- Update RLS policies to include status
DROP POLICY IF EXISTS "Users can update their own login codes" ON public.login_codes;
CREATE POLICY "Users can update their own login codes"
ON public.login_codes FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR status = 'pending')
WITH CHECK (auth.uid() = user_id OR status = 'pending'); 