-- Spatial data
create extension postgis with schema extensions;
-- Simple trigger to update a timestamp at each update of a table
create extension moddatetime with schema extensions;