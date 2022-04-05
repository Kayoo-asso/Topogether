-- 1. Utilities

-- Argument names have a `_` prefix to avoid ambiguity in PL/pgSQL
create function is_contributor(_topo_id uuid, _user_id uuid)
returns boolean
as $$
    select exists (
        select *
        from topo_contributors as t
        where
            t.topo_id = _topo_id and
            t.user_id = _user_id
    );
$$ language sql volatile;

create function is_topo_admin(_topo_id uuid, _user_id uuid)
returns boolean
as $$
    select exists (
        select 1
        from topo_contributors as t
        where
            t.topo_id = _topo_id and
            t.user_id = _user_id and
            t.role = 'ADMIN'
    );
$$ language sql volatile;

-- Note: all the following permissions do not include the fact that general admins can do anything
create function can_view_topo(_topo_id uuid)
returns boolean
as $$
    select ( t.status = 2 or is_contributor(_topo_id, auth.uid()) ) or is_admin(auth.uid())
    from
        public.topos t
    where
        t.id = _topo_id
$$ language sql volatile;

-- Only draft topos can be edited, only by contributors
create function can_edit_topo(_topo_id uuid)
returns boolean
as $$
    select ( t.status = 0 and is_contributor(_topo_id, auth.uid()) ) or is_admin(auth.uid())
    from
        public.topos t
    where
        t.id = _topo_id
$$ language sql volatile;

-- Only draft topos can be deleted, only by topo admins
create function can_delete_topo(_topo_id uuid)
returns boolean
as $$
    select ( t.status = 0 and is_topo_admin(_topo_id, auth.uid()) ) or is_admin(auth.uid())
    from
        public.topos t
    where t.id = _topo_id
$$ language sql volatile;


-- 2. Policies for `topo_contributors`
alter table topo_contributors enable row level security;

create policy "Topo contributors are visible by everyone"
    on topo_contributors for select
    using ( true );

-- TODO: may need more fine-grained policies, to avoid one topo admin downgrading / kicking out other topo admins
create policy "Only topo admins can manage contributors"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` case
    using ( 
        public.is_topo_admin(topo_id, auth.uid())
    );

create policy "Admins are omnipotent"
    on topo_contributors for all
    -- the `using` case will also be applied for the `with check` cases
    using ( public.is_admin(auth.uid()) );

-- 3. Policies for `topos`
alter table topos enable row level security;

create policy "Topo visibility"
    on topos for select
    using ( 
        -- have to explicitly write out the condition, to avoid a recursive call between the policy and the function
        status = 2 or is_contributor(id, auth.uid())
    );

create policy "Topos can be inserted by their creator."
    on topos for insert
    with check (
        -- null check prevents a non-authenticated user to insert topos
        "creatorId" is not null and 
        auth.uid() = "creatorId"
    );

create policy "Draft topos can be modified by contributors"
    on topos for update
    using ( 
        public.can_edit_topo(id)
    );

create policy "Topos can be deleted by their admin"
    on topos for delete
    using ( 
        public.can_delete_topo(id)
    );

-- Already integrated into the can_X functions
-- create policy "Admins are omnipotent"
--     on topos for all
--     -- the `using` case will also be applied for the `with check` cases
--     using ( 
--         public.is_admin(auth.uid())
--     );

-- 4. Control status updates
-- This is done in a trigger, to examine both the old and new row
create function check_status_change()
returns trigger
as $$
begin
    if (
        ((old.status = 0 and new.status = 1) or (old.status = 1 and new.status = 0)) and public.is_topo_admin(new.id,auth.uid()))
        or (public.is_admin(auth.uid())
    )
    then
        return new;
    else
        raise exception 'Invalid topo status update';
        return null;
    end if;
end;
$$ language plpgsql;

create trigger on_status_change
    before update on public.topos
    for each row
    when (old.status <> new.status)
    execute function public.check_status_change();