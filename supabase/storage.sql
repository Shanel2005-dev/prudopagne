-- Prudo Pagne — stockage des photos (à exécuter après schema.sql)

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

create policy "Lecture publique des photos stockées" on storage.objects
  for select using (bucket_id = 'photos');

create policy "Admin upload des photos" on storage.objects
  for insert with check (bucket_id = 'photos' and auth.role() = 'authenticated');

create policy "Admin supprime des photos" on storage.objects
  for delete using (bucket_id = 'photos' and auth.role() = 'authenticated');
