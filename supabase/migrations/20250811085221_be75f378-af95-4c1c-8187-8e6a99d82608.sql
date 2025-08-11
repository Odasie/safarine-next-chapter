
-- 1) Create a public storage bucket for imported images
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

-- 2) Public read policy for the site-images bucket
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read for site-images'
  ) then
    create policy "Public read for site-images"
    on storage.objects
    for select
    to public
    using (bucket_id = 'site-images');
  end if;
end $$;

-- 3) Enable RLS on content tables (reads will be public, writes via service role in edge functions)
alter table public.pages enable row level security;
alter table public.images enable row level security;
alter table public.tours enable row level security;
alter table public.categories enable row level security;
alter table public.page_categories enable row level security;

-- 4) Public read policies for content tables
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'pages'
      and policyname = 'Public read pages'
  ) then
    create policy "Public read pages"
    on public.pages
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'images'
      and policyname = 'Public read images'
  ) then
    create policy "Public read images"
    on public.images
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'tours'
      and policyname = 'Public read tours'
  ) then
    create policy "Public read tours"
    on public.tours
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'categories'
      and policyname = 'Public read categories'
  ) then
    create policy "Public read categories"
    on public.categories
    for select
    using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'page_categories'
      and policyname = 'Public read page_categories'
  ) then
    create policy "Public read page_categories"
    on public.page_categories
    for select
    using (true);
  end if;
end $$;

-- 5) Extend images table to store image metadata
alter table public.images
  add column if not exists width integer,
  add column if not exists height integer,
  add column if not exists mime_type text,
  add column if not exists size_bytes bigint,
  add column if not exists title text,
  add column if not exists source_url text,
  add column if not exists checksum text;

-- Useful indexes for images lookups & dedupe
create index if not exists images_page_id_idx on public.images(page_id);
create unique index if not exists images_checksum_uidx on public.images(checksum) where checksum is not null;

-- 6) Ensure slugs are unique for SEO consistency
create unique index if not exists pages_slug_uidx on public.pages(slug);

-- 7) Store currency in tours (default to THB)
alter table public.tours
  add column if not exists currency text not null default 'THB';
