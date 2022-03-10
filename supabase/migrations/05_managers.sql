-- MANAGERS

-- 0. Table
create table managers (
    id uuid primary key,
    name varchar(500) not null,
    "contactName" varchar(500) not null,
    "contactPhone" varchar(30),
    "contactMail" varchar(500),
    description varchar(5000),
    address varchar(5000),
    zip integer,
    city varchar(500),
    "topoId" uuid not null references public.topos(id) on delete cascade,
    "imagePath" text
);

-- 1. Policies
alter table managers enable row level security;

create policy "Managers are visible for everyone"
    on managers for select
    using ( true );

create policy "Managers can be modified by topo admins"
    on managers for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_topo_admin("topoId", auth.uid()) );

create policy "Admins are omnipotent"
    on managers for all
    -- the `using` case will also be applied for the `with check` cases
    using ( is_admin(auth.uid()) );

-- 2. Image registration
create trigger check_new_img
    after insert
    on managers
    for each row execute function internal.check_new_img();

create trigger img_changed
    after update of "imagePath"
    on managers
    for each row
    when (old."imagePath" <> new."imagePath")
    execute function internal.img_changed();

create trigger unregister_img
    after delete 
    on managers
    for each row execute function internal.unregister_img();
