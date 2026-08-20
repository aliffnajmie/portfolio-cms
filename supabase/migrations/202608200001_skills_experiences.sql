begin;

create extension if not exists pgcrypto;

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  category text not null check (char_length(trim(category)) between 1 and 80),
  proficiency integer null check (proficiency between 1 and 100),
  icon text null check (icon is null or char_length(icon) <= 80),
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null check (char_length(trim(company)) between 1 and 120),
  position text not null check (char_length(trim(position)) between 1 and 120),
  location text null check (location is null or char_length(location) <= 120),
  employment_type text null check (employment_type is null or char_length(employment_type) <= 80),
  start_date date not null,
  end_date date null,
  is_current boolean not null default false,
  summary text null check (summary is null or char_length(summary) <= 2000),
  achievements jsonb not null default '[]'::jsonb check (jsonb_typeof(achievements) = 'array'),
  technologies text[] not null default '{}'::text[],
  company_url text null,
  display_order integer not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint experiences_date_range check (end_date is null or end_date >= start_date),
  constraint experiences_current_end_date check (not is_current or end_date is null)
);

create index if not exists skills_public_order_idx on public.skills (category, display_order, name) where is_visible;
create index if not exists experiences_public_order_idx on public.experiences (is_current desc, start_date desc, display_order) where is_visible;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists skills_set_updated_at on public.skills;
create trigger skills_set_updated_at before update on public.skills for each row execute function public.set_updated_at();
drop trigger if exists experiences_set_updated_at on public.experiences;
create trigger experiences_set_updated_at before update on public.experiences for each row execute function public.set_updated_at();

alter table public.skills enable row level security;
alter table public.experiences enable row level security;

drop policy if exists "Public can read visible skills" on public.skills;
create policy "Public can read visible skills" on public.skills for select to anon, authenticated using (is_visible = true or auth.uid() is not null);
drop policy if exists "Authenticated users manage skills" on public.skills;
create policy "Authenticated users manage skills" on public.skills for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Public can read visible experiences" on public.experiences;
create policy "Public can read visible experiences" on public.experiences for select to anon, authenticated using (is_visible = true or auth.uid() is not null);
drop policy if exists "Authenticated users manage experiences" on public.experiences;
create policy "Authenticated users manage experiences" on public.experiences for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

grant select on public.skills, public.experiences to anon;
grant select, insert, update, delete on public.skills, public.experiences to authenticated;

commit;
