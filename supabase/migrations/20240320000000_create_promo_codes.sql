-- Create promo_codes table
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS promo_codes_code_idx ON promo_codes(code);

-- Enable Row Level Security
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users" ON promo_codes
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for authenticated users" ON promo_codes
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON promo_codes
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Create function to validate promo code
CREATE OR REPLACE FUNCTION validate_promo_code(promo_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM promo_codes
        WHERE code = promo_code
        AND is_active = true
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (max_uses IS NULL OR current_uses < max_uses)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 