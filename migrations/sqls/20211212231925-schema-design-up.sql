-- Up migration
CREATE TABLE images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- UNIQUE constraint also provides us with an index on the path
    path STRING NOT NULL UNIQUE
);

CREATE TYPE Role AS ENUM('USER', 'ADMIN');

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    pseudo STRING(255) UNIQUE NOT NULL,
    email STRING(1000) UNIQUE NOT NULL,
    role Role DEFAULT ' USER' NOT NULL,
    created TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    first_name STRING(500),
    last_name STRING(500),

    image_id UUID REFERENCES images(id) ON DELETE SET NULL
);

CREATE TYPE TopoStatus AS ENUM('Draft', 'Submitted', 'Validated');

CREATE TYPE TopoType AS ENUM(
    'Boulder',
    'Cliff',
    'Deep water',
    'Multi-pitch',
    'Artificial'
);

CREATE TYPE Difficulty AS ENUM('Good', 'OK', 'Bad', 'Dangerous');

-- CockroachDB does not have triggers, `modified` column has to be maintained manually
CREATE TABLE topos (
    -- Mandatory
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    spaces INT NOT NULL,
    location GEOGRAPHY(POINT) NOT NULL,
    description STRING(5000),

    topo_id UUID NOT NULL REFERENCES topos(id) ON DELETE CASCADE,
    image_id UUID REFERENCES images(id) ON DELETE SET NULL
);

CREATE TABLE sectors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name STRING(255),
    description STRING(5000),

    topo_id UUID NOT NULL REFERENCES topos(id) ON DELETE CASCADE,
    image_id UUID REFERENCES images(id) ON DELETE SET NULL
);

CREATE TABLE boulders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location GEOGRAPHY(POINT) NOT NULL,
    name STRING(255),
    is_highball BOOL DEFAULT false NOT NULL,
    must_see BOOL DEFAULT false NOT NULL,
    descent Difficulty,

    sector_id UUID NOT NULL REFERENCES sectors(id) ON DELETE CASCADE
);

CREATE TABLE boulder_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    image_id UUID NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    boulder_id UUID NOT NULL REFERENCES boulders(id) ON DELETE CASCADE
);

CREATE TYPE Orientation AS ENUM('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW');

CREATE TYPE Grade AS ENUM(
    '3',
    '3+',
    '4',
    '4+',
    '5a',
    '5a+',
    '5b',
    '5b+',
    '5c',
    '5c+',
    '6a',
    '6a+',
    '6b',
    '6b+',
    '6c',
    '6c+',
    '7a',
    '7a+',
    '7b',
    '7b+',
    '7c',
    '7c+',
    '8a',
    '8a+',
    '8b',
    '8b+',
    '8c',
    '8c+',
    '9a',
    '9a+',
    '9b',
    '9b+',
    '9c',
    '9c+'
);

CREATE TABLE tracks (
    -- Required
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nb_anchors INT DEFAULT 0 NOT NULL,
    line GEOMETRY(LINESTRING) NOT NULL,
    forbidden GEOMETRY(MULTIPOLYGON),
    starting_points GEOMETRY(MULTIPOINT),

    image_id UUID NOT NULL REFERENCES boulder_images(id) ON DELETE CASCADE,
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE
);

CREATE TYPE Rating AS ENUM('1', '2', '3', '4', '5');

CREATE TABLE track_rating (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    finished BOOL NOT NULL,
    rating Rating NOT NULL,
    comment String(5000),
    
    track_id UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL
);