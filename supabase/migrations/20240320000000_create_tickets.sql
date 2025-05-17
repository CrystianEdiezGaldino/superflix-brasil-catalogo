-- Create tickets table
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    category TEXT NOT NULL CHECK (category IN ('content', 'subscription', 'technical', 'other')),
    admin_response TEXT,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS tickets_user_id_idx ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS tickets_status_idx ON public.tickets(status);
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON public.tickets(created_at);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tickets"
    ON public.tickets
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
    ON public.tickets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets"
    ON public.tickets
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Admin policies
CREATE POLICY "Admins can view all tickets"
    ON public.tickets
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update all tickets"
    ON public.tickets
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER handle_tickets_updated_at
    BEFORE UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at(); 