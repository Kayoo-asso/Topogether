-- Prevent inserts / updates / deletes through views
create function internal.do_nothing()
returns trigger
as $$
begin
    return null;
end;
$$ language plpgsql;

-- 0. Internal table
-- Made in the `public` schema, so a client with the service role key can bypass the RLS policies
-- This is mostly used to change the role to ADMIN during local development

create table public.accounts (
    -- Cascading deletes is important, so that we can remove a user from the `auth` schema
    id uuid primary key references auth.users on delete cascade,
    "userName" text not null,
    -- The email can be found in the `auth.users` table.
    -- It is maintained in sync by a trigger (see below)
    email varchar(1000) not null,

    role role default 'USER' not null,
    created timestamptz default now() not null,

    "firstName" varchar(500),
    "lastName" varchar(500),
    country varchar(500),
    city varchar(500),
    phone varchar(30),
    "birthDate" date,

    image public.img
);

-- No authorizations, all modifications have to go through one of the following:
-- a) service role key
-- b) triggers
-- c) `public.users` view
alter table public.accounts enable row level security;

-- 1. Synchronise `public.accounts` with `auth.users`

-- Create an entry in `users` for each new user
-- This assumes the userName was provided as additional data.
-- This clears the userName from the user meta data in `auth.users`
create function internal.handle_new_user()
returns trigger
-- internal is needed for `public.accounts`
-- extensions is needed for JSON operators for some reason
-- pg_temp as last comes from Postgres' security guidelines
security definer set search_path = internal, auth, extensions, pg_temp
as $$
begin
    insert into public.accounts(id, "userName", email)
    values (new.id, (new.raw_user_meta_data::jsonb->>'userName')::varchar(500), new.email);

    update auth.users set
        raw_user_meta_data = raw_user_meta_data-'userName' || '{"role": "USER" }'::jsonb
    where id = new.id;

    return null;
end;
$$ language plpgsql;

create trigger on_new_user after insert on auth.users
    for each row execute function internal.handle_new_user();

create function internal.sync_email()
returns trigger
as $$
begin
    update public.accounts
    set email = new.email
    where id = new.id;
    return null;
end;
$$ language plpgsql;

create trigger on_email_change
    after update of email -- only fire when the email changed
    on auth.users
    for each row
    execute function internal.sync_email();

create function internal.sync_role()
returns trigger
-- internal is needed for `public.accounts`
-- extensions is needed for JSON operators for some reason
-- auth is needed so that we can modify it
-- pg_temp as last comes from Postgres' security guidelines
security definer set search_path = internal, jsonb, auth, pg_temp
as $$
begin
    update auth.users set
        raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', new.role::jsonb)
    where id = new.id;
    return null;
end;
$$ language plpgsql;

create trigger on_role_change
    after update of role
    on public.accounts
    for each row
    execute function internal.sync_role();

-- 2. `is_admin` function
create function is_admin(_user_id uuid)
returns boolean 
as $$
begin
    return exists (
        select 1
        from users
        where
            users.id = _user_id and
            users.role = 'ADMIN'
    );
end;
$$ language plpgsql;


-- 3. Setup `public` view of users, for profile editing
create view public.users as 
    select * from public.accounts
    where id = auth.uid(); -- important for security!

create function internal.handle_user_update()
returns trigger
security definer set search_path = internal
as $$
begin
    if old.role <> new.role then
        raise exception 'Role changes have to be done by a system administrator';
    end if;
    
    if old.email <> new.email then
        raise exception 'Email changes have to be done through the authentication system';
    end if;

    update public.users set 
        "userName" = new."userName",
        "firstName" = new."firstName",
        "lastName" = new."lastName",
        country = new.country,
        city = new.city,
        phone = new.phone,
        "birthDate" = new."birthDate",
        image = new.image
    where id = new.id;

    return new;
end;
$$ language plpgsql;

create trigger create_user_does_nothing
    instead of insert on public.users
    for each row
    execute function internal.do_nothing();

create trigger update_user
    instead of update on public.users
    for each row
    execute function internal.handle_user_update();

create trigger delete_user_does_nothing
    instead of delete on public.users
    for each row
    execute function internal.do_nothing();


-- 4. Profiles
-- This view bypasses row-level security & allows everyone to view any profile
create view public.profiles as
    select 
        id,
        "userName",
        role,
        created,
        "image",
        "firstName",
        "lastName",
        country,
        city
    from public.accounts;


create trigger profiles_are_read_only
    instead of insert or update or delete 
    on public.profiles
    for each row execute function internal.do_nothing();

-- 5. Image registration

-- A user account never has any profile picture on creation, so no need for an insert trigger

create trigger img_changed
    after update of image
    on public.accounts
    for each row
    when ( (old.image).id <> (new.image).id )
    execute function internal.img_changed();

create trigger unregister_img
    after delete
    on public.accounts
    for each row execute function internal.unregister_img();