
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true);

create policy "Images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'blog-images' );

create policy "Authors and Admins can upload images"
  on storage.objects for insert
  with check ( 
    bucket_id = 'blog-images' AND 
    auth.uid() IN (SELECT id FROM public.users WHERE role IN ('author', 'admin'))
  );
