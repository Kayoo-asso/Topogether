-- 1. TOPO LIKES

create table public.topo_likes (
    "topoId" uuid references public.topos(id) on delete cascade,
    "userId" uuid references public.accounts(id) on delete cascade,
    created timestamptz not null default now(),

    primary key("topoId", "userId")
);

create index topo_likes_user_idx on public.topo_likes("userId");

-- Inserts and deletes are handled by going through the specialized functions below
-- No updates
alter table public.topo_likes enable row level security;

create policy "Likes are visible for everyone"
    on public.topo_likes for select
    using ( true );

create policy "Admins are omnipotent"
    on public.topo_likes for select
    using ( true );

-- 2. BOULDER LIKES
create table public.boulder_likes (
    "boulderId" uuid references public.boulders(id) on delete cascade,
    "userId" uuid references public.accounts(id) on delete cascade,
    created timestamptz not null default now(),

    primary key("boulderId", "userId")
);

create index boulder_likes_user_idx on public.boulder_likes("userId");

-- Inserts and deletes are handled by going through the specialized functions below
-- No updates
alter table public.boulder_likes enable row level security;

create policy "Likes are visible for everyone"
    on public.boulder_likes for select
    using ( true );

create policy "Admins are omnipotent"
    on public.boulder_likes for select
    using ( true );

-- 3. Utilities
create function likes_topo(_topo_id uuid)
returns boolean
as $$
    select exists(
        select 1 from public.topo_likes
        where "topoId" = _topo_id
        and "userId" = auth.uid()
    )
$$ language sql volatile;

create function likes_boulder(_boulder_id uuid)
returns boolean
as $$
    select exists(
        select 1 from public.boulder_likes
        where "boulderId" = _boulder_id
        and "userId" = auth.uid()
    )
$$ language sql volatile;

create function like_topos(_ids uuid[])
returns void
security definer
as $$
    insert into public.topo_likes
    select id, auth.uid()
    from unnest(_ids) as id
    on conflict do nothing
$$ language sql volatile;

create function unlike_topos(_ids uuid[])
returns void
security definer
as $$
    delete from public.topo_likes
    where "topoId" in ( select unnest(_ids) )
    and "userId" = auth.uid()
$$ language sql volatile;

create function like_boulders(_ids uuid[])
returns void
security definer
as $$
    insert into public.boulder_likes
    select id, auth.uid()
    from unnest(_ids) as id
    on conflict do nothing
$$ language sql volatile;

create function unlike_boulders(_ids uuid[])
returns void
security definer
as $$
    delete from public.boulder_likes
    where "boulderId" in ( select unnest(_ids) )
    and "userId" = auth.uid()
$$ language sql volatile;

-- 4. Topo and boulder views w/ likes
create view topos_with_like as
    select t.*, likes_topo(t.id) as liked
    from public.topos as t;

create view boulders_with_like as
    select b.*, likes_boulder(b.id) as liked
    from public.boulders as b;
