
-- LINES
create table lines (
    id uuid primary key,
    index double precision not null,

    -- LineStrings require 2+ points, but we also accept lines with 0 or 1 point
    points double precision[] not null,
    forbidden geometry(multilinestring),
    hand1 geometry(point),
    hand2 geometry(point),
    foot1 geometry(point),
    foot2 geometry(point),

    "imageId" uuid,
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "trackId" uuid not null references public.tracks(id) on delete cascade
);

create index lines_topo_idx on public.lines("topoId");
create index lines_track_idx on public.lines("trackId");

alter table lines enable row level security;

create policy "Lines are visible for everyone"
    on lines for select
    using ( public.can_view_topo("topoId") );

create policy "Lines can be modified by topo contributors"
    on lines for all
    -- will also be used for the `with check` cases
    using ( public.can_edit_topo("topoId") );