-- Add permissive write policies to pages table
-- Match the pattern used on tours and images tables

-- Policy: Allow authenticated users to create pages
CREATE POLICY "Allow all inserts on pages" 
ON public.pages
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update pages
CREATE POLICY "Allow all updates on pages" 
ON public.pages
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete pages
CREATE POLICY "Allow all deletes on pages" 
ON public.pages
FOR DELETE 
TO authenticated
USING (true);