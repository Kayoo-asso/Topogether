
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


-- create table public.parents (
--     id int8 primary key,
--     children int8[] not null
-- );

-- create table public.children (
--     id int8 primary key,
--     name text not null
--     -- parent_id int8 not null references public.order(id) on delete cascade
-- );

-- create function children_in_order(parent_id int8)
-- returns setof public.children
-- as $$
-- declare
--     parent public.parents;
--  begin
--     select * from public.parents
--     where id = parent_id
--     into parent;

--     return query select c.*
--     from unnest(parent.children) as child_id
--     left join public.children as c
--     on c.id = child_id;
-- end;
-- $$ language plpgsql;

-- ### TOPOS ###
-- create view public.topos as
--     select
--         id,
--         name,
--         status
--         type,
--         ST_AsGeoJson(location)::json as location,
--         forbidden,

--         modified,
--         submitted,
--         validated,

--         amenities,
--         rock_types as "rockTypes",

--         description,
--         fauna_protection as "faunaProtection",
--         ethics,
--         danger,
--         cleaned,
--         altitude,
--         approach_time as "approachTime",
--         other_amenities as "otherAmenities",

--         lonely_boulders as "lonelyBoulders",
--         creator_id as "creatorId",
--         validator_id as "validatorId",
--         image_id as "imageId"
--     from internal.topos;

-- -- Avoids the view bypassing row-level security
-- alter view public.topos owner to authenticated;

-- create function modified_topo(topo_id uuid)
-- returns void
-- as $$
-- begin
--     update internal.topos
--     set modified = now()
--     where id = topo_id;
-- end;
-- $$ language plpgsql;

-- create function insert_topo_internal()
-- returns trigger
-- as $$
-- begin
--     insert into internal.topos values
--     (
--         new.id,
--         new.name,
--         'Draft', -- default status
--         new.type,
--         new.location,
--         new.forbidden,

--         now(), -- modified
--         null, -- submitted
--         null, -- validated

--         new.amenities,
--         new."rockTypes",
--         new.description,
--         new."faunaProtection",
--         new.ethics,
--         new.danger,
--         new.cleaned,
--         new.altitude,
--         new."approachTime",
--         new."otherAmenities",
--         new."lonelyBoulders",
--         new."creatorId",
--         null, -- validator_id
--         new."imageId"
--     );
--     return new;
-- end;
-- $$ language plpgsql;

-- create function update_topo_internal()
-- returns trigger
-- as $$
-- begin
--     -- Enforce validation logic 
--     new.submitted = old.submitted;
--     new.validated = old.validated;

--     if new.status <> 'Validated' then
--         new."validatorId" = null;
--     end if;

--     if new.status <> old.status then
--         if new.status = 'Submitted' then
--             if old.status <> 'Draft' then
--                 raise exception 'Only topo drafts can be submitted';
--             end if;
--             new.submitted = now();
--         end if;

--         if new.status = 'Validated' then
--             if old.status <> 'Submitted' then
--                 raise exception 'Only submitted topos can be validated';
--             end if;
--             new.validated = now();
--         end if;
--     end if;

--     update internal.topos
--     set 
--         name = new.name,
--         status = new.status,
--         type = new.type,
--         -- TODO: check that geography works fine
--         location = ST_GeomFromGeoJson(new.location)::geography,
--         forbidden = new.forbidden,

--         modified = now(),
--         submitted = new.submitted,
--         validated = new.validated,

--         amenities = new.amenities,
--         rock_types = new."rockTypes",
        
--         description = new.description,
--         fauna_protection = new."faunaProtection",
--         ethics = new.ethics,
--         danger = new.danger,
--         cleaned = new.cleaned,
--         altitude = new.altitude,
--         approach_time = new."approachTime",
--         other_amenities = new."otherAmenities",
--         lonely_boulders = new."lonelyBoulders",

--         validator_id = new."validatorId",
--         image_id = new."imageId"
--     where id = new.id;
--     if not found then return null; end if;
--     return new;
-- end;
-- $$ language plpgsql;

-- create trigger insert_topo instead of insert on public.topos
--     for each row execute procedure public.insert_topo_internal();

-- create trigger update_topo instead of update on public.topos
--     for each row execute procedure public.update_topo_internal();

-- -- ### LINES ###
-- create view public.lines as
--     select 
--         id,
--         topo_id as "topoId",
--         track_id as "trackId",
--         image_id as "imageId",
--         ST_AsGeoJson(points)::json as points,
--         ST_AsGeoJson(forbidden)::json as forbidden,
--         ST_AsGeoJson(hand1)::json as hand1,
--         ST_AsGeoJson(hand2)::json as hand2,
--         ST_AsGeoJson(foot1)::json as foot1,
--         ST_AsGeoJson(foot2)::json as foot2
--     from internal.lines;

-- -- Avoids the view bypassing row-level security
-- alter view public.lines owner to authenticated;

-- create function insert_line_internal()
-- returns trigger
-- language plpgsql
-- as $$
-- declare
--     row record;
-- begin
--     insert into internal.lines values
--     (
--         new.id, new."topoId", new."trackId", new."imageId", 
--         ST_GeomFromGeoJson(new.points),
--         ST_GeomFromGeoJson(new.forbidden),
--         ST_GeomFromGeoJson(new.hand1),
--         ST_GeomFromGeoJson(new.hand2),
--         ST_GeomFromGeoJson(new.foot1),
--         ST_GeomFromGeoJson(new.foot2)
--     );
--     call modified_topo(new.topo_id);
--     return new;
-- end;
-- $$;

-- create function update_line_internal()
-- returns trigger
-- language plpgsql
-- as $$
-- begin
--     update internal.lines
--     set points = ST_GeomFromGeoJson(new.points),
--         forbidden = ST_GeomFromGeoJson(new.forbidden),
--         hand1 = ST_GeomFromGeoJson(new.hand1),
--         hand2 = ST_GeomFromGeoJson(new.hand2),
--         foot1 = ST_GeomFromGeoJson(new.foot1),
--         foot2 = ST_GeomFromGeoJson(new.foot2)
--     where id = new.id;
--     if not found then return null; end if;
--     -- use old.topo_id, since it's guaranteed to never change
--     call modified_topo(old.topo_id);
--     return new;
-- end;
-- $$;

-- create trigger insert_line instead of insert on public.lines
--     for each row execute procedure insert_line_internal();

-- create trigger update_line instead of update on public.lines
--     for each row execute procedure update_line_internal();

