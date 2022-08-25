-- Woops, forgot to update the triggers for boulders and topo_accesses
-- to insert the ratio + placeholder into the `public.images` table
create or replace function internal.on_boulder_insert()
returns trigger
security definer
as $$
begin
    insert into public.images
        select img.id as id, 1 as users, img.ratio, img.placeholder
        from unnest(new.images) as img
        where img.id is not null
    on conflict (id)
    do update set
        users = images.users + 1;
    return null;
end;
$$ language plpgsql;

create or replace function internal.on_boulder_update()
returns trigger
security definer
as $$
begin
    insert into public.images
        select img.id as id, 1 as users, img.ratio, img.placeholder
        from unnest(new.images) as img
        where img.id is not null
    on conflict (id)
    do update set
        users = images.users + 1;

    update public.images
    set users = users - 1
    where id in (
        select id
        from unnest(old.images)
    );

    return null;
end;
$$ language plpgsql;


create or replace function internal.on_access_insert()
returns trigger
security definer
as $$
begin
    insert into public.images
        select (step.image).id as id, 1 as users, (step.image).ratio, (step.image).placeholder
        from unnest(new.steps) as step
        where (step.image).id is not null
    on conflict (id)
    do update set
        users = images.users + 1;
    return null;
end;
$$ language plpgsql;

create or replace function internal.on_access_update()
returns trigger
security definer
as $$
begin

    -- Basically insert + delete
    insert into public.images
        select (step.image).id as id, 1 as users, (step.image).ratio, (step.image).placeholder
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