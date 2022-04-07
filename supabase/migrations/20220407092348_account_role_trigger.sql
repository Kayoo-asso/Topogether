-- The trigger needs to happen *after* a role change and not *before*, since it modifies another table
drop trigger if exists on_role_change on public.accounts;

create trigger on_role_change after update
    on public.accounts
    for each row
    when (old.role <> new.role)
    execute function internal.sync_role();