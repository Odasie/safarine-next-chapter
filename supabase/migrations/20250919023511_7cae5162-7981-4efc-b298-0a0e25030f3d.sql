-- Create tour-images storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tour-images', 
  'tour-images', 
  true, 
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to tour images
CREATE POLICY "Public read access for tour images" ON storage.objects
FOR SELECT USING (bucket_id = 'tour-images');

-- Policy for authenticated users to upload tour images
CREATE POLICY "Authenticated users can upload tour images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'tour-images' 
  AND auth.role() = 'authenticated'
);

-- Policy for authenticated users to update tour images
CREATE POLICY "Authenticated users can update tour images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'tour-images' 
  AND auth.role() = 'authenticated'
);

-- Policy for authenticated users to delete tour images
CREATE POLICY "Authenticated users can delete tour images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'tour-images' 
  AND auth.role() = 'authenticated'
);