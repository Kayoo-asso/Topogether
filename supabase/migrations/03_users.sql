create table public.users (
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

    "imagePath" text
);

alter table public.users enable row level security;

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

-- Users cannot INSERT a new account, they have to go through the auth process
create policy "Only users can see their own account."
    on public.users for select
    -- the `using` case will also be applied for the `with check` case
    using ( auth.uid() = id );

create policy "Only users can update their account"
    on public.users for update
    using ( auth.uid() = id and role = 'USER' );

create policy "Only users can delete their account"
    on public.users for delete
    using ( auth.uid() = id );

create policy "Admins are omnipotent"
    on public.users for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- Create an entry in `users` for each new user
-- This assumes the user_name was provided as additional data.
-- This clears the user_name from the user meta data in `auth.users`
create function internal.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public, extensions, auth, pg_temp
as $$
begin
    insert into public.users(id, "userName", email)
    values (new.id, (new.raw_user_meta_data::jsonb->>'userName')::varchar(500), new.email);
    -- not very efficient (we just inserted into auth.users)
    -- but we're never signing up a lot of users at once, so this is fine
    update auth.users
    set raw_user_meta_data = '{}'::jsonb
    where id = new.id;
    return null;
end;
$$;

create trigger on_new_user after insert on auth.users
    for each row execute function internal.handle_new_user();


-- Prevent direct email or role changes in the `users` table
create function internal.handle_user_update()
returns trigger
as $$
begin
    if old.email <> new.email then
        raise exception 'Email changes should go through the authentication service.';
    end if;

    if old.role <> new.role then
        raise exception 'User roles can only be changed by the database administrator.';
    end if;

    new.created = old.created;

    return new;
end;
$$ language plpgsql;


create trigger on_update_user
    before update of email, role, created
    on public.users
    for each row execute function internal.handle_user_update();


-- When a user account is deleted (by the user themselves, or an admin),
-- also delete the corresponding entry in `auth.users`.
create function internal.handle_deleted_user()
returns trigger
security definer set search_path = public
as $$
begin
    -- Remove from auth table
    delete from auth.users
    where id = old.id;
    return null;
end;
$$ language plpgsql;

create trigger on_delete_user after delete on public.users
    for each row execute function internal.handle_deleted_user();

-- I don't think we need security definer here?
create function internal.sync_email()
returns trigger
language plpgsql
as $$
begin
    update users
    set email = new.email
    where id = new.id;
    return null;
end;
$$;

create trigger on_email_change
    after update of email -- only fire when the email changed
    on auth.users
    for each row
    when ( old.email <> new.email )
    execute function internal.sync_email();


-- ### PROFILES ###
-- This view bypasses row-level security & allows everyone to view any profile
create view public.profiles as
    select 
        id,
        "userName",
        role,
        created,
        "imagePath",
        "firstName",
        "lastName",
        country,
        city
    from public.users;

-- Prevent inserts / updates / deletes through profiles
create function internal.do_nothing()
returns trigger
as $$
begin
    return null;
end;
$$ language plpgsql;

create trigger profiles_are_read_only
    instead of insert or update or delete 
    on public.profiles
    for each row execute function internal.do_nothing();

-- Image registration

-- A user account never has any profile picture on creation

create trigger img_changed
    after update of "imagePath"
    on users
    for each row
    when (old."imagePath" <> new."imagePath")
    execute function internal.img_changed();

create trigger unregister_img
    after delete
    on users
    for each row execute function internal.unregister_img();