-- References:
-- x https://www.postgresql.org/docs/12/textsearch.html
-- x https://www.postgresql.org/docs/current/pgtrgm.html
-- x https://blog.crunchydata.com/blog/postgres-full-text-search-a-search-engine-in-a-database
-- x https://leandronsp.com/a-powerful-full-text-search-in-postgresql-in-less-than-20-lines
-- x http://rachbelaid.com/postgres-full-text-search-is-good-enough/

create index trgm_idx on public.topos
    using gin(name gin_trgm_ops);



-- create index topo_search_idx on public.topos
--  using gin(to_tsvector('topo_name', name));

create function search_light_topos(_query text, _nb integer, _similarity double precision)
returns setof public.light_topos
as $$
    select light_topo.*
    from
        (select t.*
        from 
            public.topos t,
            similarity(t.name, _query) similarity
        where similarity > _similarity
        order by similarity desc
        limit _nb
        ) select_topos,
        build_light_topo(select_topos.*) light_topo;

    -- select light_topo.*
    -- from (
    --     select build_light_topo(t.*)
    --     from 
    --         public.topos t,
    --         to_tsquery(_query) query,
    --         to_tsvector(t.name) document,
    --         coalesce(ts_rank(document, query), 0) rank,
    --         similarity(query, t.name) similary
    --     where query @@ document or similary > 0,
    --     order by rank, similarity desc nulls last
    -- ) topo,
    -- build_light_topo(topo) light_topo
$$ language sql volatile;
