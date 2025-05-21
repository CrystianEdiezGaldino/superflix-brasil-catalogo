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
    days_valid INTEGER DEFAULT 30,
    created_by UUID REFERENCES auth.users(id)
);

-- Add max_uses column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'promo_codes' 
        AND column_name = 'max_uses'
    ) THEN
        ALTER TABLE promo_codes ADD COLUMN max_uses INTEGER;
    END IF;
END $$;

-- Add current_uses column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'promo_codes' 
        AND column_name = 'current_uses'
    ) THEN
        ALTER TABLE promo_codes ADD COLUMN current_uses INTEGER DEFAULT 0;
    END IF;
END $$;

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

-- Drop existing function if exists
DROP FUNCTION IF EXISTS redeem_promo_code(text);

-- Create function to redeem promo code
CREATE OR REPLACE FUNCTION redeem_promo_code(code_text TEXT)
RETURNS JSONB AS $$
DECLARE
    promo_record promo_codes;
    user_id UUID;
    subscription_record subscriptions;
    trial_end TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Get current user
    user_id := auth.uid();
    IF user_id IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Usuário não autenticado'
        );
    END IF;

    -- Find promo code
    SELECT * INTO promo_record
    FROM promo_codes
    WHERE code = code_text
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (usage_limit IS NULL OR usage_count < usage_limit);

    IF promo_record IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'message', 'Código promocional inválido ou expirado'
        );
    END IF;

    -- Check if user already has a subscription
    SELECT * INTO subscription_record
    FROM subscriptions
    WHERE subscriptions.user_id = auth.uid();

    -- Calculate trial end date
    trial_end := NOW() + (promo_record.days_valid || ' days')::INTERVAL;

    -- Update or insert subscription
    IF subscription_record IS NULL THEN
        INSERT INTO subscriptions (
            user_id,
            plan_type,
            status,
            current_period_start,
            trial_end,
            created_at,
            updated_at
        ) VALUES (
            auth.uid(),
            'trial',
            'trialing',
            NOW(),
            trial_end,
            NOW(),
            NOW()
        );
    ELSE
        UPDATE subscriptions
        SET 
            plan_type = 'trial',
            status = 'trialing',
            current_period_start = NOW(),
            trial_end = trial_end,
            updated_at = NOW()
        WHERE subscriptions.user_id = auth.uid();
    END IF;

    -- Increment usage count
    UPDATE promo_codes
    SET usage_count = usage_count + 1
    WHERE id = promo_record.id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Código promocional resgatado com sucesso!',
        'days_valid', promo_record.days_valid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 