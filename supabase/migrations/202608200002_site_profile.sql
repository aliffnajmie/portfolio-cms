begin;

create extension if not exists pgcrypto;

create table if not exists public.site_profile (
  id uuid primary key default gen_random_uuid(),
  singleton_key boolean not null default true check (singleton_key = true),
  full_name text not null check (char_length(trim(full_name)) between 1 and 120),
  professional_title text not null check (char_length(trim(professional_title)) between 1 and 160),
  short_bio text not null check (char_length(trim(short_bio)) between 1 and 500),
  about_bio text null check (about_bio is null or char_length(about_bio) <= 5000),
  location text null check (location is null or char_length(location) <= 160),
  email text null check (email is null or email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text null check (phone is null or char_length(phone) <= 40),
  availability_status text null check (availability_status is null or char_length(availability_status) <= 80),
  availability_message text null check (availability_message is null or char_length(availability_message) <= 300),
  profile_image_url text null check (profile_image_url is null or profile_image_url ~* '^https?://'),
  resume_url text null check (resume_url is null or resume_url ~* '^https?://'),
  github_url text null check (github_url is null or github_url ~* '^https?://'),
  linkedin_url text null check (linkedin_url is null or linkedin_url ~* '^https?://'),
  website_url text null check (website_url is null or website_url ~* '^https?://'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_profile_singleton unique (singleton_key)
);

drop trigger if exists site_profile_set_updated_at on public.site_profile;
create trigger site_profile_set_updated_at before update on public.site_profile for each row execute function public.set_updated_at();

alter table public.site_profile enable row level security;

drop policy if exists "Public can read site profile" on public.site_profile;
create policy "Public can read site profile" on public.site_profile for select to anon, authenticated using (true);

drop policy if exists "Authenticated users create site profile" on public.site_profile;
create policy "Authenticated users create site profile" on public.site_profile for insert to authenticated with check (auth.uid() is not null);

drop policy if exists "Authenticated users update site profile" on public.site_profile;
create policy "Authenticated users update site profile" on public.site_profile for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

grant select on public.site_profile to anon;
grant select, insert, update on public.site_profile to authenticated;

commit;
