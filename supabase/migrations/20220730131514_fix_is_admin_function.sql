create or replace function is_admin(_user_id uuid) returns boolean as $$
begin
    return exists (
        select 1
        from accounts
        where
            accounts.id = _user_id and
            accounts.role = 'ADMIN'
    );
end;
$$ language plpgsql;