/* Changes:
- Drop all the image triggers
- Drop type `public.img`
- Add `imageId` to `accounts`, `topos`, `managers`, `parkings`, `waypoints`
- Create `topo_access_steps` and `boulder_images`
- Update dependent views / functions
*/

begin;

/* 1. Drop column `users` of `public.images` */

-- Maintenance function for column `users` in `public.images`
drop function if exists internal.use_img(public.img) cascade;
drop function if exists internal.stop_using_img(public.img) cascade;
-- Drop the column itself
alter table public.images drop column users cascade;

-- Now, drop all the triggers that relied on the `public.images.users`

-- This cascades to all the triggers on `accounts`, `topos`, `parkings`, `managers`, `waypoints`
drop function if exists internal.check_new_img() cascade;
drop function if exists internal.img_changed() cascade;
drop function if exists internal.unregister_img() cascade;

-- Image triggers for `public.topo_accesses`
drop function if exists internal.on_access_insert() cascade;
drop function if exists internal.on_access_update() cascade;
drop function if exists internal.on_access_delete() cascade;

-- Image triggers for `public.boulders`
drop function if exists internal.on_boulder_insert() cascade;
drop function if exists internal.on_boulder_update() cascade;
drop function if exists internal.on_boulder_delete() cascade;

/* 2. Remove the `public.img` and `public.topo_access_step` types */
/* From running the command locally:

DETAIL:  drop cascades to column images of table boulders
drop cascades to view boulders_with_like
drop cascades to column image of table accounts
drop cascades to view profiles
drop cascades to column creator of composite type light_topo
drop cascades to column creator of view light_topos
drop cascades to column image of table topos
drop cascades to view topos_with_like
drop cascades to column image of table managers
drop cascades to column image of table parkings
drop cascades to column image of table waypoints
drop cascades to column image of composite type topo_access_step
drop cascades to column image of composite type light_topo
drop cascades to column image of view light_topos

NOTICE:  drop cascades to column steps of table topo_accesses
*/

drop type public.img cascade;
drop type public.topo_access_step cascade;

/* 3. Add `image_id` columns to all tables that had a single `image` */
alter table public.accounts add column image_id UUID references public.images(id);
alter table public.topos add column image_id UUID references public.images(id);
alter table public.managers add column image_id UUID references public.images(id);
alter table public.parkings add column image_id UUID references public.images(id);
alter table public.waypoints add column image_id UUID references public.images(id);

/* 4. Create `public.topo_access_steps` and `public.boulder_images` */

create table public.topo_access_steps (
	access_id UUID not null references public.topo_accesses(id),
	index integer not null,
	description text,
	image_id UUID references public.images(id),

	primary key (access_id, index)
);

create table public.boulder_images (
	boulder_id UUID not null references public.boulders(id),
	index integer not null,
	image_id UUID references public.images(id),

	primary key (boulder_id, index)
);

/* 5. Update dependent views */

/* 5.a. public.profiles */
-- Cascades to `light_topo` but we'll recreate that later anyways
drop view public.profiles cascade;

create view public.profiles as
	select 
		id,
		"userName",
		role,
		created,
		image_id,
		"firstName",
		"lastName",
		country,
		city
	from public.accounts;

create trigger profiles_are_read_only
	instead of insert or update or delete 
	on public.profiles
	for each row execute function internal.do_nothing();

/* 5.b. public.topos_with_like */
drop view topos_with_like cascade;

create view topos_with_like as
    select t.*, likes_topo(t.id) as liked
    from public.topos as t;

/* 5.c. public.light_topos */

/* DETAIL:  drop cascades to function build_light_topo(topos)
drop cascades to view light_topos
drop cascades to function search_light_topos(text,integer,double precision)
drop cascades to function liked_topos_of_user(uuid)
drop cascades to function get_contributor_topos(uuid) */
drop type public.light_topo cascade;

-- Make those 2 functions stable, to enable PostgreSQL to inline them
create or replace function likes_topo(_topo_id uuid)
returns boolean
as $$
    select exists(
        select 1 from public.topo_likes
        where "topoId" = _topo_id
        and "userId" = auth.uid()
    )
$$ language sql stable;

create or replace function likes_boulder(_boulder_id uuid)
returns boolean
as $$
    select exists(
        select 1 from public.boulder_likes
        where "boulderId" = _boulder_id
        and "userId" = auth.uid()
    )
$$ language sql volatile;

create view public.light_topos as
	select
		t.id, t.name, t.status,
		likes_topo(t.id) as liked,
		image,
		creator,
		count(s) as "nbSectors",
		count(b) as "nbBoulders",
		count(tr) as "nbTracks",
		(select location::jsonb->'coordinates' 
		 from public.parkings 
		 where "topoId" = t.id 
		 limit 1
		) as "parkingLocation"
		-- (select jsonb_object_agg(grade, count)
    --  from (
    --     select grade_to_category(tr.grade) as grade, count(*) as count
    --     from tr
    --     group by grade_to_category(tr.grade)
    --  ) as _
		-- ).* as grades
	from public.topos t
	left join public.sectors s on s."topoId" = t.id
	left join public.boulders b on b."topoId" = t.id
	left join public.tracks tr on tr."topoId" = t.id
	left join public.images image on image.id = t.image_id
	left join public.profiles creator on creator.id = topo."creatorId"
	-- lateral ( select grade_to_category(tr.grade) as grade, count(*) from tr group by grade_to_category(tr.grade) )
	group by t.id;

commit;