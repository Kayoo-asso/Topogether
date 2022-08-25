-- WAYPOINTS

-- 0. Table
create table waypoints (
    id uuid primary key,
    name varchar(500) not null,
    location geometry(point) not null,
    description varchar(5000),

    "topoId" uuid not null references public.topos(id) on delete cascade,
    image public.img
);

create index waypoints_topo_idx on public.waypoints("topoId");

-- 1. Policies
alter table waypoints enable row level security;

create policy "Waypoints visibility"
    on waypoints for select
    using ( public.can_view_topo("topoId") );

create policy "Waypoints can be modified by topo contributors"
    on waypoints for all
    -- the `using` case will also be applied for the `with check` cases
    using ( public.can_edit_topo("topoId") );

-- 2. Image registration
create trigger check_new_img
    after insert
    on waypoints
    for each row execute function internal.check_new_img();

create trigger img_changed
    after update of image
    on waypoints
    for each row
    when ((old.image).id <> (new.image).id)
    execute function internal.img_changed();

create trigger unregister_img
    after delete
    on waypoints
    for each row execute function internal.unregister_img();