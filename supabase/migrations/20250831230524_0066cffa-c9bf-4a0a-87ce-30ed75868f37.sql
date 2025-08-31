-- Add missing foreign key constraint between tours and pages
ALTER TABLE public.tours 
ADD CONSTRAINT tours_page_id_fkey 
FOREIGN KEY (page_id) 
REFERENCES public.pages(id) 
ON DELETE SET NULL;