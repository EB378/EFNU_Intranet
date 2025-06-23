create table public.alerts (
  id uuid not null default gen_random_uuid (),
  uid uuid not null default auth.uid (),
  title character varying(100) not null,
  description text null,
  alert_type character varying(20) not null default 'info'::character varying,
  severity character varying(20) not null default 'medium'::character varying,
  start_time timestamp without time zone not null default CURRENT_TIMESTAMP,
  end_time timestamp without time zone null,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  verified boolean not null,
  constraint alerts_pkey primary key (id),
  constraint alerts_id_key unique (id),
  constraint alerts_uid_fkey foreign KEY (uid) references auth.users (id),
  constraint alerts_alert_type_check check (
    (
      (alert_type)::text = any (
        (
          array[
            'emergency'::character varying,
            'warning'::character varying,
            'info'::character varying,
            'ongoing'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint alerts_severity_check check (
    (
      (severity)::text = any (
        (
          array[
            'critical'::character varying,
            'high'::character varying,
            'medium'::character varying,
            'low'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_alerts_active on public.alerts using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_alerts_time on public.alerts using btree (start_time, end_time) TABLESPACE pg_default;

create index IF not exists idx_alerts_type on public.alerts using btree (alert_type) TABLESPACE pg_default;

create trigger update_alerts_updated_at BEFORE
update on alerts for EACH row
execute FUNCTION update_updated_at_column ();