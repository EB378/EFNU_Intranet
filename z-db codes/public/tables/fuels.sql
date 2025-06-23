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