-- Spatial data
create extension if not exists postgis with schema extensions;
-- Fuzzy text search
create extension if not exists pg_trgm;