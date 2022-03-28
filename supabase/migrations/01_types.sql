CREATE TYPE public.role AS ENUM('USER', 'ADMIN');
CREATE TYPE public.contributor_role as ENUM('CONTRIBUTOR', 'ADMIN');

-- CREATE TYPE public.topostatus AS ENUM(
--     '0', -- Draft
--     '1', -- Submitted
--     '2' -- Validated
-- );

-- CREATE TYPE public.topotype AS ENUM(
--     'Boulder',
--     'Cliff',
--     'Deep water',
--     'Multi-pitch',
--     'Artificial'
-- );

-- CREATE TYPE public.difficulty AS ENUM('Good', 'OK', 'Bad', 'Dangerous');
-- CREATE TYPE public.reception AS ENUM('Good', 'OK', 'Dangerous', 'None');

-- CREATE TYPE public.orientation AS ENUM('N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW');

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

create type public.img as (
    id uuid,
    ratio double precision
);

-- CREATE TYPE public.rating AS ENUM('1', '2', '3', '4', '5');