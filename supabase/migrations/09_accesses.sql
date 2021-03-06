-- TOPO ACCESSES

-- 0. Table
create type public.topo_access_step as (
    description varchar(5000),
    image public.img
);

create table topo_accesses (
    id uuid primary key,
    danger varchar(5000),
    difficulty int2, -- TypeScript enum
    duration int,
    steps topo_access_step[] not null,

    "topoId" uuid not null references public.topos(id) on delete cascade
);

create index accesses_topo_idx on public.topo_accesses("topoId");

create function internal.on_access_insert()
returns trigger
security definer
as $$
begin
    insert into public.images
        select (step.image).id as id, 1 as users 
        from unnest(new.steps) as step
        where (step.image).id is not null
    on conflict (id)
    do update set
        users = images.users + 1;
    return null;
end;
$$ language plpgsql;

create function internal.on_access_delete()
returns trigger
security definer
as $$
begin
    update public.images
    set users = users - 1
    where id in (
        select (step.image).id
        from unnest(old.steps) as step
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
    -- where path in (before except after)

    -- Basically insert + delete
    insert into public.images
        select (step.image).id as id, 1 as users 
        from unnest(new.steps) as step
        where (step.image).id is not null
    on conflict (id)
    do update set
        users = images.users + 1;

    update public.images
    set users = users - 1
    where id in (
        select (step.image).id
        from unnest(old.steps) as step
    );

    return null;
end;
$$ language plpgsql;

-- 1. Policies for `topo_accesses`
alter table topo_accesses enable row level security;

create policy "Topo visibility"
    on topo_accesses for select
    using ( public.can_view_topo("topoId") );

create policy "Topo accesses can be modified by topo contributors"
    on topo_accesses for all
    using ( public.can_edit_topo("topoId") );

-- 2. Image registration for `topo_access`
create trigger register_images after insert on topo_accesses
    for each row execute function internal.on_access_insert();

create trigger update_images after update on topo_accesses
    for each row execute function internal.on_access_update();

create trigger delete_images after delete on topo_accesses
    for each row execute function internal.on_access_delete();