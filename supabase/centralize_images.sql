-- Changes:
-- - Create `topo_access_steps` and `boulder_images`
-- - Drop `users` column of `public.images`
-- - Add `imageId` columns everywhere and drop the associated columns
-- - Drop all the image triggers
-- - Recreate the missing stuff

drop function if exists internal.use_img(public.img) cascade;
drop function if exists internal.stop_using_img(public.img) cascade;

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