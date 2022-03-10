-- BOULDERS

-- 0. Table
create table boulders (
    id uuid primary key,
    location geometry(point) not null,
    name varchar(500) not null,
    "isHighball" boolean default false not null,
    "mustSee" boolean default false not null,
    "dangerousDescent" boolean default false not null,

    "topoId" uuid not null references topos(id) on delete cascade
);

-- 1. Policies
alter table boulders enable row level security;

create policy "Boulders are visible for everyone"
    on boulders for select
    using ( true );

create policy "Boulders can be modified by topo contributors"
    on boulders for all
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on boulders for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );