-- Goals:
-- 1. Add `ratio` and `placeholder` columns to `public.images`
-- 2. Populate them as best as possible
-- 3. Make sure any incoming data will provide values for them

BEGIN;
LOCK TABLE public.images IN EXCLUSIVE MODE;

-- alter table public.images
-- 	drop column if exists ratio,
-- 	drop column if exists placeholder;

delete from public.images
where users = 0;

alter table public.images
	-- will add `not null` constraint later
	add column if not exists ratio double precision,
	add column if not exists placeholder text;

-- Replace 
create or replace function internal.use_img (_image public.img)
returns void
as $$
    insert into public.images (id, ratio, placeholder, users)
    values 
        (_image.id, _image.ratio, _image.placeholder, 1)
    on conflict (id)
    do update set
        users = images.users + 1;
$$ language sql volatile;

--- SINGLE IMAGE CASE

-- Topo images
update public.images i
set (ratio, placeholder) = (
	select (x.image).ratio, (x.image).placeholder
	from public.topos x
	where (x.image).id = i.id
)
where i.id in (select (image).id from public.topos);

-- User images
update public.images i
set (ratio, placeholder) = (
	select (x.image).ratio, (x.image).placeholder
	from public.users x
	where (x.image).id = i.id
)
where i.id in (select (image).id from public.users);

-- Waypoint images
update public.images i
set (ratio, placeholder) = (
	select (x.image).ratio, (x.image).placeholder
	from public.waypoints x
	where (x.image).id = i.id
)
where i.id in (select (image).id from public.waypoints);

-- Parking images
update public.images i
set (ratio, placeholder) = (
	select (x.image).ratio, (x.image).placeholder
	from public.parkings x
	where (x.image).id = i.id
)
where i.id in (select (image).id from public.parkings);

-- Manager images
update public.images i
set (ratio, placeholder) = (
	select (x.image).ratio, (x.image).placeholder
	from public.managers x
	where (x.image).id = i.id
)
where i.id in (select (image).id from public.managers);

--- MULTI IMAGE CASES
-- Boulder images
with boulder_images as (
	-- "Spread" the properties of the `img` type, to be able to
	-- access them in the next query
	select (unnest(b.images)).*
	from public.boulders b
)
update public.images i
set (ratio, placeholder) = (
	select img.ratio, img.placeholder
	from boulder_images img
	where img.id = i.id
	-- limit 1
)
where i.id in (select id from boulder_images);

-- Topo access images
with access_images as (
	-- "Spread" the properties of the `img` type, to be able to
	-- access them in the next query
	select ((unnest(steps)).image).*
	from public.topo_accesses
)
update public.images i
set (ratio, placeholder) = (
	select img.ratio, img.placeholder
	from access_images img
	where img.id = i.id
	limit 1
)
where i.id in (select id from access_images);

alter table public.images alter column ratio set not null;



COMMIT;