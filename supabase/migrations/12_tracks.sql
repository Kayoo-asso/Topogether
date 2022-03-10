-- TRACKS
create table tracks (
    id uuid primary key,
    index double precision not null,

    name varchar(500),
    description varchar(5000),
    height integer,
    grade grade,
    orientation int2, -- typescript enum
    reception int2, -- typescript enum
    anchors integer,
    -- bitflag
    techniques integer DEFAULT 0 not null,

    "isTraverse" boolean default false not null,
    "isSittingStart" boolean default false not null,
    "mustSee" boolean default false not null,
    "hasMantle" boolean default false not null,

    -- this duplication makes row level security easier
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "boulderId" uuid not null references public.boulders(id) on delete cascade,
    "creatorId" uuid references public.users(id) on delete set null
);

alter table tracks enable row level security;

create policy "Tracks are visible for everyone"
    on tracks for select
    using ( true );

-- TODO: add authorizations specific to track creators, even if they are not topo contributors?
create policy "Tracks can be modified by topo contributors"
    on tracks for all
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on tracks for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );