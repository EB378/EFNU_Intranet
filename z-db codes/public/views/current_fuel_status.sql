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