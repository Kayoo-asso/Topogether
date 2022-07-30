drop view public.users cascade;
drop function internal.handle_user_update() cascade;

create function internal.check_user_update() returns trigger as $$
begin
	if old.role <> new.role then
		raise exception 'Role changes have to be done by a system administrator';
	end if;
	
	if old.email <> new.email then
		raise exception 'Email changes have to be done through the authentication system';
	end if;

	return new;
end;
$$ language plpgsql stable;

create trigger check_user_update before update on public.accounts
	for each row execute function internal.check_user_update();

create policy "Users can update their own account"
	on public.accounts for update
	using ( id = auth.uid() );

create policy "Users can see their own account"
	on public.accounts for select
	using ( id = auth.uid() );