-- TODO: better security regarding the value of topos.status

create table topos (
    -- mandatory
    id uuid primary key,
    name varchar(500) not null,
    status topostatus default('Draft') not null,
    type topotype not null,
    location geography(point) not null,
    forbidden boolean not null,

    -- timestamps
    modified timestamptz not null default now(),
    submitted timestamptz,
    validated timestamptz,

    -- bitflags
    amenities int4 default 0 not null,
    "rockTypes" int4 default 0 not null,

    -- optional
    imageUrl text,
    description varchar(5000),
    "faunaProtection" varchar(5000),
    ethics varchar(5000),
    danger varchar(5000),
    cleaned date,
    altitude integer,
    "approachTime" integer,
    "otherAmenities" varchar(5000),

    -- required to maintain the ordering
    "lonelyBoulders" uuid[] not null default '{}',

    -- relations
    "creatorId" uuid references public.users(id) on delete set null,
    "validatorId" uuid references public.users(id) on delete set null
);

create table topo_contributors (
    topo_id uuid not null,
    user_id uuid not null,
    role contributor_role not null,

    primary key (topo_id, user_id)
);

create function is_contributor(topo_id uuid, user_id uuid)
returns boolean
language plpgsql
as $$
begin
    return exists (
        select 1
        from topo_contributors as t
        where
            t.topo_id = topo_id and
            t.user_id = user_id
    );
end;
$$;

create function is_topo_admin(topo_id uuid, user_id uuid)
returns boolean
language plpgsql
as $$
begin
    return exists (
        select 1
        from topo_contributors as t
        where
            t.topo_id = topo_id and
            t.user_id = user_id and
            t.role = 'ADMIN'
    );
end;
$$;

-- security definer attribute is required, because the user does not yet
-- have the rights to be able to insert into topo_contributors
create function setup_topo_admin()
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
    for each row execute procedure setup_topo_admin();

alter table topo_contributors enable row level security;

create policy "Topo contributors are visible by everyone"
    on topo_contributors for select
    using ( true );

-- TODO: may need more fine-grained policies, to avoid one topo admin downgrading / kicking out other topo admins
create policy "Only topo admins can manage contributors"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` case
    using ( is_topo_admin(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

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
    using ( is_contributor(id, auth.uid()) );

create policy "Topos can be deleted by their admin"
    on topos for delete
    using ( is_topo_admin(id, auth.uid()) );

create policy "Admins are omnipotent"
    on topos for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- MANAGERS
create table managers (
    id uuid primary key,
    name varchar(500) not null,
    "contactName" varchar(500) not null,
    "contactPhone" varchar(30),
    "contactMail" varchar(500),
    description varchar(5000),
    address varchar(5000),
    zip integer,
    city varchar(500),
    "imageUrl" text, 
    "topoId" uuid not null references public.topos(id) on delete cascade
);

alter table managers enable row level security;

create policy "Managers are visible for everyone"
    on managers for select
    using ( true );

create policy "Managers can be modified by topo admins"
    on managers for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_topo_admin("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on managers for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );



-- TOPO ACCESS

create table topo_accesses (
    id uuid primary key,
    duration int,
    danger varchar(5000),
    difficulty difficulty,
    steps jsonb, -- hack, to avoid creating a separate table just for steps
    "topoId" uuid not null references topos(id) on delete cascade
);

alter table topo_accesses enable row level security;

-- simple check that each step contains a description
-- (since this is the expected shape by clients, this avoids crashes)
-- TODO" more extensive checking?
create function validate_topo_access_steps(steps jsonb)
returns boolean
as $$
declare
    step jsonb;
begin
    if jsonb_typeof(steps) <> 'array' then
        return false;
    end if;
    if jsonb_array_length(steps) = 0 then
        return true;
    end if;
    for step in select jsonb_array_elements(steps) loop
        if step->'description' is null then
            return false;
        end if;
    end loop;
    return true;
end;
$$ language plpgsql;

create policy "Topo accesses are visible for everyone"
    on topo_accesses for select
    using ( true );

create policy "Topo accesses can be created by topo contributors"
    on topo_accesses for insert
    with check (
        is_contributor("topoId", auth.uid() ) and
        validate_topo_access_steps(steps)
    );

create policy "Topo accesses can be updated by topo contributors"
    on topo_accesses for update
    using (
        is_contributor("topoId", auth.uid() ) and
        validate_topo_access_steps(steps)
    );

create policy "Topo accesses can be deleted by topo contributors"
    on topo_accesses for delete
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on topo_accesses for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) and validate_topo_access_steps(steps) );

-- PARKINGS
create table parkings (
    id uuid primary key,
    spaces int not null,
    location geography(point) not null,
    description varchar(5000),
    imageUrl text,

    "topoId" uuid not null references public.topos(id) on delete cascade
);

alter table parkings enable row level security;

create policy "Parkings are visible for everyone"
    on parkings for select
    using ( true );

create policy "Parkings can be modified by topo contributors"
    on parkings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on parkings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- WAYPOINTS
create table waypoints (
    id uuid primary key,
    name varchar(500) not null,
    location geography(point) not null,
    description varchar(5000),
    "imageUrl" text,

    "topoId" uuid not null references public.topos(id) on delete cascade
);

alter table waypoints enable row level security;

create policy "Waypoints are visible for everyone"
    on waypoints for select
    using ( true );

create policy "Waypoints can be modified by topo contributors"
    on waypoints for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on waypoints for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- SECTORS
create table public.sectors (
    id uuid primary key,
    name varchar(255) not null,
    path geography(polygon) not null,

    "topoId" uuid not null references public.topos(id) on delete cascade
);

alter table sectors enable row level security;

create policy "Sectors are visible for everyone"
    on sectors for select
    using ( true );

create policy "Sectors can be modified by topo contributors"
    on sectors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on sectors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- BOULDERS
create table boulders (
    id uuid primary key,
    location geography(point) not null,
    name varchar(500) not null,
    "isHighball" boolean default false not null,
    "mustSee" boolean default false not null,
    "dangerousDescent" boolean default false not null,

    "topoId" uuid not null references topos(id) on delete cascade
);

alter table boulders enable row level security;

create policy "Boulders are visible for everyone"
    on boulders for select
    using ( true );

create policy "Boulders can be modified by topo contributors"
    on boulders for all
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on boulders for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- BOULDER IMAGES
create table public.boulder_images (
    id uuid primary key,
    url text not null,
    width int4 not null,
    height int4 not null,
    "topoId" uuid not null references public.topos(id) on delete cascade
);

alter table public.boulder_images enable row level security;

create policy "Images are visible to everyone"
    on public.boulder_images for select
    using ( true );

create policy "Images can only be created by contributors"
    on public.boulder_images for insert
    with check ( is_contributor("topoId", auth.uid()) );

-- No image modifications.
-- Image deletions are done through a special API route,
-- to delete them in the object storage as well (Dropbox atm).

-- TRACKS
create table tracks (
    id uuid primary key,
    index double precision not null,

    name varchar(500),
    description varchar(5000),
    height integer,
    grade grade,
    orientation orientation,
    reception difficulty,
    anchors integer,
    -- bitflag
    techniques integer DEFAULT 0 not null,

    "isTraverse" boolean default false not null,
    "isSittingStart" boolean default false not null,
    "mustSee" boolean default false not null,
    "hasMantle" boolean default false not null,

    -- this duplication makes row level security easier
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "boulderId" uuid not null references public.boulders(id) on delete cascade,
    "creatorId" uuid references public.users(id) on delete set null
);

alter table tracks enable row level security;

create policy "Tracks are visible for everyone"
    on tracks for select
    using ( true );

-- TODO: add authorizations specific to track creators, even if they are not topo contributors?
create policy "Tracks can be modified by topo contributors"
    on tracks for all
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on tracks for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- LINES
create table lines (
    id uuid primary key,
    index double precision not null,

    points geography(linestring) not null,
    forbidden geography(multipolygon),
    hand1 geometry(point),
    hand2 geometry(point),
    foot1 geometry(point),
    foot2 geometry(point),

    "imageId" uuid references public.boulder_images(id) on delete set null,
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "trackId" uuid not null references public.tracks(id) on delete cascade
);

alter table lines enable row level security;

create policy "Lines are visible for everyone"
    on lines for select
    using ( true );

create policy "Lines can be modified by topo contributors"
    on lines for all
    -- will also be used for the `with check` cases
    using ( is_contributor("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on lines for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- TRACK RATINGS
create table ratings (
    id uuid primary key,
    finished boolean not null,
    rating rating not null,
    comment varchar(5000),
    
    -- only needed for efficient RLS if topo admins / contributors can edit ratings
    -- topo_id uuid not null references topos(id) on delete cascade,
    "trackId" uuid not null references public.tracks(id) on delete cascade,
    "userId" uuid references public.users(id) on delete set null
);

alter table ratings enable row level security;

create policy "Ratings can be modified by their authors"
    on ratings for all
    using ( "userId" = auth.uid() );

create policy "Admins are omnipotent"
    on ratings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );


-- Setup modification timestamping on topos and nested entities
create trigger handle_updated_at before update on topos 
  for each row execute procedure moddatetime (modified);

create function public.topo_was_modified()
returns trigger
language plpgsql
as $$
begin
    update topos
    set modified = now()
    where topos.id = new."topoId";
end;
$$;

create trigger handle_updated_at after insert or update on boulders
    for each row execute procedure public.topo_was_modified();

create trigger handle_updated_at after insert or update on sectors
    for each row execute procedure public.topo_was_modified();

create trigger handle_updated_at after insert or update on tracks
    for each row execute procedure public.topo_was_modified();

create trigger handle_updated_at after insert or update on lines
    for each row execute procedure public.topo_was_modified();

create trigger handle_updated_at after insert or update on waypoints
    for each row execute procedure public.topo_was_modified();

create trigger handle_updated_at after insert or update on parkings
    for each row execute procedure public.topo_was_modified();

create trigger handle_updated_at after insert or update on managers
    for each row execute procedure public.topo_was_modified();

create trigger handle_updated_at after insert or update on topo_accesses
    for each row execute procedure public.topo_was_modified();
