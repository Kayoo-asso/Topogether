-- ### TOPOS + CONTRIBUTORS ###
-- 0. Tables

-- IF YOU UPDATE THIS, UPDATE LIGHTOPO
create table topos (
    -- mandatory
    id uuid primary key,
    name varchar(500) not null,
    status smallint not null, -- TypeScript enum
    location geometry(point) not null,
    forbidden boolean not null,

    -- timestamps
    modified timestamptz not null default now(),
    submitted timestamptz,
    validated timestamptz,

    -- bitflags
    amenities int4 default 0 not null,
    "rockTypes" int4 default 0 not null,

    -- optional
    type smallint, -- TypeScript enum
    description varchar(5000),
    "faunaProtection" varchar(5000),
    ethics varchar(5000),
    danger varchar(5000),
    cleaned date,
    altitude integer,
    "closestCity" varchar(500),
    "otherAmenities" varchar(5000),

    -- required to maintain the ordering
    "lonelyBoulders" uuid[] not null default '{}',

    -- relations
    "imagePath" text,
    "creatorId" uuid references public.users(id) on delete set null,
    "validatorId" uuid references public.users(id) on delete set null
);

create table topo_contributors (
    topo_id uuid not null references public.topos(id) on delete cascade,
    user_id uuid not null references public.users(id) on delete cascade,
    role contributor_role not null,

    primary key (topo_id, user_id)
);

-- 1. Utilities

-- Argument names have a `_` prefix to avoid ambiguity in PL/pgSQL
create function is_contributor(_topo_id uuid, _user_id uuid)
returns boolean
as $$
begin
    return exists (
        select 1
        from topo_contributors as t
        where
            t.topo_id = _topo_id and
            t.user_id = _user_id
    );
end;
$$ language plpgsql;

create function is_topo_admin(_topo_id uuid, _user_id uuid)
returns boolean
language plpgsql
as $$
begin
    return exists (
        select 1
        from topo_contributors as t
        where
            t.topo_id = _topo_id and
            t.user_id = _user_id and
            t.role = 'ADMIN'
    );
end;
$$;

-- 2. Topo admin setup on creation

-- security definer attribute is required, because the user does not yet
-- have the rights to be able to insert into topo_contributors
create function internal.setup_topo_admin()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into topo_contributors (topo_id, user_id, role)
    values (new.id, new."creatorId", 'ADMIN');
    return new;
end;
$$;


create trigger on_topo_created
    after insert on topos
    for each row execute function internal.setup_topo_admin();


-- 3. Policies for `topo_contributors`
alter table topo_contributors enable row level security;

create policy "Topo contributors are visible by everyone"
    on topo_contributors for select
    using ( true );

-- TODO: may need more fine-grained policies, to avoid one topo admin downgrading / kicking out other topo admins
create policy "Only topo admins can manage contributors"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` case
    using ( 
        public.is_topo_admin(topo_id, auth.uid())
    );

create policy "Admins are omnipotent"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( public.is_admin(auth.uid()) );

-- 4. Policies for `topos`
alter table topos enable row level security;

create policy "Topos are visible by everyone"
    on topos for select
    using ( true );

create policy "Topos can be inserted by their creator."
    on topos for insert
    with check (
        "creatorId" is not null and 
        auth.uid() = "creatorId"
    );

create policy "Topos can be modified by contributors"
    on topos for update
    using ( 
        public.is_contributor(id, auth.uid())
    );

create policy "Topos can be deleted by their admin"
    on topos for delete
    using ( 
        public.is_topo_admin(id, auth.uid())
    );

create policy "Admins are omnipotent"
    on topos for all
    -- the `using` case will also be applied for the `with check` cases
    using ( 
        public.is_admin(auth.uid())
    );

-- 5. Image registration

create trigger check_new_img
    after insert
    on topos
    for each row execute function internal.check_new_img();

create trigger img_changed
    after update of "imagePath"
    on topos
    for each row
    when (old."imagePath" <> new."imagePath")
    execute function internal.img_changed();

create trigger unregister_img
    after delete
    on topos
    for each row execute function internal.unregister_img();





