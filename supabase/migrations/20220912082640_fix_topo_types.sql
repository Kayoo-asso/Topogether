-- Fix the previous migration, which did not take into account
-- the fact that TopoType didn't have a "None" value before
-- + the fact that the order changed (Artificial was 5th choice = 4, now it's 1st choice)
update public.topos
set type = case type
	when 0 then POWER(2, 1) -- boulder
	when 1 then POWER(2, 2) -- cliff
	when 2 then POWER(2, 3) -- deepwater
	when 4 then POWER(2, 4) -- multipitch
	when 8 then 1 -- artificial
	else 0 end;-- none