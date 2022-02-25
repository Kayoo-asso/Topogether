create table users (
    -- Cascading deletes is important, so that we can remove a user from the `auth` schema
    id uuid primary key references auth.users on delete cascade,
    "userName" text not null,
    -- The email can be found in the `auth.users` table.
    -- It is maintained in sync by a trigger (see below)
    email varchar(1000) not null,

    role role default 'USER' not null,
    created timestamptz default now() not null,

    "imageUrl" text,
    "firstName" varchar(500),
    "lastName" varchar(500),
    country varchar(500),
    city varchar(500),
    phone varchar(30),
    "birthDate" date
);

alter table users enable row level security;

create function is_admin(user_id uuid)
returns boolean 
language plpgsql
as $$
begin
    return exists (
        select 1
        from users
        where
            users.id = user_id and
            users.role = 'ADMIN'
    );
end;
$$;


create policy "Only users can see and modify their own account."
    on users for all
    -- the `using` case will also be applied for the `with check` case
    using ( auth.uid() = id );

create policy "Admins are omnipotent"
    on users for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- Profiles w/ ADMIN role can only be created using the master key

create policy "Only users with USER role can be inserted."
    on users for insert
    with check ( role = 'USER' );

create policy "Users can only be updated to USER role"
    on users for update
    using ( role = 'USER' );

-- Create an entry in `users` for each new user
-- This assumes the user_name was provided as additional data.
-- This clears the user_name from the user meta data in `auth.users`
create function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public, extensions, auth, pg_temp
as $$
begin
    insert into users(id, "userName", email)
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
    for each row execute function handle_new_user();

-- I don't think we need security definer here?
create function sync_email()
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

create trigger on_email_change after update on auth.users
    for each row
    when ( old.email <> new.email )
    execute function sync_email();

-- When a user account is deleted (by the user themselves, or an admin),
-- also delete the corresponding entry in `auth.users`.
create function handle_deleted_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    delete from auth.users
    where id = old.id;
    return null;
end;
$$;

create trigger on_delete_user after delete on users
    for each row execute function handle_deleted_user();

-- Prevent direct email or role changes in the `users` table
create function enforce_security()
returns trigger
language plpgsql
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
$$;

create trigger on_account_update before update on users
    for each row execute function enforce_security();


-- ### PROFILES ###
create view public.profiles as
    select 
        id,
        "userName",
        role,
        created,
        "firstName",
        "lastName",
        country,
        city
    from public.users;

-- Avoids the view bypassing row-level security
alter view public.profiles owner to authenticated;