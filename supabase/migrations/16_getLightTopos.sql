create type public.light_topo as (
    -- mandatory
    id uuid,
    name varchar(500),
    status smallint, -- TypeScript enum
    location jsonb,
    forbidden boolean,

    -- timestamps
    modified timestamptz,
    submitted timestamptz,
    validated timestamptz,

    -- bitflags
    amenities int4,
    "rockTypes" int4,

    -- optional
    type smallint, -- TypeScript enum
    description varchar(5000),
    altitude integer,
    "closestCity" varchar(500),

    -- relations
    "imagePath" text,
    "creator" public.profiles,

    -- additional stuff
    "parkingLocation" jsonb,
    "nbSectors" int4,
    "nbBoulders" int4,
    "nbTracks" int4,
    grades jsonb

    -- "creatorId" uuid references public.accounts(id) on delete set null,
    -- "validatorId" uuid references public.accounts(id) on delete set null
);



-- create view light_topos as select
--     t.id, t.name, t.status,
--     t.location::jsonb->'coordinates' as location,
--     t.forbidden,
--     t.modified, t.submitted, t.validated,
--     t.amenities, t."rockTypes",
--     t.type, t.description, t.altitude, t."closestCity",
--     t."imagePath",

--     creator,
--     count(sector) as "nbSectors",
--     count(boulder) as "nbBoulders",
--     count(track) as "nbTracks",
--     parking.location as "parkingLocation"
--     from
--         public.topos t
--         left join public.sectors sector on sector."topoId" = t.id
--         left join public.boulders boulder on boulder."topoId" = t.id
--         left join public.tracks track on track."topoId" = t.id
--         left join public.profiles creator on creator.id = t."creatorId"
--         left join (
--             select "topoId", location::jsonb->'coordinates' as location
--             from public.parkings
--             limit 1
--         ) parking on parking."topoId" = t.id,

--     -- the `group by` is necessary to make SQL happy with the use of `count(*)`
--     group by t.id, creator, parking.location;


create function grade_to_category(grade public.grade)
returns public.grade_category
as $$
begin
    if grade is null then
        return 'None';
    else
        return left(grade::text, 1);
    end if;
end;
$$ language plpgsql;

create function build_light_topo(_topo public.topos)
returns public.light_topo
as $$
declare
    "nbSectors" int4;
    "nbBoulders" int4;
    "nbTracks" int4;
    "parkingLocation" jsonb;
    creator public.profiles;
    grades jsonb;
    result public.light_topo;
begin
    select count(*)
    into "nbSectors"
    from public.sectors
    where "topoId" = _topo.id;

    select count(*)
    into "nbBoulders"
    from public.boulders
    where "topoId" = _topo.id;

    select count(*)
    into "nbTracks"
    from public.tracks
    where "topoId" = _topo.id;

    select location::jsonb->'coordinates'
    into "parkingLocation"
    from public.parkings
    where "topoId" = _topo.id
    limit 1;

    select jsonb_object_agg(grade, count)
    into grades
    from (
        select grade_to_category(t.grade) as grade, count(*) as count
        from public.tracks as t
        where t."topoId" = _topo.id
        group by grade_to_category(t.grade)
    ) as x;

    select *
    into creator
    from public.profiles
    where id = _topo."creatorId";

    select 
        _topo.id, _topo.name, _topo.status, 
        _topo.location::jsonb->'coordinates' as location,
        _topo.forbidden,
        _topo.modified, _topo.submitted, _topo.validated,
        _topo.amenities, _topo."rockTypes",
        _topo.type, _topo.description, _topo.altitude, _topo."closestCity",

        _topo."imagePath",
        creator,

        "parkingLocation",
        "nbSectors",
        "nbBoulders",
        "nbTracks",
        grades
    into result;

    return result;
end;
$$ language plpgsql;

create view public.light_topos as
    select light_topo.*
    from public.topos t,
    build_light_topo(t) light_topo;