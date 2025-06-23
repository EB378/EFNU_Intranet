create table public.blogs (
  id uuid not null default gen_random_uuid (),
  uid uuid not null default auth.uid (),
  title character varying(255) not null,
  content text not null,
  image_link text null,
  published_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  published boolean not null default false,
  constraint blogs_pkey primary key (id),
  constraint fk_blog_author foreign KEY (uid) references profiles (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;