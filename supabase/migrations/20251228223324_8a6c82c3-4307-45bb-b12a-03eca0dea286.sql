-- Create table for scan leads
CREATE TABLE public.oracle_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  website_url TEXT NOT NULL,
  scan_result TEXT NOT NULL,
  score INTEGER,
  status TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.oracle_leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anyone can submit a lead)
CREATE POLICY "Anyone can create leads" 
ON public.oracle_leads 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users can view leads (for admin)
CREATE POLICY "Only authenticated users can view leads" 
ON public.oracle_leads 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_oracle_leads_updated_at
BEFORE UPDATE ON public.oracle_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();