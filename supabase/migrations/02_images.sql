
-- ### IMAGES ###
create table public.images (
    id uuid primary key,
    users int4 not null
);

alter table public.images enable row level security;

create policy "Images are visible for everyone"
    on images for select
    using ( true );

-- Inserts are done through the upload API, which uses the service role key
-- Deletes are done automatically

create function internal.use_img (_id uuid)
returns void
as $$
    insert into public.images (id)
    values 
        (_id)
    on conflict (id)
    do update set
        users = images.users + 1;
    -- update public.images
    -- set users = users + 1
    -- where id = _id;
$$ language sql volatile;


create function internal.stop_using_img (_id uuid)
returns void
as $$
    update public.images 
    set users = users - 1
    where id = _id
$$ language sql volatile;

create function internal.check_new_img()
returns trigger
security definer
as $$
begin
    if new.image.id is not null then
        perform internal.use_img(new.image.id);
    end if;
    return null;
end;
$$ language plpgsql;

create function internal.img_changed()
returns trigger
security definer
as $$
begin
    if old.image.id is not null then
        perform internal.stop_using_img(old.image.id);
    end if;
    if new.image.id is not null then
        perform internal.use_img(new.image.id);
    end if;
    return null;
end;
$$ language plpgsql;

create function internal.unregister_img()
returns trigger
security definer
as $$
begin
    if old.image.id is not null then
        perform internal.stop_using_img(old.image.id);
    end if;
    return null;
end;
$$ language plpgsql;

-- create function internal.delete_img(_id uuid)
-- returns void
-- as $$
-- declare
--     response extensions.http_response;
-- begin
--     select http((
--         'POST',
--         'https://api.dropboxapi.com/2/files/delete_v2',
--         ARRAY[
--             -- Inlined the Dropbox API key, this should be safe enough
--             http_header('Authorization', 'Bearer sl.BCmhWA_oxvDq04mIgM5WEPL-JaTdT691IyuKgxJRNJnSYBlUbzkn6qOQUVWWRV3tXO2kJB7iIW5UfLwaZ6M7DlT4IGdaLAKpUVgvwm8iidI0gvwU-P5SGqkJ17f8iQzkYUK4d04')
--         ],
--         'application/json',
--         format('{ "id": %s }', _id)
--     )::http_request)
--     into response;
--     if response.status <> 200 then
--         raise notice 'Could not delete image %: %', _id, to_json(response);
--     else
--         delete from public.images as img
--         where img.id = _id;
--     end if;
-- end;
-- $$ language plpgsql;

-- -- Hack to avoid crashing during local development, because pg_cron does not work
-- do $$
-- begin
--     if exists (
--         select schema_name from information_schema.schemata
--         where schema_name = 'cron'
--     ) then
--         -- Delete unused images every day at 4 am
--         select cron.schedule(
--             'delete-unused-images',
--             -- Run every day at 4am
--             '0 4 * * *',
--             $fn$
--             for id in
--                 select id
--                 from public.images
--                 where users = 0
--             loop
--                 perform internal.delete_img(id)
--             end loop;
--             $fn$
--         );
--     end if;
-- end;
-- $$;