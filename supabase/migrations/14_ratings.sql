-- TRACK RATINGS
create table track_ratings (
    id uuid primary key,
    finished boolean not null,
    rating int2 not null,
    comment varchar(5000),
    created timestamptz not null default now(),
    modified timestamptz not null default now(),
    
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "trackId" uuid not null references public.tracks(id) on delete cascade,
    "authorId" uuid references public.accounts(id) on delete set null
);

create unique index track_ratings_track_idx on public.track_ratings("trackId", "authorId");
create index track_ratings_author_idx on public.track_ratings("authorId");

alter table track_ratings enable row level security;

-- No need to check the status of the topo, since ratings can only be placed on validated topos
create policy "track_ratings are visible by everyone"
    on track_ratings for select
    using ( true );

create policy "track_ratings can be placed by their authors on validated topos"
    on track_ratings for all
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
    on track_ratings for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- Timestamps maintenance
create function internal.insert_timestamps()
returns trigger
as $$
begin
    new.created = now();
    new.modified = now();
    return new;
end;
$$ language plpgsql;

create function internal.update_timestamps()
returns trigger
as $$
begin
    new.created = old.created;
    new.modified = now();
    return new;
end;
$$ language plpgsql;

create trigger on_insert before insert
    on public.track_ratings
    for each row execute function internal.insert_timestamps();

create trigger on_update before update
    on public.track_ratings
    for each row execute function internal.update_timestamps();