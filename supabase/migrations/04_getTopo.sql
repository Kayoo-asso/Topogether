-- Here's an explanation of how we are going to gather all children
-- of a parent into a JSON array
-- 1. Find each child record
-- 2. Turn each into a JSON object
-- 3. Remove the foreign keys
-- 4. If needed, gather its children as well and merge them into the object
-- 5. Aggregate all children JSONs into an array
-- 6. Coalesce the array, to get an empty array instead of null, if there are no children
create function get_lines(track_id uuid)
returns jsonb
as $$
declare
    -- Required to store the result and force Postgres to understand
    -- we are returning only a single JSON.
    -- If we did `return query select ...`, Postgres would think we are
    -- returning multiple JSON object.
    result jsonb;
begin
    -- Steps 5. and 6.
    select coalesce(jsonb_agg(x.rows), '[]')
    into result
    from (
        -- Steps 1., 2. and 3.
        select to_jsonb(*)-'{"topoId", "trackId"}'::text[]
        as rows
        from public.lines
        where "trackId" = track_id
    ) as x;
    return result;
end;
$$ language plpgsql;

create function get_tracks(boulder_id uuid)
returns jsonb
as $$
declare
    result jsonb;
begin
    -- Steps 5. and 6.
    select coalesce(jsonb_agg(x.rows), '[]')
    into result
    from (
        -- Step 1.
        select 
            -- Steps 2. and 3.
            to_jsonb(t.*)-'{"topoId", "boulderId"}'::text[] ||
            -- Step 4.
            jsonb_build_object('lines', get_lines(t.id))
        as rows
        from public.tracks as t
        where t."boulderId" = boulder_id
    ) as x;
    return result;
end;
$$ language plpgsql;

-- Etc...

create function get_boulder_images(boulder_id uuid)
returns jsonb
as $$
declare
    result jsonb;
begin
    select coalesce(jsonb_agg(x.rows), '[]')
    into result
    from (
        select to_jsonb(img.*)-'{"topoId", "boulderId"}'::text[]
        as rows
        from public.boulder_images as img
        where img."boulderId" = boulder_id
    ) as x;
    return result;
end;
$$ language plpgsql;

create function get_boulders(topo_id uuid)
returns jsonb
as $$
declare
    result jsonb;
begin
    select coalesce(jsonb_agg(x.rows), '[]')
    into result
    from (
        select 
            to_jsonb(b.*)-'"topoId"' ||
            jsonb_build_object(
                'images', get_boulder_images(b.id),
                'tracks', get_tracks(b.id)
            )
        as rows
        from public.boulders as b
        where b."topoId" = topo_id
    ) as x;
    return result;
end;
$$ language plpgsql;


create function get_topo(topo_id uuid)
returns jsonb
as $$
declare
    topo public.topos;
    creator jsonb;
    validator jsonb;
    sectors jsonb;
    boulders jsonb;
    managers jsonb;
    waypoints jsonb;
    parkings jsonb;
    accesses jsonb;
    result jsonb;
begin
    select * into topo
    from public.topos
    where id = topo_id;

    -- TODO: how do these handle nulls?
    select to_jsonb(p.*) into creator
    from public.profiles as p
    where p.id = topo."creatorId";

    select to_jsonb(p.*) into validator
    from public.profiles as p
    where p.id = topo."validatorId";

    select coalesce(jsonb_agg(x.rows), '[]') into managers
    from (
        select to_jsonb(*)-'"topoId' from public.managers
        as rows
        where "topoId" = topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into waypoints
    from (
        select to_jsonb(*)-'"topoId' from public.waypoints
        as rows
        where "topoId" = topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into parkings
    from (
        select to_jsonb(*)-'"topoId' from public.parkings
        as rows
        where "topoId" = topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into accesses
    from (
        select to_jsonb(*)-'"topoId' from public.topo_accesses
        as rows
        where "topoId" = topo.id
    ) as x;

    select coalesce(jsonb_agg(x.rows), '[]') into sectors
    from (
        select to_jsonb(*)-'"topoId"' from public.sectors
        as rows
        where "topoId" = topo.id
    ) as x;

    -- time to go down into the boulders
    select get_boulders(topo.id) into boulders;

    select 
        to_jsonb(topo) ||
        jsonb_build_object(
            'sectors', sectors,
            'boulders', boulders,
            'parkings', parkings,
            'waypoints', waypoints,
            'accesses', accesses,
            'managers', managers
        )
    into result;
    return result;

end;
$$ language plpgsql;