-- Up migration
-- TODO: remove all gen_random_uuid(), these will be created on the front-end

-- Type definitions
CREATE TYPE public.role AS ENUM('USER', 'ADMIN');
CREATE TYPE public.topostatus AS ENUM('Draft', 'Submitted', 'Validated');

CREATE TYPE public.topotype AS ENUM(
    'Boulder',
    'Cliff',
    'Deep water',
    'Multi-pitch',
    'Artificial'
);

CREATE TYPE public.difficulty AS ENUM('Good', 'OK', 'Bad', 'Dangerous');

CREATE TYPE public.orientation AS ENUM('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW');

CREATE TYPE public.grade AS ENUM(
    '3', '3+',
    '4', '4+',
    '5a', '5a+', '5b', '5b+', '5c', '5c+',
    '6a', '6a+', '6b', '6b+', '6c', '6c+',
    '7a', '7a+', '7b', '7b+', '7c', '7c+',
    '8a', '8a+', '8b', '8b+', '8c', '8c+',
    '9a', '9a+', '9b', '9b+', '9c', '9c+'
);

CREATE TYPE public.rating AS ENUM('1', '2', '3', '4', '5');

-- Tables

CREATE TABLE public.images (
    id UUID PRIMARY KEY,
    -- UNIQUE constraint also provides us with an index on the path
    path TEXT NOT NULL UNIQUE
);


CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    pseudo STRING(255) UNIQUE NOT NULL,
    email STRING(1000) UNIQUE NOT NULL,
    role Role DEFAULT 'USER' NOT NULL,
    created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    first_name STRING(500),
    last_name STRING(500),

    image_id UUID REFERENCES images ON DELETE SET NULL
);



-- CockroachDB does not have triggers, `modified` column has to be maintained manually
CREATE TABLE topos (
    -- Mandatory
    id UUID PRIMARY KEY,
    name STRING(500) NOT NULL,
    created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    modified TIMESTAMPTZ NOT NULL,
    status TopoStatus DEFAULT('Draft') NOT NULL,
    type TopoType NOT NULL,
    location GEOGRAPHY(POINT) NOT NULL,
    -- Bitflags
    amenities VARBIT(32) DEFAULT 0::VARBIT(32) NOT NULL,
    rock_types VARBIT(32) DEFAULT 0::VARBIT(32) NOT NULL,
    -- Optional
    altitude INT,
    approach_time INT,
    approach_difficulty Difficulty,
    -- high limits on STRING size, there may be a lot of information
    remarks STRING(5000),
    security_instructions STRING(5000),
    danger String(5000),
    forbidden_reason STRING(5000),
    other_amenities STRING(5000),
    -- Relations
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    validator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    photo_id UUID REFERENCES images(id) ON DELETE SET NULL
);

CREATE TABLE parkings (
    id UUID PRIMARY KEY,
    spaces INT NOT NULL,
    location GEOGRAPHY(POINT) NOT NULL,
    description STRING(5000),

    topo_id UUID NOT NULL REFERENCES topos(id) ON DELETE CASCADE,
    image_id UUID REFERENCES images(id) ON DELETE SET NULL
);

CREATE TABLE sectors (
    id UUID PRIMARY KEY,
    name STRING(255),
    description STRING(5000),

    topo_id UUID NOT NULL REFERENCES topos(id) ON DELETE CASCADE,
    image_id UUID REFERENCES images(id) ON DELETE SET NULL
);

CREATE TABLE boulders (
    id UUID PRIMARY KEY,
    order_index INT NOT NULL,
    location GEOGRAPHY(POINT) NOT NULL,
    name STRING(255),
    is_highball BOOL DEFAULT false NOT NULL,
    must_see BOOL DEFAULT false NOT NULL,
    descent Difficulty,

    sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE
);

-- TODO: add orderIndex
CREATE TABLE boulder_images (
    id UUID PRIMARY KEY,
    image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    boulder_id UUID NOT NULL REFERENCES boulders(id) ON DELETE CASCADE
);
    


CREATE TABLE tracks (
    -- Required
    id UUID PRIMARY KEY,
    grade Grade NOT NULL,
    reception Difficulty NOT NULL,
    -- Optional    
    name STRING(255),
    description STRING(5000),
    height INT,
    orientation Orientation,
    -- bitflag, max of 32 bits (due to JavaScript's limitations)
    techniques VARBIT(32) DEFAULT 0::VARBIT(32) NOT NULL,
    is_traverse BOOL DEFAULT false NOT NULL,
    -- has_anchor can be derived from looking at the lines
    has_mantle BOOL DEFAULT false NOT NULL,

    boulder_id UUID NOT NULL REFERENCES boulders(id) ON DELETE CASCADE,
    creator_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE lines (
    id UUID PRIMARY KEY,
    orderIndex INT NOT NULL,
    nb_anchors INT DEFAULT 0 NOT NULL,
    line GEOMETRY(LINESTRING) NOT NULL,
    forbidden GEOMETRY(MULTIPOLYGON),
    starting_points GEOMETRY(MULTIPOINT),

    image_id UUID NOT NULL REFERENCES boulder_images(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE
);


CREATE TABLE track_rating (
    id UUID PRIMARY KEY,
    finished BOOLEAN NOT NULL,
    rating Rating NOT NULL,
    comment VARCHAR(5000),
    
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL
);