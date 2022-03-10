-- TODO: topo access steps have their own table
-- TODO: order by index for sectors / boulders / tracks
-- -> May not be needed if this is done in JS anyways

-- Here's an explanation of how we are going to gather all children
-- of a parent into a JSON array
-- 1. Find each child record
-- 2. Turn each into a JSON object
-- 3. Remove the foreign keys
-- 4. If needed, gather its children as well and merge them into the object
-- 5. Aggregate all children JSONs into an array
-- 6. Coalesce the array, to get an empty array instead of null, if there are no children
create function get_lines(_track_id uuid)
returns jsonb
as $$
declare
    -- Required to store the result and force Postgres to understand
    -- we are returning only a single JSON.
    -- If we did `return query select ...`, Postgres would think we are
    -- returning multiple JSON object.
    _result jsonb;
begin
    -- Steps 5. and 6.
    select coalesce(jsonb_agg(x.rows), '[]')
    into _result
    from (
        -- Steps 1., 2. and 3.
        select to_jsonb(*)-'{"topoId", "trackId"}'::text[]
        as rows
        from public.lines
        where "trackId" = _track_id
    ) as x;
    return _result;
end;
$$ language plpgsql;

create function get_tracks(_boulder_id uuid)
returns jsonb
as $$
declare
    _result jsonb;
begin
    -- Steps 5. and 6.
    select coalesce(jsonb_agg(x.rows), '[]')
    into _result
    from (
        -- Step 1.
        select 
            -- Steps 2. and 3.
            to_jsonb(t.*)-'{"topoId", "boulderId"}'::text[] ||
            -- Step 4.
            jsonb_build_object('lines', get_lines(t.id))
        as rows
        from public.tracks as t
        where t."boulderId" = _boulder_id
    ) as x;
    return _result;
end;
$$ language plpgsql;

-- Etc...

create function get_boulder_images(_boulder_id uuid)
returns jsonb
as $$
declare
    _result jsonb;
begin
    select coalesce(jsonb_agg(x.rows), '[]')
    into _result
    from (
        select to_jsonb(img.*)-'{"topoId", "boulderId"}'::text[]
        as rows
        from public.boulder_images as img
        where img."boulderId" = _boulder_id
    ) as x;
    return _result;
end;
$$ language plpgsql;

create function get_boulders(_topo_id uuid)
returns jsonb
as $$
declare
    _result jsonb;
begin
    select coalesce(jsonb_agg(x.rows), '[]')
    into _result
    from (
        select 
            to_jsonb(b.*)-'"topoId"' ||
            jsonb_build_object(
                'images', get_boulder_images(b.id),
                'tracks', get_tracks(b.id)
            )
        as rows
        from public.boulders as b
        where b."topoId" = _topo_id
    ) as x;
    return _result;
end;
$$ language plpgsql;

create function internal.clean_json(data record, keys_to_remove text[], geometric_keys text[])
returns jsonb
as $$
declare
    result jsonb;
    key text;
begin
    result := to_jsonb(record)-keys_to_remove;
    foreach key in array geometric_keys loop
        result := jsonb_set(result, key, result->key->'coordinates');
    end loop;
    return result;
end;
$$ language plpgsql;

create function public.get_topo(_topo_id uuid)
returns jsonb
as $$
declare
    _topo record;
    _topo_json jsonb;
    _creator jsonb;
    _validator jsonb;
    _sectors jsonb;
    _boulders jsonb;
    _managers jsonb;
    _waypoints jsonb;
    _parkings jsonb;
    _accesses jsonb;
    _result jsonb;
begin
    select * into _topo
    from public.topos
    where id = _topo_id;

    _topo_json := to_jsonb(_topo)-'{"creatorId", "validatorId"}'::text[];
    _topo_json := jsonb_set(_topo_json, '{location}'::text[], _topo_json->'location'->'coordinates');

    -- TODO: how do these handle nulls?
    select to_jsonb(p.*) into _creator
    from public.profiles as p
    where p.id = _topo."creatorId";

    select to_jsonb(p.*) into _validator
    from public.profiles as p
    where p.id = _topo."validatorId";

    select coalesce(jsonb_agg(x.rows), '[]') into _managers
    from (
        select to_jsonb(m.*)-'"topoId"' as rows
        from public.managers as m
        where m."topoId" = _topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into _waypoints
    from (
        select to_jsonb(w.*)-'"topoId' as rows
        from public.waypoints as w
        where w."topoId" = _topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into _parkings
    from (
        select to_jsonb(p.*)-'"topoId' as rows
        from public.parkings as p
        where p."topoId" = _topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into _accesses
    from (
        select to_jsonb(ta.*)-'"topoId' as rows
        from public.topo_accesses as ta
        where ta."topoId" = _topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into _sectors
    from (
        select to_jsonb(s.*)-'"topoId"' as rows
        from public.sectors as s
        where s."topoId" = _topo.id
    ) as x;

    -- -- time to go down into the boulders
    select get_boulders(_topo.id) into _boulders;

    select 
        _topo_json ||
        jsonb_build_object(
            'creator', _creator,
            'validator', _validator,
            'sectors', _sectors,
            'boulders', _boulders,
            'parkings', _parkings,
            'waypoints', _waypoints,
            'accesses', _accesses,
            'managers', _managers
        )
    into _result;
    return jsonb_strip_nulls(_result);

end;
$$ language plpgsql;