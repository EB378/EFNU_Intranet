create table public.events (
  id uuid not null default gen_random_uuid (),
  title character varying(255) not null,
  description text null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  is_all_day boolean not null default false,
  location character varying(255) null,
  event_type character varying(50) not null default 'general'::character varying,
  status character varying(20) not null default 'confirmed'::character varying,
  recurrence_rule jsonb null,
  timezone character varying(50) not null default 'UTC'::character varying,
  organizer_id uuid not null default auth.uid (),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint events_pkey primary key (id),
  constraint events_organizer_id_fkey foreign KEY (organizer_id) references profiles (id) on delete CASCADE,
  constraint events_event_type_check check (
    (
      (event_type)::text = any (
        (
          array[
            'meeting'::character varying,
            'training'::character varying,
            'event'::character varying,
            'reminder'::character varying,
            'holiday'::character varying,
            'personal'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint events_status_check check (
    (
      (status)::text = any (
        (
          array[
            'confirmed'::character varying,
            'tentative'::character varying,
            'cancelled'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_events_start_time on public.events using btree (start_time) TABLESPACE pg_default;

create index IF not exists idx_events_organizer on public.events using btree (organizer_id) TABLESPACE pg_default;

create trigger update_events_modtime BEFORE
update on events for EACH row
execute FUNCTION update_modified_column ();