update public.topos
set image = (
	select (id, ratio, placeholder)::public.img
	from public.images
	where id = (image).id
)
where (image).id is not null;

update public.managers
set image = (
	select (id, ratio, placeholder)::public.img
	from public.images
	where id = (image).id
)
where (image).id is not null;

update public.parkings
set image = (
	select (id, ratio, placeholder)::public.img
	from public.images
	where id = (image).id
)
where (image).id is not null;

update public.waypoints
set image = (
	select (id, ratio, placeholder)::public.img
	from public.images
	where id = (image).id
)
where (image).id is not null;

update public.accounts
set image = (
	select (id, ratio, placeholder)::public.img
	from public.images
	where id = (image).id
)
where (image).id is not null;

begin;

create or replace function update_boulder_image_placeholders(_images public.img[]) returns public.img[] as $$
declare
	_img public.img;
	_new_img public.img;
	_result public.img[] = '{}';
begin
	foreach _img in array _images loop
		select id, ratio, placeholder into _new_img
		from public.images
		where id = (_img).id;

		_result := array_append(_result, _new_img);
	end loop;
	return _result;
end;
$$ language plpgsql volatile;

update public.boulders
set images = update_boulder_image_placeholders(images)
where cardinality(images) > 0;

drop function update_boulder_image_placeholders(public.img[]);
commit;

begin;
create or replace function update_topo_access_steps_placeholders(_steps public.topo_access_step[]) returns public.topo_access_step[] as $$
declare
	_step public.topo_access_step;
	_img public.img;
	_new_img public.img;
	_result public.topo_access_step[] = '{}';
begin
	foreach _step in array _steps loop
		if (_step.image).id is not null then
			select id, ratio, placeholder into _new_img
			from public.images
			where id = (_step.image).id;
			_step.image = _new_img;
		end if;
		_result = array_append(_result, _step);

	end loop;
	return _result;
end;
$$ language plpgsql volatile;

update public.topo_accesses
set steps = update_topo_access_steps_placeholders(steps)
where cardinality(steps) > 0;

drop function update_topo_access_steps_placeholders(public.topo_access_step[]);
commit;