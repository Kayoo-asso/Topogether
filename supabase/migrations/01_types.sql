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

create type public.img as (
    id uuid,
    ratio double precision
);
