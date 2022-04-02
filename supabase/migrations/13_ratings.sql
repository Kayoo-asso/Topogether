-- TRACK RATINGS
create table ratings (
    id uuid primary key,
    finished boolean not null,
    rating int2 not null,
    comment varchar(5000),
    
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "trackId" uuid not null references public.tracks(id) on delete cascade,
    "authorId" uuid references public.accounts(id) on delete set null
);

create unique index ratings_track_idx on public.ratings("trackId", "authorId");
create index ratings_author_idx on public.ratings("authorId");

alter table ratings enable row level security;

create policy "Ratings are visible by everyone"
    on ratings for select
    using ( true );

create policy "Ratings can be placed by their authors on validated topos"
    on ratings for all
    using ( 
        "authorId" = auth.uid() and
        exists (
            select 1
            from public.topos t
            where t.id = "topoId"
            and t.status = 2 -- validated
        )
    );

create policy "Admins are omnipotent"
    on ratings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

