-- ============================================================
-- MESHO DATA SCIENCES — STORAGE BUCKETS
-- Run this FOURTH in Supabase SQL Editor
-- ============================================================

-- Avatars bucket (public)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Research materials bucket (private)
insert into storage.buckets (id, name, public)
values ('research-materials', 'research-materials', false)
on conflict (id) do nothing;

-- Storage policies: avatars
create policy "Anyone can view avatars" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "Authenticated users can upload avatars" on storage.objects
  for insert with check (bucket_id = 'avatars' and auth.uid() is not null);

create policy "Users can update own avatar" on storage.objects
  for update using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own avatar" on storage.objects
  for delete using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies: research-materials (admin only for upload, purchased users for download)
create policy "Admins can manage research materials" on storage.objects
  for all using (bucket_id = 'research-materials' and public.is_admin());

create policy "Users can download purchased materials" on storage.objects
  for select using (
    bucket_id = 'research-materials'
    and exists (
      select 1 from public.purchases pu
      join public.projects pr on pr.id = pu.project_id
      where pu.user_id = auth.uid()
        and pu.status = 'confirmed'
        and pr.file_url like '%' || name || '%'
    )
  );
