create function get_contributor_topos(_user_id uuid) returns setof public.light_topo as $$
	select t.*
	from topo_contributors tc
	join light_topos t on t.id = tc.topo_id
	where tc.user_id = _user_id;
$$ language sql stable;