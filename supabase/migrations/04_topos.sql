-- ### TOPOS + CONTRIBUTORS ###

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
    "rockTypes" int4 default 0 not null,

    -- optional
    type smallint, -- TypeScript enum
    description varchar(5000),
    "faunaProtection" varchar(5000),
    ethics varchar(5000),
    danger varchar(5000),
    cleaned date,
    altitude integer,
    "closestCity" varchar(500),
    "otherAmenities" varchar(5000),

    -- required to maintain the ordering
    "lonelyBoulders" uuid[] not null default '{}',

    -- relations
    "image" public.img,
    "creatorId" uuid references public.accounts(id) on delete set null,
    "validatorId" uuid references public.accounts(id) on delete set null
);

create index topo_creator_idx on public.topos("creatorId");
create index topo_validator_idx on public.topos("validatorId");

create table topo_contributors (
    topo_id uuid not null references public.topos(id) on delete cascade,
    user_id uuid not null references public.accounts(id) on delete cascade,
    role contributor_role not null,

    -- Important order has to be the same as the one in `WHERE` conditions from trigger functions
    primary key (topo_id, user_id)
);

create index topo_contributors_user_idx on public.topo_contributors(user_id);

-- Topo triggers

-- security definer attribute is required, because the user does not yet
-- have the rights to be able to insert into topo_contributors
create function internal.setup_topo_admin()
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

create trigger before_topo_created
    after insert on topos
    for each row execute function internal.setup_topo_admin();

-- Image registration

create trigger check_new_img
    after insert
    on topos
    for each row execute function internal.check_new_img();

create trigger img_changed
    after update of image
    on topos
    for each row
    when ( (old.image).id <> (new.image).id )
    execute function internal.img_changed();

create trigger unregister_img
    after delete
    on topos
    for each row execute function internal.unregister_img();





