CREATE TYPE public.user_role AS ENUM ('viewer', 'author', 'admin');

CREATE TABLE public.users (
  id uuid references auth.users not null primary key,
  name text,
  email text,
  role public.user_role default 'viewer'::public.user_role not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  image_url text,
  summary text,
  author_id uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE TABLE public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.users(id) not null,
  comment_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
