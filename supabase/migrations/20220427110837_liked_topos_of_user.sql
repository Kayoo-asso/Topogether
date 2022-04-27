create function liked_topos_of_user(_user_id uuid) returns setof public.light_topo as $$
    select t.*
    from public.topo_likes likes
    join public.light_topos t
    on likes."topoId" = t.id
    where likes."userId" = _user_id;
$$ language sql stable;