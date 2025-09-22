-- Add the missing published_at column to the tours table
ALTER TABLE public.tours 
ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;

-- Add comment to the column for documentation
COMMENT ON COLUMN public.tours.published_at IS 'Timestamp when the tour was published and made visible to the public';

-- Create function to automatically set published_at when status changes to published
CREATE OR REPLACE FUNCTION public.update_tour_published_at()
RETURNS TRIGGER AS $$
BEGIN
  -- If status is being changed to 'published' and published_at is null, set it to now
  IF NEW.status = 'published' AND OLD.status != 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  
  -- If status is being changed away from 'published', clear published_at
  IF NEW.status != 'published' AND OLD.status = 'published' THEN
    NEW.published_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update published_at
CREATE TRIGGER trigger_update_tour_published_at
  BEFORE UPDATE ON public.tours
  FOR EACH ROW
  EXECUTE FUNCTION public.update_tour_published_at();

-- Backfill existing published tours with published_at timestamp
UPDATE public.tours 
SET published_at = COALESCE(updated_at, created_at)
WHERE status = 'published' AND published_at IS NULL;