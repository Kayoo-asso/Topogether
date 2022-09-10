-- Switch from enum to bitflag
-- 0 -> 0
-- 1 -> 1
-- 2 -> 2
-- 3 -> 4
-- 4 -> 8
-- The general formula: if topos.type == 0, then 0, else 2^(topos.type - 1)
update public.topos t
set 
	type = case 
		when (type = 0) then 0 
		else POWER(2, type - 1)
	end;

alter table public.tracks
	add column if not exists spec integer not null default 0;

