create table public.profiles (
  id uuid not null, 
  updated_at timestamp with time zone null default now(),
  created_at timestamp with time zone not null default now(),
  fullname text not null,
  avatar_url text null,
  email text null,
  phone text null,
  ratings jsonb null,
  license text null,
  role text null,
  status text null,
  profile_type text not null default 'user'::text,
  constraint profiles_pkey primary key (id),
  constraint profiles_fullname_key unique (fullname),
  constraint profiles_id_key unique (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint fullname_length check ((char_length(fullname) >= 3))
) TABLESPACE pg_default;