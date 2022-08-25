-- Do everything in a transaction, to ensure we disable and reenable the trigger atomically
begin;

-- Disable the trigger that prevents changing the role
alter table public.accounts disable trigger check_user_update;

-- Make the user a global admin
update public.accounts
set role = 'ADMIN'
where "userName" = 'SuperAdmin';

-- Reenable it
alter table public.accounts enable trigger check_user_update;
commit;