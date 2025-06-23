create table public.sms (
  id uuid not null default gen_random_uuid (),
  title character varying(255) not null,
  description text null,
  category public.report_category not null,
  status public.report_status not null default 'open'::report_status,
  severity public.severity_level not null,
  reported_by uuid not null default auth.uid (),
  reported_at timestamp with time zone not null default now(),
  resolved_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  location character varying(255) null,
  comments text null,
  constraint safety_reports_pkey primary key (id),
  constraint safety_reports_reported_by_fkey foreign KEY (reported_by) references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_reports_status on public.sms using btree (status) TABLESPACE pg_default;

create index IF not exists idx_reports_category on public.sms using btree (category) TABLESPACE pg_default;

create index IF not exists idx_reports_severity on public.sms using btree (severity) TABLESPACE pg_default;

create index IF not exists idx_reports_created on public.sms using btree (reported_at) TABLESPACE pg_default;