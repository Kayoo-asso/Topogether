-- BOULDER IMAGES

-- 0. Table
create table public.boulder_images (
    id uuid primary key,
    index double precision not null,
    width int4 not null,
    height int4 not null,

    "topoId" uuid not null references public.topos(id) on delete cascade,
    "boulderId" uuid not null references public.boulders(id) on delete cascade,
    "imagePath" text
);

-- 1. Policies
alter table public.boulder_images enable row level security;

create policy "Images are visible to everyone"
    on public.boulder_images for select
    using ( true );

create policy "Images can be created by contributors"
    on public.boulder_images for insert
    with check ( is_contributor("topoId", auth.uid()) );

create policy "Images can be deleted by contributors"
    on public.boulder_images for delete
    using ( is_contributor("topoId", auth.uid()) );

-- 2. Image registration
create trigger check_new_img
    after insert
    on boulder_images
    for each row execute function internal.check_new_img();

create trigger img_changed
    after update of "imagePath"
    on boulder_images
    for each row
    when (old."imagePath" <> new."imagePath")
    execute function internal.img_changed();

create trigger unregister_img
    after delete 
    on boulder_images
    for each row execute function internal.unregister_img();