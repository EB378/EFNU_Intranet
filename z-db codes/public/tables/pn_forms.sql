create table public.pn_forms (
  id uuid not null default gen_random_uuid (),
  from_location character varying(50) not null,
  to_location character varying(50) not null,
  dep_time character(4) not null,
  arr_time character(4) not null,
  dep_date date null,
  arr_date date null,
  aircraft_reg character varying(20) not null,
  mtow integer not null,
  pic_name character varying(100) not null,
  phone character varying(30) not null,
  email character varying(100) not null,
  ifr_arrival boolean null default false,
  status character varying(20) not null default 'pending'::character varying,
  created_at timestamp with time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp with time zone null default CURRENT_TIMESTAMP,
  uid uuid not null default auth.uid (),
  constraint pn_forms_pkey primary key (id),
  constraint pn_forms_uid_fkey foreign KEY (uid) references profiles (id),
  constraint pn_forms_check check ((arr_date >= dep_date)),
  constraint pn_forms_email_check check (
    (
      (email)::text ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'::text
    )
  ),
  constraint pn_forms_mtow_check check (
    (
      (mtow >= 1)
      and (mtow <= 100000)
    )
  ),
  constraint pn_forms_status_check check (
    (
      (status)::text = any (
        array[
          ('pending'::character varying)::text,
          ('approved'::character varying)::text,
          ('rejected'::character varying)::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_pn_forms_dates on public.pn_forms using btree (dep_date, arr_date) TABLESPACE pg_default;

create index IF not exists idx_pn_forms_registration on public.pn_forms using btree (aircraft_reg) TABLESPACE pg_default;

create index IF not exists idx_pn_forms_pic on public.pn_forms using btree (pic_name) TABLESPACE pg_default;

create index IF not exists idx_pn_forms_status on public.pn_forms using btree (status) TABLESPACE pg_default;