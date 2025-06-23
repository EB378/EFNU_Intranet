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

create trigger fuel_metrics_update
after INSERT
or DELETE
or
update on fuelings for EACH row
execute FUNCTION update_fuel_metrics ();