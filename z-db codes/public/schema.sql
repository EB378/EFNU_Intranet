create table public.profiles (
  id uuid not null, 
  updated_at timestamp with time zone null default now(),
  created_at timestamp with time zone not null default now(),
  fullname text not null,
  avatar_url text null,
  email text null,
  phone text null,
  ratings jsonb null,
  licence text null,
  role text null,
  status text null,
  profile_type text not null default 'user'::text,
  constraint profiles_pkey primary key (id),
  constraint profiles_fullname_key unique (fullname),
  constraint profiles_id_key unique (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint fullname_length check ((char_length(fullname) >= 3))
) TABLESPACE pg_default;

create table public.fuels (
  id uuid not null default gen_random_uuid (),
  label text not null,
  capacity numeric(10, 2) not null,
  remaining numeric(10, 2) null,
  price double precision not null,
  color text null,
  remarks text null,
  updated_at timestamp with time zone null default now(),
  created_at timestamp with time zone not null default now(),
  unit text null default 'liters'::text,
  last_fuel_tank_refueling timestamp with time zone null,
  constraint fuels_pkey primary key (id),
  constraint fuels_unit_check check ((unit = 'liters'::text))
) TABLESPACE pg_default;

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

CREATE TYPE report_status AS ENUM ('open', 'in-progress', 'resolved');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE report_category AS ENUM ('inflight', 'infrastructure', 'aircraft', 'medical', 'security', 'enviromental', 'communication', 'other');

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

create table public.fuelings (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  uid uuid not null default auth.uid (),
  aircraft text not null,
  amount numeric(10, 2) not null,
  fuel uuid not null,
  billed_to uuid null,
  constraint fuel_pkey primary key (id),
  constraint fuelings_billed_to_fkey1 foreign KEY (billed_to) references profiles (id),
  constraint fuelings_fuel_fkey foreign KEY (fuel) references fuels (id),
  constraint fuelings_uid_fkey foreign KEY (uid) references profiles (id)
) TABLESPACE pg_default;

create index IF not exists fuelings_fuel_idx on public.fuelings using btree (fuel) TABLESPACE pg_default;

create index IF not exists fuelings_created_at_idx on public.fuelings using btree (created_at) TABLESPACE pg_default;
-- Add trigger to update remaining fuel when fuelings change
CREATE OR REPLACE FUNCTION update_fuel_remaining()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.fuels f
  SET remaining = LEAST(
    f.capacity,
    COALESCE((
      SELECT SUM(amount) 
      FROM public.fuelings 
      WHERE fuelings.fuel = f.id
    ), 0)
  )
  WHERE f.id = COALESCE(NEW.fuel, OLD.fuel);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION public.update_fuel_metrics()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.fuels f
  SET
    remaining = GREATEST(
      0,
      f.capacity - COALESCE((
        SELECT SUM(amount)
        FROM public.fuelings 
        WHERE fuelings.fuel = f.id
      ), 0)
    ),
    last_fuel_tank_refueling = (
      SELECT MAX(created_at)
      FROM public.fuelings
      WHERE fuelings.fuel = f.id
    )
  WHERE f.id = COALESCE(NEW.fuel, OLD.fuel);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_fuel_remaining
AFTER INSERT OR UPDATE OR DELETE ON public.fuelings
FOR EACH ROW EXECUTE FUNCTION update_fuel_remaining();

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
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

create trigger update_alerts_updated_at BEFORE
update on alerts for EACH row
execute FUNCTION update_updated_at_column ();

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
execute FUNCTION update_updated_at_column ();

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

create view public.fuel_consumption as
select
  date_trunc('day'::text, fg.created_at) as day,
  f.id as fuel_id,
  f.label as fuel_type,
  sum(fg.amount) as liters_used,
  count(*) as fueling_events,
  sum(fg.amount::double precision * f.price) as total_cost
from
  fuelings fg
  join fuels f on fg.fuel = f.id
group by
  (date_trunc('day'::text, fg.created_at)),
  f.id,
  f.label
order by
  (date_trunc('day'::text, fg.created_at)) desc;

  create view public.current_fuel_status as
select
  f.id,
  f.label,
  f.capacity,
  f.remaining,
  f.price,
  f.color,
  round(f.remaining / f.capacity * 100::numeric, 2) as percent_remaining,
  f.updated_at,
  count(fg.id) as total_fuelings,
  sum(fg.amount) as total_fuel_added
from
  fuels f
  left join fuelings fg on f.id = fg.fuel
group by
  f.id;