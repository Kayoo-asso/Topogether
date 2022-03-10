
-- LINES
create table lines (
    id uuid primary key,
    index double precision not null,

    points geometry(linestring) not null,
    forbidden geometry(multilinestring),
    hand1 geometry(point),
    hand2 geometry(point),
    foot1 geometry(point),
    foot2 geometry(point),

    "imageId" uuid references public.boulder_images(id) on delete set null,
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "trackId" uuid not null references public.tracks(id) on delete cascade
);

alter table lines enable row level security;

create policy "Lines are visible for everyone"
    on lines for select
    using ( true );

create policy "Lines can be modified by topo contributors"
    on lines for all
    -- will also be used for the `with check` cases
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on lines for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );