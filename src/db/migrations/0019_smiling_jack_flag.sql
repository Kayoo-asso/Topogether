DROP INDEX IF EXISTS "topo_accesses_id_index";
DROP INDEX IF EXISTS "tracks_id_index";
CREATE INDEX IF NOT EXISTS "topo_accesses_topo_id_index" ON "topo_accesses" ("topo_id");
CREATE INDEX IF NOT EXISTS "tracks_topo_id_index" ON "tracks" ("topo_id");