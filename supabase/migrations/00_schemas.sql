create schema if not exists internal;

-- HORRIBLE HACK while Supabase does not provide a better way in their doc
-- Spatial data
create extension if not exists postgis with schema extensions;
-- Fuzzy text search
create extension if not exists pg_trgm;