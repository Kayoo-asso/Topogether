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

/* 5.b. public.topos_with_like */

/* 5.c. public.light_topos */



commit;