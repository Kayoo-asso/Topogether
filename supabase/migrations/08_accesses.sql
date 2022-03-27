-- TOPO ACCESSES

-- 0. Table
create type public.topo_access_step as (
    description varchar(5000),
    image public.image
);

create table topo_accesses (
    id uuid primary key,
    danger varchar(5000),
    difficulty int2, -- TypeScript enum
    duration int,
    steps topo_access_step[] not null,

    "topoId" uuid not null references public.topos(id) on delete cascade
);

create function internal.on_access_insert()
returns trigger
security definer
as $$
declare
    step public.topo_access_step;
begin
    update public.images
    set users = users + 1
    where id in (
        select id
        from unnest(new.steps)
    );
    return null;
end;
$$ language plpgsql;

create function internal.on_access_delete()
returns trigger
security definer
as $$
declare
    step public.topo_access_step;
begin
    update public.images
    set users = users - 1
    where id in (
        select id
        from unnest(old.steps)
    );
    return null;
end;
$$ language plpgsql;

-- TODO: use a set difference to optimise this?
create function internal.on_access_update()
returns trigger
security definer
as $$
begin
    -- with before as (
    --     select "imagePath"
    --     from unnest(old.steps)
    -- ), after as (
    --     select "imagePath"
    --     from unnest(new.steps)
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
    -- update public.images
    -- set users = users - 1
    -- where path in (before except after


    update public.images
    set users = users - 1
    where id in (
        select id
        from unnest(old.steps)
    );

    update public.images
    set users = users + 1
    where id in (
        select id
        from unnest(new.steps)
    );

    return null;
end;
$$ language plpgsql;

-- 1. Policies for `topo_accesses`
alter table topo_accesses enable row level security;

create policy "Topo accesses are visible for everyone"
    on topo_accesses for select
    using ( true );

create policy "Topo accesses can be modified by topo contributors"
    on topo_accesses for all
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on topo_accesses for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- 2. Image registration for `topo_access`
create trigger register_images after insert on topo_accesses
    for each row execute function internal.on_access_insert();

create trigger update_images after update on topo_accesses
    for each row execute function internal.on_access_update();

create trigger delete_images after delete on topo_accesses
    for each row execute function internal.on_access_delete();