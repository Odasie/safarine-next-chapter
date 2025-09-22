-- Add RLS policies for admin tour management
-- First, allow authenticated users to insert tours (we'll refine this later)
CREATE POLICY "Authenticated users can create tours" 
ON public.tours 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update tours
CREATE POLICY "Authenticated users can update tours" 
ON public.tours 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete tours
CREATE POLICY "Authenticated users can delete tours" 
ON public.tours 
FOR DELETE 
TO authenticated
USING (true);

-- Also need policies for images table to allow tour image management
CREATE POLICY "Authenticated users can create tour images" 
ON public.images 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update tour images" 
ON public.images 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete tour images" 
ON public.images 
FOR DELETE 
TO authenticated
USING (true);