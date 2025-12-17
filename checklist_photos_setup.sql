-- 1. Create the bucket if not exists (This usually requires dashboard, but we can try via SQL or just policies)
-- NOTE: In Supabase, creating a bucket via SQL is not standard SQL. 
-- The user should create the bucket 'checklist-photos' manually in the dashboard as instructed.

-- 2. Enable RLS and Policies for Storage (objects table in storage schema)
-- Allow public access to view photos
create policy "Public Access to Photos"
  on storage.objects for select
  using ( bucket_id = 'checklist-photos' );

-- Allow authenticated users to upload photos
create policy "Authenticated Users can Upload Photos"
  on storage.objects for insert
  with check ( bucket_id = 'checklist-photos' and auth.role() = 'authenticated' );

-- 3. Update the database table
-- Add photos_url column to save the links
ALTER TABLE public.service_checklists
ADD COLUMN IF NOT EXISTS photos_url text[] DEFAULT '{}';
