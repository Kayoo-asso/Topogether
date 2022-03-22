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

create function all_light_topos()
returns setof public.light_topo
as $$
begin
    return query
    select light_topo.*
    from public.topos t,
    build_light_topo(t) light_topo;
end;
$$ language plpgsql;

create function all_light_topos_of_user(_creator_id uuid)
returns setof public.light_topo
as $$
begin
    return query
    select x.* from (
        select build_light_topo(t.*)
        from public.topos as t
        where "creatorId" = _creator_id
    ) as x;
end;
$$ language plpgsql;