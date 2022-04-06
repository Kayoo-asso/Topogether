-- TODO:
-- a) Timestamps on submit / validation
-- b) Allow manual status modifications in the DB
-- c) Allow topo admins to transition a topo from submitted -> draft, without modifying anything else

-- Draft topos can be edited by any contributor
-- Submitted topos can be edited by a topo admin
create or replace function can_edit_topo(_topo_id uuid)
returns boolean
as $$
    select 
        ( t.status = 0 and is_contributor(_topo_id, auth.uid()) ) or
        ( t.status = 1 and is_topo_admin(_topo_id, auth.uid()) ) or
        is_admin(auth.uid())
    from
        public.topos t
    where
        t.id = _topo_id
$$ language sql volatile;

-- Timestamps on submit / validation
create function internal.timestamp_topo()
returns trigger
as $$
begin
    new.modified = now();
    if new.status = 0 then
        new.submitted = null;
        new.validated = null;
    elsif old.status = 1 then
        new.submitted = coalesce(old.submitted, now());
        new.validated = null;
    else 
        new.submitted = coalesce(old.submitted, now());
        new.validated = coalesce(old.validated, now());
    end if;
    
    return new;
end;
$$ language plpgsql;


create or replace trigger handle_updated_at before update on topos 
  for each row execute procedure internal.timestamp_topo();

alter trigger handle_updated_at on topos rename to timestamp_topo;