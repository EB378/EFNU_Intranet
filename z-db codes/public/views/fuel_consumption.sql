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