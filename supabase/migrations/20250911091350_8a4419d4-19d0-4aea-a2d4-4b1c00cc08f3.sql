-- Create contact_leads table for storing contact form submissions
CREATE TABLE public.contact_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message_type VARCHAR(50),
  message TEXT NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'contact_page',
  status VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public inserts (contact form submissions)
CREATE POLICY "Allow public contact form submissions" 
ON public.contact_leads 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow system functions to read (for email sending)
CREATE POLICY "System functions can read contact leads" 
ON public.contact_leads 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_contact_leads_updated_at
BEFORE UPDATE ON public.contact_leads
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for better performance
CREATE INDEX idx_contact_leads_created_at ON public.contact_leads(created_at DESC);
CREATE INDEX idx_contact_leads_status ON public.contact_leads(status);
CREATE INDEX idx_contact_leads_email ON public.contact_leads(email);