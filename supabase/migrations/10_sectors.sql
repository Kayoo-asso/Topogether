-- SECTORS

-- 0. Table
create table public.sectors (
    id uuid primary key,
    index double precision not null,
    name varchar(255) not null,
    path geometry(linestring) not null,
    boulders uuid[] not null,

    "topoId" uuid not null references public.topos(id) on delete cascade
);

create index sectors_topo_idx on public.sectors("topoId");

-- 1. Policies
alter table sectors enable row level security;

create policy "Sectors are visible for everyone"
    on sectors for select
    using ( true );

create policy "Sectors can be modified by topo contributors"
    on sectors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on sectors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );