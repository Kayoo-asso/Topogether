create table public.topos (
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
    rock_types int4 default 0 not null,

    -- optional
    description varchar(5000),
    fauna_protection varchar(5000),
    ethics varchar(5000),
    danger varchar(5000),
    cleaned date,
    altitude integer,
    approach_time integer,
    other_amenities varchar(5000),

    -- required to maintain the ordering
    lonely_boulders uuid[] not null default '{}',

    -- relations
    creator_id uuid references public.users(id) on delete set null,
    validator_id uuid references public.users(id) on delete set null
    -- added later: image_id
    -- image_id uuid references public.images(id) on delete set null
);

create table public.topo_contributors (
    topo_id uuid not null,
    user_id uuid not null,
    role public.contributor_role not null,

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
    insert into public.topo_contributors (topo_id, user_id, role)
    values (new.id, new.creator_id, 'ADMIN');
    return new;
end;
$$;

create trigger on_topo_created
    after insert on public.topos
    for each row execute procedure setup_topo_admin();

alter table public.topo_contributors enable row level security;

create policy "Topo contributors are visible by everyone"
    on topo_contributors for select
    using ( true );

-- TODO: may need more fine-grained policies, to avoid one topo admin downgrading / kicking out other topo admins
create policy "Only tpo admins can manage contributors"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` case
    using ( is_topo_admin(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

alter table public.topos enable row level security;

create policy "Topos are visible by everyone"
    on topos for select
    using ( true );

create policy "Topos can be inserted by their creator."
    on topos for insert
    with check (
        creator_id is not null and
        auth.uid() = creator_id
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
    contactName varchar(500) not null,
    contactPhone varchar(30),
    contactMail varchar(500),
    description varchar(5000),
    address varchar(2000),
    zip integer,
    city varchar(500),
    image_url text,
    topo_id uuid not null references public.topos(id) on delete cascade
);

alter table managers enable row level security;

create policy "Managers are visible for everyone"
    on managers for select
    using ( true );

create policy "Managers can be modified by topo admins"
    on managers for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_topo_admin(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on managers for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );


-- TOPO IMAGES

create table public.topo_images (
    id uuid primary key,
    url text not null,
    topo_id uuid not null references public.topos(id) on delete cascade
);

alter table public.topos add column
    image_id uuid references public.topo_images(id);

alter table public.topo_images enable row level security;

create policy "Images are visible to everyone"
    on topo_images for select
    using ( true );

create policy "Images can only be created by contributors"
    on topo_images for insert
    with check ( is_contributor(topo_id, auth.uid()) );

-- No image modifications

-- Image deletions are done through a special API route,
-- to delete them in the object storage as well (Dropbox atm)

-- PARKINGS
create table public.parkings (
    id uuid primary key,
    spaces int not null,
    location geography(point) not null,
    description varchar(5000),

    topo_id uuid not null references public.topos(id) on delete cascade,
    image_id uuid references public.topo_images(id) on delete set null
);

alter table public.parkings enable row level security;

create policy "Parkings are visible for everyone"
    on parkings for select
    using ( true );

create policy "Parkings can be modified by topo contributors"
    on parkings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on parkings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );


-- TOPO ACCESS
create table topo_accesses (
    id uuid primary key,
    duration int,
    danger varchar(5000),
    difficulty public.difficulty,
    steps jsonb, -- easy way out
    topo_id uuid not null references public.topos(id) on delete cascade
);

alter table topo_accesses enable row level security;

create policy "Topo accesses are visible for everyone"
    on topo_accesses for select
    using ( true );

create policy "Topo accesses can be modified by topo contributors"
    on topo_accesses for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on topo_accesses for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- WAYPOINTS
create table public.waypoints (
    id uuid primary key,
    name varchar(500) not null,
    location geography(point) not null,
    description varchar(5000),
    image_url text,

    topo_id uuid not null references public.topos(id) on delete cascade
);

alter table public.waypoints enable row level security;

create policy "Waypoints are visible for everyone"
    on waypoints for select
    using ( true );

create policy "Waypoints can be modified by topo contributors"
    on waypoints for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on waypoints for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- SECTORS
create table public.sectors (
    id uuid primary key,
    name varchar(255) not null,
    path geography(polygon) not null,

    topo_id uuid not null references public.topos(id) on delete cascade,
    image_id uuid references public.topo_images(id) on delete set null
);

alter table public.sectors enable row level security;

create policy "Sectors are visible for everyone"
    on sectors for select
    using ( true );

create policy "Sectors can be modified by topo contributors"
    on sectors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_contributor(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on sectors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- BOULDERS
create table public.boulders (
    id uuid primary key,
    location geography(point) not null,
    name varchar(500) not null,
    is_highball boolean default false not null,
    must_see boolean default false not null,
    dangerous_descent boolean default false not null,

    tracks uuid[] default '{}' not null,
    topo_id uuid not null references public.topos(id) on delete cascade
);

alter table public.boulders enable row level security;

create policy "Boulders are visible for everyone"
    on boulders for select
    using ( true );

create policy "Boulders can be modified by topo contributors"
    on boulders for all
    using ( is_contributor(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on boulders for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- TRACKS
create table public.tracks (
    id uuid primary key,

    name varchar(500),
    description varchar(5000),
    height integer,
    grade public.grade,
    orientation public.orientation,
    reception public.difficulty,
    anchors integer,
    -- bitflag
    techniques integer DEFAULT 0 not null,

    is_traverse boolean default false not null,
    is_sitting_start boolean default false not null,
    must_see boolean default false not null,
    has_mantle boolean default false not null,

    lines uuid[] default '{}' not null,

    -- this duplication makes row level security easier
    topo_id uuid references public.topos(id) on delete cascade,
    boulder_id uuid not null references public.boulders(id) on delete cascade,
    creator_id uuid references public.users(id) on delete set null
);

alter table public.tracks enable row level security;

create policy "Tracks are visible for everyone"
    on tracks for select
    using ( true );

-- TODO: add authorizations specific to track creators, even if they are not topo contributors?
create policy "Tracks can be modified by topo contributors"
    on tracks for all
    using ( is_contributor(topo_id, auth.uid()) );

create policy "Admins are omnipotent"
    on tracks for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- LINES
create table public.lines (
    id uuid primary key,
    points geography(linestring) not null,
    forbidden geography(multipolygon),
    hand1 geometry(point),
    hand2 geometry(point),
    foot1 geometry(point),
    foot2 geometry(point),

    topo_id uuid not null references public.topos(id) on delete cascade,
    track_id uuid not null references public.tracks(id) on delete cascade,
    image_id uuid references public.topo_images(id) on delete set null
);

alter table public.lines enable row level security;

create policy "Lines are visible for everyone"
    on lines for select
    using ( true );

create policy "Lines can be modified by topo contributors"
    on lines for all
    using ( is_contributor(topo_id, auth.uid()) )
    with check ( is_contributor(topo_id, auth.uid()));

create policy "Admins are omnipotent"
    on lines for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- TRACK RATINGS
create table public.ratings (
    id uuid primary key,
    finished boolean not null,
    rating public.rating not null,
    comment varchar(5000),
    
    -- only needed for efficient RLS if topo admins / contributors can edit ratings
    -- topo_id uuid not null references public.topos(id) on delete cascade,
    track_id uuid not null references public.tracks(id) on delete cascade,
    user_id uuid references public.users(id) on delete set null
);

alter table public.ratings enable row level security;

create policy "Ratings can be modified by their authors"
    on ratings for all
    using ( user_id = auth.uid() );

create policy "Admins are omnipotent"
    on ratings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );


-- Setup modification timestamping on topos and nested entities
create trigger handle_updated_at before update on public.topos 
  for each row execute procedure moddatetime (modified);

create function topo_was_modified()
returns trigger
language plpgsql
as $$
begin
    update topos
    set modified = now()
    where topos.id = new.topo_id;
end;
$$;

create trigger handle_updated_at after insert or update on public.boulders
    for each row execute procedure topo_was_modified();

create trigger handle_updated_at after insert or update on public.sectors
    for each row execute procedure topo_was_modified();

create trigger handle_updated_at after insert or update on public.tracks
    for each row execute procedure topo_was_modified();

create trigger handle_updated_at after insert or update on public.lines
    for each row execute procedure topo_was_modified();

create trigger handle_updated_at after insert or update on public.waypoints
    for each row execute procedure topo_was_modified();

create trigger handle_updated_at after insert or update on public.parkings
    for each row execute procedure topo_was_modified();

create trigger handle_updated_at after insert or update on public.managers
    for each row execute procedure topo_was_modified();

create trigger handle_updated_at after insert or update on public.topo_accesses
    for each row execute procedure topo_was_modified();