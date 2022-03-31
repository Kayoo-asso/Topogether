-- TRACK RATINGS
create table ratings (
    id uuid primary key,
    finished boolean not null,
    rating int2 not null,
    comment varchar(5000),
    
    -- only needed for efficient RLS if topo admins / contributors can edit ratings
    -- topo_id uuid not null references topos(id) on delete cascade,
    "trackId" uuid not null references public.tracks(id) on delete cascade,
    "authorId" uuid references public.accounts(id) on delete set null
);

alter table ratings enable row level security;

create policy "Ratings are visible by everyone"
    on ratings for select
    using ( true );

create policy "Ratings can be modified by their authors"
    on ratings for all
    using ( "authorId" = auth.uid() );

create policy "Admins are omnipotent"
    on ratings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );


create table topo_likes (
    topo_id uuid not null references public.topos(id) on delete cascade,
    user_id uuid not null references public.accounts(id) on delete cascade,

    primary key (topo_id, user_id)
);
