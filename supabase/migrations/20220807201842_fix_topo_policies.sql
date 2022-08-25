
create or replace function internal.timestamp_topo()
returns trigger
as $$
begin
    new.modified = now();

		if new.status <> old.status then
			if new.status = 0 then
				new.submitted = null;
				new.validated = null;
			elsif new.status = 1 then
				new.submitted = now();
				new.validated = null;
			elsif new.status = 2 then
			 	new.submitted = old.submitted;
				new.validated = now();
			end if;
		else
			new.submitted = old.submitted;
			new.validated = old.validated;
		end if;
    
    return new;
end;
$$ language plpgsql;


alter policy "Topo visibility"
    on topos 
    using ( 
        -- have to explicitly write out the condition, to avoid a recursive call between the policy and the function
        status = 2 or is_contributor(id, auth.uid()) or is_admin(auth.uid())
    );