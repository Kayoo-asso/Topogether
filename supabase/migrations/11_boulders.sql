-- BOULDERS

-- 0. Table

create table boulders (
    id uuid primary key,
    location geometry(point) not null,
    name varchar(500) not null,
    "isHighball" boolean default false not null,
    "mustSee" boolean default false not null,
    "dangerousDescent" boolean default false not null,
    images public.img[] default '{}' not null,

    "topoId" uuid not null references topos(id) on delete cascade
);

create index boulders_topo_idx on public.boulders("topoId");

-- 1. Policies
alter table boulders enable row level security;

create policy "Boulders visibility"
    on boulders for select
    using ( public.can_view_topo("topoId") );

create policy "Boulders can be modified by topo contributors"
    on boulders for all
    using ( public.can_edit_topo("topoId") );

-- TODO: can we refactor to share logic with `public.topo_accesses` ?
create function internal.on_boulder_insert()
returns trigger
security definer
as $$
begin
    update public.images
    set users = users + 1
    where id in (
        select id
        from unnest(new.images)
    );
    return null;
end;
$$ language plpgsql;

create function internal.on_boulder_update()
returns trigger
security definer
as $$
begin
    -- with before as (
    --     select "imagePath"
    --     from unnest(old.images)
    -- ), after as (
    --     select "imagePath"
    --     from unnest(new.images)
    -- ), 
    -- -- Hackery to execute two sql statements that use `before` and `after` tables
    -- terrible_hack as (
    --     update public.images
    --     set users = users - 1
    --     where path in ( before ) and path not in ( after)
    -- )
    -- update public.images
    -- set users = users + 1
    -- where path in ( after ) and path not in ( before );

    update public.images
    set users = users + 1
    where id in (
        select id
        from unnest(new.images)
    );

    update public.images
    set users = users - 1
    where id in (
        select id
        from unnest(old.images)
    );

    return null;
end;
$$ language plpgsql;

create function internal.on_boulder_delete()
returns trigger
security definer
as $$
begin
    update public.images
    set users = users - 1
    where id in (
        select id
        from unnest(old.images)
    );
    return null;
end;
$$ language plpgsql;

create trigger boulder_insert
    after insert
    on boulders
    for each row execute function internal.on_boulder_insert();

create trigger boulder_update
    after update of images
    on boulders
    for each row execute function internal.on_boulder_update();

create trigger boulder_delete
    after delete
    on boulders
    for each row execute function internal.on_boulder_delete();