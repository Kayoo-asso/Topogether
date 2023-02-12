-- [SCHEMAS + EXTENSIONS]
create schema if not exists internal;

create extension if not exists postgis;
create extension if not exists pg_trgm;

-- [TYPES]
CREATE TYPE public.role AS ENUM('USER', 'ADMIN');
CREATE TYPE public.contributor_role as ENUM('CONTRIBUTOR', 'ADMIN');

CREATE TYPE public.grade AS ENUM(
    '3', '3+',
    '4', '4+',
    '5a', '5a+', '5b', '5b+', '5c', '5c+',
    '6a', '6a+', '6b', '6b+', '6c', '6c+',
    '7a', '7a+', '7b', '7b+', '7c', '7c+',
    '8a', '8a+', '8b', '8b+', '8c', '8c+',
    '9a', '9a+', '9b', '9b+', '9c', '9c+'
);

CREATE TYPE public.grade_category as ENUM(
    '3', '4', '5', '6', '7', '8', '9', 'None'
);

-- [TABLES]

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
    rock_types int4 default 0 not null,
    type int4 default 0 not null,

    -- optional
    description varchar(5000),
    fauna_protection varchar(5000),
    ethics varchar(5000),
    danger varchar(5000),
    cleaned date,
    altitude integer,
    closest_city varchar(500),
    other_amenities varchar(5000),

    -- required to maintain the ordering
    lonely_boulders uuid[] not null default '{}',

    -- relations
    image jsonb,
    creator_id uuid not null,
    validator_id uuid
);

create index topo_creator_idx on public.topos(creator_id);
create index topo_validator_idx on public.topos(validator_id);

-- References:
-- x https://www.postgresql.org/docs/12/textsearch.html
-- x https://www.postgresql.org/docs/current/pgtrgm.html
-- x https://blog.crunchydata.com/blog/postgres-full-text-search-a-search-engine-in-a-database
-- x https://leandronsp.com/a-powerful-full-text-search-in-postgresql-in-less-than-20-lines
-- x http://rachbelaid.com/postgres-full-text-search-is-good-enough/
create index trgm_idx on public.topos
    using gin(name gin_trgm_ops);

create table topo_contributors (
    topo_id uuid not null references public.topos(id) on delete cascade,
    user_id uuid not null,
    role contributor_role not null,

    -- Important order has to be the same as the one in `WHERE` conditions from trigger functions
    primary key (topo_id, user_id)
);

create index topo_contributors_user_idx on public.topo_contributors(user_id);

create table managers (
    id uuid primary key,
    name varchar(500) not null,
    contact_name varchar(500) not null,
    contact_phone varchar(30),
    contact_mail varchar(500),
    description varchar(5000),
    address varchar(5000),
    zip integer,
    city varchar(500),
    topo_id uuid not null references public.topos(id) on delete cascade,
    image jsonb
);

create index managers_topo_idx on public.managers(topo_id);

create table parkings (
    id uuid primary key,
    spaces int not null,
    location geometry(point) not null,
    name varchar(500),
    description varchar(5000),

    topo_id uuid not null references public.topos(id) on delete cascade,
    image jsonb
);

create index parkings_topo_idx on public.parkings(topo_id);

create table waypoints (
    id uuid primary key,
    name varchar(500) not null,
    location geometry(point) not null,
    description varchar(5000),

    topo_id uuid not null references public.topos(id) on delete cascade,
    image jsonb
);

create index waypoints_topo_idx on public.waypoints(topo_id);


create table topo_accesses (
    id uuid primary key,
    danger varchar(5000),
    difficulty int2, -- TypeScript enum
    duration int,
    steps jsonb not null,

    topo_id uuid not null references public.topos(id) on delete cascade
);

create index accesses_topo_idx on public.topo_accesses(topo_id);

create table public.sectors (
    id uuid primary key,
    index double precision not null,
    name varchar(255) not null,
    path geometry(linestring) not null,
    boulders uuid[] not null,

    topo_id uuid not null references public.topos(id) on delete cascade
);

create index sectors_topo_idx on public.sectors(topo_id);

create table boulders (
    id uuid primary key,
    location geometry(point) not null,
    name varchar(500) not null,
    is_highball boolean default false not null,
    must_see boolean default false not null,
    dangerous_descent boolean default false not null,
    images jsonb default '[]' not null,

    topo_id uuid not null references topos(id) on delete cascade
);

create index boulders_topo_idx on public.boulders(topo_id);

create table tracks (
    id uuid primary key,
    index double precision not null,

    name varchar(500),
    description varchar(5000),
    height integer,
    grade grade,
    orientation int2, -- typescript enum
    reception int2, -- typescript enum
    anchors integer,
    -- bitflag
    spec integer not null default 0,


    is_traverse boolean default false not null,
    is_sitting_start boolean default false not null,
    must_see boolean default false not null,
    has_mantle boolean default false not null,

    -- this duplication makes row level security easier
    topo_id uuid not null references public.topos(id) on delete cascade,
    boulder_id uuid not null references public.boulders(id) on delete cascade,
    creator_id uuid not null
);

create index tracks_topo_idx on public.tracks(topo_id);
create index tracks_boulder_idx on public.tracks(boulder_id);
create index tracks_creator_idx on public.tracks(creator_id);

create table lines (
    id uuid primary key,
    index double precision not null,

    -- LineStrings require 2+ points, but we also accept lines with 0 or 1 point
    points double precision[] not null,
    forbidden number[][],
    hand1 geometry(point),
    hand2 geometry(point),
    foot1 geometry(point),
    foot2 geometry(point),

    image_id uuid,
    topo_id uuid not null references public.topos(id) on delete cascade,
    track_id uuid not null references public.tracks(id) on delete cascade
);

create index lines_topo_idx on public.lines(topo_id);
create index lines_track_idx on public.lines(track_id);

create table track_ratings (
    id uuid primary key,
    finished boolean not null,
    rating int2 not null,
    comment varchar(5000),
    created timestamptz not null default now(),
    modified timestamptz not null default now(),
    
    topo_id uuid not null references public.topos(id) on delete cascade,
    track_id uuid not null references public.tracks(id) on delete cascade,
    author_id uuid not null
);

create unique index track_ratings_track_idx on public.track_ratings(track_id, author_id);
create index track_ratings_author_idx on public.track_ratings(author_id);


create table public.topo_likes (
    topo_id uuid references public.topos(id) on delete cascade,
    user_id uuid not null,
    created timestamptz not null default now(),

    primary key(topo_id, user_id)
);

create index topo_likes_user_idx on public.topo_likes(user_id);

create table public.boulder_likes (
    boulder_id uuid references public.boulders(id) on delete cascade,
    user_id uuid not null,
    created timestamptz not null default now(),

    primary key(boulder_id, user_id)
);

create index boulder_likes_user_idx on public.boulder_likes(user_id);