-- Spatial data
create extension if not exists postgis with schema extensions;
-- Simple trigger to update a timestamp at each update of a table
create extension if not exists moddatetime;
-- Fuzzy text search
create extension if not exists pg_trgm;

-- create extension plpgsql_check with schema extensions;
create extension if not exists http with schema extensions;

-- Doesn't work on local, see:
-- https://github.com/supabase/cli/issues/158
-- create extension if not exists pg_cron;
