-- Setup modification timestamping on topos and nested entities
create trigger handle_updated_at before update on topos 
  for each row execute procedure moddatetime (modified);

create function internal.topo_was_modified()
returns trigger
language plpgsql
as $$
begin
    update topos
    set modified = now()
    where topos.id = new."topoId";
    return null;
end;
$$;

create trigger handle_updated_at after insert or update on boulders
    for each row execute procedure internal.topo_was_modified();

create trigger handle_updated_at after insert or update on sectors
    for each row execute procedure internal.topo_was_modified();

create trigger handle_updated_at after insert or update on tracks
    for each row execute procedure internal.topo_was_modified();

create trigger handle_updated_at after insert or update on lines
    for each row execute procedure internal.topo_was_modified();

create trigger handle_updated_at after insert or update on waypoints
    for each row execute procedure internal.topo_was_modified();

create trigger handle_updated_at after insert or update on parkings
    for each row execute procedure internal.topo_was_modified();

create trigger handle_updated_at after insert or update on managers
    for each row execute procedure internal.topo_was_modified();

create trigger handle_updated_at after insert or update on topo_accesses
    for each row execute procedure internal.topo_was_modified();