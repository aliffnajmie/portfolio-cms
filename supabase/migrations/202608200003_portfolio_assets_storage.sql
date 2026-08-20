begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio assets" on storage.objects;
create policy "Public can read portfolio assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio-assets');

drop policy if exists "Authenticated users upload portfolio assets" on storage.objects;
create policy "Authenticated users upload portfolio assets"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and auth.uid() is not null
  and name in ('profile/avatar', 'profile/resume.pdf')
);

drop policy if exists "Authenticated users update portfolio assets" on storage.objects;
create policy "Authenticated users update portfolio assets"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-assets' and auth.uid() is not null)
with check (
  bucket_id = 'portfolio-assets'
  and auth.uid() is not null
  and name in ('profile/avatar', 'profile/resume.pdf')
);

drop policy if exists "Authenticated users delete portfolio assets" on storage.objects;
create policy "Authenticated users delete portfolio assets"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and auth.uid() is not null
  and name in ('profile/avatar', 'profile/resume.pdf')
);

commit;
