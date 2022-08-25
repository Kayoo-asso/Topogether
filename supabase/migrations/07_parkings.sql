-- PARKINGS

-- 0. Table
create table parkings (
    id uuid primary key,
    spaces int not null,
    location geometry(point) not null,
    name varchar(500),
    description varchar(5000),

    "topoId" uuid not null references public.topos(id) on delete cascade,
    image public.img
);

create index parkings_topo_idx on public.parkings("topoId");

-- 1. Policies
alter table parkings enable row level security;

create policy "Parkings visibility"
    on parkings for select
    using ( public.can_view_topo("topoId") );

create policy "Parkings can be modified by topo contributors"
    on parkings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( public.can_edit_topo("topoId") );

-- 2. Image registration
create trigger check_new_img
    after insert
    on parkings
    for each row execute function internal.check_new_img();

create trigger img_changed
    after update of image
    on parkings
    for each row
    when ( (old.image).id <> (new.image).id )
    execute function internal.img_changed();

create trigger unregister_img
    after delete 
    on parkings
    for each row execute function internal.unregister_img();