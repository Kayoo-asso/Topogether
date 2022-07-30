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

create function internal.use_img (_image public.img)
returns void
as $$
    insert into public.images (id, users)
    values 
        (_image.id, 1)
    on conflict (id)
    do update set
        users = images.users + 1;
    -- update public.images
    -- set users = users + 1
    -- where id = _image.id;
$$ language sql volatile;


create function internal.stop_using_img (_image public.img)
returns void
as $$
    update public.images 
    set users = users - 1
    where id = _image.id
$$ language sql volatile;

create function internal.check_new_img()
returns trigger
security definer
as $$
begin
    if new.image is not null then
        perform internal.use_img(new.image);
    end if;
    return null;
end;
$$ language plpgsql;

create function internal.img_changed()
returns trigger
security definer
as $$
begin

    if old.image is not null then
        perform internal.stop_using_img(old.image);
    end if;
    if new.image is not null then
        perform internal.use_img(new.image);
    end if;
    return null;
end;
$$ language plpgsql;

create function internal.unregister_img()
returns trigger
security definer
as $$
begin
    if old.image is not null then
        perform internal.stop_using_img(old.image);
    end if;
    return null;
end;
$$ language plpgsql;