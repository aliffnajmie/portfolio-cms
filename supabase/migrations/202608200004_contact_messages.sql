begin;

create extension if not exists pgcrypto;

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  subject text null check (subject is null or char_length(subject) <= 150),
  message text not null check (char_length(trim(message)) between 10 and 3000),
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  admin_notes text null check (admin_notes is null or char_length(admin_notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_messages_status_idx on public.contact_messages (status);
create index if not exists contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_duplicate_guard_idx on public.contact_messages (lower(email), created_at desc);

create or replace function public.reject_recent_duplicate_contact_message()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (
    select 1
    from public.contact_messages
    where lower(email) = lower(new.email)
      and coalesce(subject, '') = coalesce(new.subject, '')
      and message = new.message
      and created_at > now() - interval '10 minutes'
  ) then
    raise exception 'duplicate_submission' using errcode = '23505';
  end if;
  return new;
end;
$$;

revoke all on function public.reject_recent_duplicate_contact_message() from public;

drop trigger if exists contact_messages_reject_recent_duplicate on public.contact_messages;
create trigger contact_messages_reject_recent_duplicate before insert on public.contact_messages for each row execute function public.reject_recent_duplicate_contact_message();

drop trigger if exists contact_messages_set_updated_at on public.contact_messages;
create trigger contact_messages_set_updated_at before update on public.contact_messages for each row execute function public.set_updated_at();

alter table public.contact_messages enable row level security;

drop policy if exists "Anyone can submit new contact messages" on public.contact_messages;
create policy "Anyone can submit new contact messages"
on public.contact_messages for insert
to anon, authenticated
with check (status = 'new' and admin_notes is null);

drop policy if exists "Authenticated users can read contact messages" on public.contact_messages;
create policy "Authenticated users can read contact messages" on public.contact_messages for select to authenticated using (auth.uid() is not null);

drop policy if exists "Authenticated users can update contact messages" on public.contact_messages;
create policy "Authenticated users can update contact messages" on public.contact_messages for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Authenticated users can delete contact messages" on public.contact_messages;
create policy "Authenticated users can delete contact messages" on public.contact_messages for delete to authenticated using (auth.uid() is not null);

grant insert on public.contact_messages to anon;
grant select, insert, update, delete on public.contact_messages to authenticated;

commit;
