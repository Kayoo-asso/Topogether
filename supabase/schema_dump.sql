--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA auth;


ALTER SCHEMA auth OWNER TO supabase_admin;

--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA extensions;


ALTER SCHEMA extensions OWNER TO postgres;

--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA public;


--
-- Name: EXTENSION pg_graphql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_graphql IS 'GraphQL support';


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA graphql_public;


ALTER SCHEMA graphql_public OWNER TO supabase_admin;

--
-- Name: internal; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA internal;


ALTER SCHEMA internal OWNER TO postgres;

--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: pgbouncer
--

CREATE SCHEMA pgbouncer;


ALTER SCHEMA pgbouncer OWNER TO pgbouncer;

--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA realtime;


ALTER SCHEMA realtime OWNER TO supabase_admin;

--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: supabase_admin
--

CREATE SCHEMA storage;


ALTER SCHEMA storage OWNER TO supabase_admin;

--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA supabase_migrations;


ALTER SCHEMA supabase_migrations OWNER TO postgres;

--
-- Name: moddatetime; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS moddatetime WITH SCHEMA extensions;


--
-- Name: EXTENSION moddatetime; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION moddatetime IS 'functions for tracking last modification time';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_stat_statements; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_stat_statements IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;


--
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgjwt WITH SCHEMA extensions;


--
-- Name: EXTENSION pgjwt; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgjwt IS 'JSON Web Token API for Postgresql';


--
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;


--
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry and geography spatial types and functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: contributor_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.contributor_role AS ENUM (
    'CONTRIBUTOR',
    'ADMIN'
);


ALTER TYPE public.contributor_role OWNER TO postgres;

--
-- Name: grade; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.grade AS ENUM (
    '3',
    '3+',
    '4',
    '4+',
    '5a',
    '5a+',
    '5b',
    '5b+',
    '5c',
    '5c+',
    '6a',
    '6a+',
    '6b',
    '6b+',
    '6c',
    '6c+',
    '7a',
    '7a+',
    '7b',
    '7b+',
    '7c',
    '7c+',
    '8a',
    '8a+',
    '8b',
    '8b+',
    '8c',
    '8c+',
    '9a',
    '9a+',
    '9b',
    '9b+',
    '9c',
    '9c+'
);


ALTER TYPE public.grade OWNER TO postgres;

--
-- Name: grade_category; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.grade_category AS ENUM (
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'None'
);


ALTER TYPE public.grade_category OWNER TO postgres;

--
-- Name: img; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.img AS (
	id uuid,
	ratio double precision
);


ALTER TYPE public.img OWNER TO postgres;

--
-- Name: role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public.role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    id uuid NOT NULL,
    "userName" text NOT NULL,
    email character varying(1000) NOT NULL,
    role public.role DEFAULT 'USER'::public.role NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    "firstName" character varying(500),
    "lastName" character varying(500),
    country character varying(500),
    city character varying(500),
    phone character varying(30),
    "birthDate" date,
    image public.img
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: profiles; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.profiles AS
 SELECT accounts.id,
    accounts."userName",
    accounts.role,
    accounts.created,
    accounts.image,
    accounts."firstName",
    accounts."lastName",
    accounts.country,
    accounts.city
   FROM public.accounts;


ALTER TABLE public.profiles OWNER TO postgres;

--
-- Name: light_topo; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.light_topo AS (
	id uuid,
	name character varying(500),
	status smallint,
	liked boolean,
	location jsonb,
	forbidden boolean,
	modified timestamp with time zone,
	submitted timestamp with time zone,
	validated timestamp with time zone,
	amenities integer,
	"rockTypes" integer,
	type smallint,
	description character varying(5000),
	altitude integer,
	"closestCity" character varying(500),
	image public.img,
	creator public.profiles,
	"parkingLocation" jsonb,
	"nbSectors" integer,
	"nbBoulders" integer,
	"nbTracks" integer,
	grades jsonb
);


ALTER TYPE public.light_topo OWNER TO postgres;

--
-- Name: topo_access_step; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.topo_access_step AS (
	description character varying(5000),
	image public.img
);


ALTER TYPE public.topo_access_step OWNER TO postgres;

--
-- Name: action; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.action AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


ALTER TYPE realtime.action OWNER TO supabase_admin;

--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.equality_op AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte'
);


ALTER TYPE realtime.equality_op OWNER TO supabase_admin;

--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.user_defined_filter AS (
	column_name text,
	op realtime.equality_op,
	value text
);


ALTER TYPE realtime.user_defined_filter OWNER TO supabase_admin;

--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_column AS (
	name text,
	type text,
	value jsonb,
	is_pkey boolean,
	is_selectable boolean
);


ALTER TYPE realtime.wal_column OWNER TO supabase_admin;

--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: supabase_admin
--

CREATE TYPE realtime.wal_rls AS (
	wal jsonb,
	is_rls_enabled boolean,
	subscription_ids uuid[],
	errors text[]
);


ALTER TYPE realtime.wal_rls OWNER TO supabase_admin;

--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.email', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
	)::text
$$;


ALTER FUNCTION auth.email() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


ALTER FUNCTION auth.jwt() OWNER TO supabase_auth_admin;

--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.role', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
	)::text
$$;


ALTER FUNCTION auth.role() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: supabase_auth_admin
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  	coalesce(
		nullif(current_setting('request.jwt.claim.sub', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
	)::uuid
$$;


ALTER FUNCTION auth.uid() OWNER TO supabase_auth_admin;

--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_cron_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  schema_is_cron bool;
BEGIN
  schema_is_cron = (
    SELECT n.nspname = 'cron'
    FROM pg_event_trigger_ddl_commands() AS ev
    LEFT JOIN pg_catalog.pg_namespace AS n
      ON ev.objid = n.oid
  );

  IF schema_is_cron
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option; 

  END IF;

END;
$$;


ALTER FUNCTION extensions.grant_pg_cron_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_cron_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_cron_access() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.grant_pg_graphql_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant all on function graphql.resolve to postgres, anon, authenticated, service_role;

        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            -- This changed
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        grant select on graphql.field, graphql.type, graphql.enum_value to postgres, anon, authenticated, service_role;
        grant execute on function graphql.resolve to postgres, anon, authenticated, service_role;
    END IF;

END;
$_$;


ALTER FUNCTION extensions.grant_pg_graphql_access() OWNER TO supabase_admin;

--
-- Name: FUNCTION grant_pg_graphql_access(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.grant_pg_graphql_access() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: postgres
--

CREATE FUNCTION extensions.grant_pg_net_access() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
    ALTER function net.http_collect_response(request_id bigint, async boolean) SECURITY DEFINER;

    ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
    ALTER function net.http_collect_response(request_id bigint, async boolean) SET search_path = net;

    REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
    REVOKE ALL ON FUNCTION net.http_collect_response(request_id bigint, async boolean) FROM PUBLIC;

    GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    GRANT EXECUTE ON FUNCTION net.http_collect_response(request_id bigint, async boolean) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
  END IF;
END;
$$;


ALTER FUNCTION extensions.grant_pg_net_access() OWNER TO postgres;

--
-- Name: FUNCTION grant_pg_net_access(); Type: COMMENT; Schema: extensions; Owner: postgres
--

COMMENT ON FUNCTION extensions.grant_pg_net_access() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_ddl_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_ddl_watch() OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.pgrst_drop_watch() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


ALTER FUNCTION extensions.pgrst_drop_watch() OWNER TO supabase_admin;

--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: supabase_admin
--

CREATE FUNCTION extensions.set_graphql_placeholder() RETURNS event_trigger
    LANGUAGE plpgsql
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


ALTER FUNCTION extensions.set_graphql_placeholder() OWNER TO supabase_admin;

--
-- Name: FUNCTION set_graphql_placeholder(); Type: COMMENT; Schema: extensions; Owner: supabase_admin
--

COMMENT ON FUNCTION extensions.set_graphql_placeholder() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: check_new_img(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.check_new_img() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    if new.image is not null then
        perform internal.use_img(new.image);
    end if;
    return null;
end;
$$;


ALTER FUNCTION internal.check_new_img() OWNER TO postgres;

--
-- Name: do_nothing(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.do_nothing() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    return null;
end;
$$;


ALTER FUNCTION internal.do_nothing() OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'internal', 'auth', 'extensions', 'pg_temp'
    AS $$
begin
    insert into public.accounts(id, "userName", email)
    values (new.id, (new.raw_user_meta_data::jsonb->>'userName')::varchar(500), new.email);

    update auth.users set
        raw_user_meta_data = raw_user_meta_data-'userName' || '{"role": "USER" }'::jsonb
    where id = new.id;

    return null;
end;
$$;


ALTER FUNCTION internal.handle_new_user() OWNER TO postgres;

--
-- Name: handle_user_update(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.handle_user_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'internal'
    AS $$
begin
    if old.role <> new.role then
        raise exception 'Role changes have to be done by a system administrator';
    end if;
    
    if old.email <> new.email then
        raise exception 'Email changes have to be done through the authentication system';
    end if;

    update public.accounts set 
        "userName" = new."userName",
        "firstName" = new."firstName",
        "lastName" = new."lastName",
        country = new.country,
        city = new.city,
        phone = new.phone,
        "birthDate" = new."birthDate",
        image = new.image
    where id = new.id;

    return new;
end;
$$;


ALTER FUNCTION internal.handle_user_update() OWNER TO postgres;

--
-- Name: img_changed(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.img_changed() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin

    if old.image is not null then
        perform internal.stop_using_img(old.image);
    end if;
    if new.image is not null then
        perform internal.use_img(new.image);
    end if;
    return null;
end;
$$;


ALTER FUNCTION internal.img_changed() OWNER TO postgres;

--
-- Name: insert_timestamps(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.insert_timestamps() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.created = now();
    new.modified = now();
    return new;
end;
$$;


ALTER FUNCTION internal.insert_timestamps() OWNER TO postgres;

--
-- Name: modified(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.modified() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.modified = now();
    return new;
end;
$$;


ALTER FUNCTION internal.modified() OWNER TO postgres;

--
-- Name: on_access_delete(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.on_access_delete() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    update public.images
    set users = users - 1
    where id in (
        select (step.image).id
        from unnest(old.steps) as step
    );
    return null;
end;
$$;


ALTER FUNCTION internal.on_access_delete() OWNER TO postgres;

--
-- Name: on_access_insert(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.on_access_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    insert into public.images
        select (step.image).id as id, 1 as users 
        from unnest(new.steps) as step
        where (step.image).id is not null
    on conflict (id)
    do update set
        users = images.users + 1;
    return null;
end;
$$;


ALTER FUNCTION internal.on_access_insert() OWNER TO postgres;

--
-- Name: on_access_update(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.on_access_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    -- with before as (
    --     select "imagePath"
    --     from unnest(old.steps)
    -- ), after as (
    --     select "imagePath"
    --     from unnest(new.steps)
    -- ), 
    -- -- Hackery to execute two sql statements that use `before` and `after` tables
    -- terrible_hack as (
    --     update public.images
    --     set users = users - 1
    --     where path in ( before ) and path not in ( after)
    -- )
    -- update public.images
    -- set users = users + 1
    -- where path in ( after ) and path not in ( before );
    -- update public.images
    -- set users = users - 1
    -- where path in (before except after)

    -- Basically insert + delete
    insert into public.images
        select (step.image).id as id, 1 as users 
        from unnest(new.steps) as step
        where (step.image).id is not null
    on conflict (id)
    do update set
        users = images.users + 1;

    update public.images
    set users = users - 1
    where id in (
        select (step.image).id
        from unnest(old.steps) as step
    );

    return null;
end;
$$;


ALTER FUNCTION internal.on_access_update() OWNER TO postgres;

--
-- Name: on_boulder_delete(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.on_boulder_delete() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    update public.images
    set users = users - 1
    where id in (
        select id
        from unnest(old.images)
    );
    return null;
end;
$$;


ALTER FUNCTION internal.on_boulder_delete() OWNER TO postgres;

--
-- Name: on_boulder_insert(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.on_boulder_insert() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    insert into public.images
        select img.id as id, 1 as users 
        from unnest(new.images) as img
        where img.id is not null
    on conflict (id)
    do update set
        users = images.users + 1;
    return null;
end;
$$;


ALTER FUNCTION internal.on_boulder_insert() OWNER TO postgres;

--
-- Name: on_boulder_update(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.on_boulder_update() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    -- with before as (
    --     select "imagePath"
    --     from unnest(old.images)
    -- ), after as (
    --     select "imagePath"
    --     from unnest(new.images)
    -- ), 
    -- -- Hackery to execute two sql statements that use `before` and `after` tables
    -- terrible_hack as (
    --     update public.images
    --     set users = users - 1
    --     where path in ( before ) and path not in ( after)
    -- )
    -- update public.images
    -- set users = users + 1
    -- where path in ( after ) and path not in ( before );

    insert into public.images
        select img.id as id, 1 as users 
        from unnest(new.images) as img
        where img.id is not null
    on conflict (id)
    do update set
        users = images.users + 1;

    update public.images
    set users = users - 1
    where id in (
        select id
        from unnest(old.images)
    );

    return null;
end;
$$;


ALTER FUNCTION internal.on_boulder_update() OWNER TO postgres;

--
-- Name: setup_topo_admin(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.setup_topo_admin() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
    insert into topo_contributors (topo_id, user_id, role)
    values (new.id, new."creatorId", 'ADMIN');
    return new;
end;
$$;


ALTER FUNCTION internal.setup_topo_admin() OWNER TO postgres;

--
-- Name: stop_using_img(public.img); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.stop_using_img(_image public.img) RETURNS void
    LANGUAGE sql
    AS $$
    update public.images 
    set users = users - 1
    where id = _image.id
$$;


ALTER FUNCTION internal.stop_using_img(_image public.img) OWNER TO postgres;

--
-- Name: sync_email(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.sync_email() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    update public.accounts
    set email = new.email
    where id = new.id;
    return null;
end;
$$;


ALTER FUNCTION internal.sync_email() OWNER TO postgres;

--
-- Name: sync_role(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.sync_role() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'internal', 'jsonb', 'auth', 'pg_temp'
    AS $$
begin
    update auth.users set
        raw_user_meta_data = jsonb_set(raw_user_meta_data, '{role}', to_jsonb(new.role))
    where id = new.id;
    return null;
end;
$$;


ALTER FUNCTION internal.sync_role() OWNER TO postgres;

--
-- Name: timestamp_topo(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.timestamp_topo() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.modified = now();
    if new.status = 0 then
        new.submitted = null;
        new.validated = null;
    elsif old.status = 1 then
        new.submitted = coalesce(old.submitted, now());
        new.validated = null;
    else 
        new.submitted = coalesce(old.submitted, now());
        new.validated = coalesce(old.validated, now());
    end if;
    
    return new;
end;
$$;


ALTER FUNCTION internal.timestamp_topo() OWNER TO postgres;

--
-- Name: topo_was_modified(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.topo_was_modified() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    update topos
    set modified = now()
    where topos.id = new."topoId";
    return null;
end;
$$;


ALTER FUNCTION internal.topo_was_modified() OWNER TO postgres;

--
-- Name: unregister_img(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.unregister_img() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
    if old.image is not null then
        perform internal.stop_using_img(old.image);
    end if;
    return null;
end;
$$;


ALTER FUNCTION internal.unregister_img() OWNER TO postgres;

--
-- Name: update_timestamps(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.update_timestamps() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.created = old.created;
    new.modified = now();
    return new;
end;
$$;


ALTER FUNCTION internal.update_timestamps() OWNER TO postgres;

--
-- Name: use_img(public.img); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.use_img(_image public.img) RETURNS void
    LANGUAGE sql
    AS $$
    insert into public.images (id, users)
    values 
        (_image.id, 1)
    on conflict (id)
    do update set
        users = images.users + 1;
    -- update public.images
    -- set users = users + 1
    -- where id = _image.id;
$$;


ALTER FUNCTION internal.use_img(_image public.img) OWNER TO postgres;

--
-- Name: get_auth(text); Type: FUNCTION; Schema: pgbouncer; Owner: postgres
--

CREATE FUNCTION pgbouncer.get_auth(p_usename text) RETURNS TABLE(username text, password text)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    RAISE WARNING 'PgBouncer auth request: %', p_usename;

    RETURN QUERY
    SELECT usename::TEXT, passwd::TEXT FROM pg_catalog.pg_shadow
    WHERE usename = p_usename;
END;
$$;


ALTER FUNCTION pgbouncer.get_auth(p_usename text) OWNER TO postgres;

--
-- Name: topos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topos (
    id uuid NOT NULL,
    name character varying(500) NOT NULL,
    status smallint NOT NULL,
    location extensions.geometry(Point) NOT NULL,
    forbidden boolean NOT NULL,
    modified timestamp with time zone DEFAULT now() NOT NULL,
    submitted timestamp with time zone,
    validated timestamp with time zone,
    amenities integer DEFAULT 0 NOT NULL,
    "rockTypes" integer DEFAULT 0 NOT NULL,
    type smallint,
    description character varying(5000),
    "faunaProtection" character varying(5000),
    ethics character varying(5000),
    danger character varying(5000),
    cleaned date,
    altitude integer,
    "closestCity" character varying(500),
    "otherAmenities" character varying(5000),
    "lonelyBoulders" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
    image public.img,
    "creatorId" uuid,
    "validatorId" uuid
);


ALTER TABLE public.topos OWNER TO postgres;

--
-- Name: build_light_topo(public.topos); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.build_light_topo(_topo public.topos) RETURNS public.light_topo
    LANGUAGE plpgsql
    AS $$
declare
    "nbSectors" int4;
    "nbBoulders" int4;
    "nbTracks" int4;
    "parkingLocation" jsonb;
    creator public.profiles;
    grades jsonb;
    result public.light_topo;
begin
    select count(*)
    into "nbSectors"
    from public.sectors
    where "topoId" = _topo.id;

    select count(*)
    into "nbBoulders"
    from public.boulders
    where "topoId" = _topo.id;

    select count(*)
    into "nbTracks"
    from public.tracks
    where "topoId" = _topo.id;

    select location::jsonb->'coordinates'
    into "parkingLocation"
    from public.parkings
    where "topoId" = _topo.id
    limit 1;

    select jsonb_object_agg(grade, count)
    into grades
    from (
        select grade_to_category(t.grade) as grade, count(*) as count
        from public.tracks as t
        where t."topoId" = _topo.id
        group by grade_to_category(t.grade)
    ) as x;

    select *
    into creator
    from public.profiles
    where id = _topo."creatorId";

    select 
        _topo.id, _topo.name, _topo.status,
        likes_topo(_topo.id) as liked,
        _topo.location::jsonb->'coordinates' as location,
        _topo.forbidden,
        _topo.modified, _topo.submitted, _topo.validated,
        _topo.amenities, _topo."rockTypes",
        _topo.type, _topo.description, _topo.altitude, _topo."closestCity",

        _topo.image,
        creator,

        "parkingLocation",
        "nbSectors",
        "nbBoulders",
        "nbTracks",
        grades
    into result;

    return result;
end;
$$;


ALTER FUNCTION public.build_light_topo(_topo public.topos) OWNER TO postgres;

--
-- Name: can_delete_topo(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_delete_topo(_topo_id uuid) RETURNS boolean
    LANGUAGE sql
    AS $$
    select ( t.status = 0 and is_topo_admin(_topo_id, auth.uid()) ) or is_admin(auth.uid())
    from
        public.topos t
    where t.id = _topo_id
$$;


ALTER FUNCTION public.can_delete_topo(_topo_id uuid) OWNER TO postgres;

--
-- Name: can_edit_topo(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_edit_topo(_topo_id uuid) RETURNS boolean
    LANGUAGE sql
    AS $$
    select 
        ( t.status = 0 and is_contributor(_topo_id, auth.uid()) ) or
        ( t.status = 1 and is_topo_admin(_topo_id, auth.uid()) ) or
        is_admin(auth.uid())
    from
        public.topos t
    where
        t.id = _topo_id
$$;


ALTER FUNCTION public.can_edit_topo(_topo_id uuid) OWNER TO postgres;

--
-- Name: can_view_topo(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.can_view_topo(_topo_id uuid) RETURNS boolean
    LANGUAGE sql
    AS $$
    select ( t.status = 2 or is_contributor(_topo_id, auth.uid()) ) or is_admin(auth.uid())
    from
        public.topos t
    where
        t.id = _topo_id
$$;


ALTER FUNCTION public.can_view_topo(_topo_id uuid) OWNER TO postgres;

--
-- Name: check_status_change(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.check_status_change() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if (
        ((old.status = 0 and new.status = 1) or (old.status = 1 and new.status = 0)) and public.is_topo_admin(new.id,auth.uid()))
        or (public.is_admin(auth.uid())
    )
    then
        return new;
    else
        raise exception 'Invalid topo status update';
        return null;
    end if;
end;
$$;


ALTER FUNCTION public.check_status_change() OWNER TO postgres;

--
-- Name: grade_to_category(public.grade); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.grade_to_category(grade public.grade) RETURNS public.grade_category
    LANGUAGE plpgsql
    AS $$
begin
    if grade is null then
        return 'None';
    else
        return left(grade::text, 1);
    end if;
end;
$$;


ALTER FUNCTION public.grade_to_category(grade public.grade) OWNER TO postgres;

--
-- Name: is_admin(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_admin(_user_id uuid) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
begin
    return exists (
        select 1
        from users
        where
            users.id = _user_id and
            users.role = 'ADMIN'
    );
end;
$$;


ALTER FUNCTION public.is_admin(_user_id uuid) OWNER TO postgres;

--
-- Name: is_contributor(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_contributor(_topo_id uuid, _user_id uuid) RETURNS boolean
    LANGUAGE sql
    AS $$
    select exists (
        select *
        from topo_contributors as t
        where
            t.topo_id = _topo_id and
            t.user_id = _user_id
    );
$$;


ALTER FUNCTION public.is_contributor(_topo_id uuid, _user_id uuid) OWNER TO postgres;

--
-- Name: is_topo_admin(uuid, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.is_topo_admin(_topo_id uuid, _user_id uuid) RETURNS boolean
    LANGUAGE sql
    AS $$
    select exists (
        select 1
        from topo_contributors as t
        where
            t.topo_id = _topo_id and
            t.user_id = _user_id and
            t.role = 'ADMIN'
    );
$$;


ALTER FUNCTION public.is_topo_admin(_topo_id uuid, _user_id uuid) OWNER TO postgres;

--
-- Name: like_boulders(uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.like_boulders(_ids uuid[]) RETURNS void
    LANGUAGE sql SECURITY DEFINER
    AS $$
    insert into public.boulder_likes
    select id, auth.uid()
    from unnest(_ids) as id
    on conflict do nothing
$$;


ALTER FUNCTION public.like_boulders(_ids uuid[]) OWNER TO postgres;

--
-- Name: like_topos(uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.like_topos(_ids uuid[]) RETURNS void
    LANGUAGE sql SECURITY DEFINER
    AS $$
    insert into public.topo_likes
    select id, auth.uid()
    from unnest(_ids) as id
    on conflict do nothing
$$;


ALTER FUNCTION public.like_topos(_ids uuid[]) OWNER TO postgres;

--
-- Name: liked_topos_of_user(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.liked_topos_of_user(_user_id uuid) RETURNS SETOF public.light_topo
    LANGUAGE sql STABLE
    AS $$
    select t.*
    from public.topo_likes likes
    join public.light_topos t
    on likes."topoId" = t.id
    where likes."userId" = _user_id;
$$;


ALTER FUNCTION public.liked_topos_of_user(_user_id uuid) OWNER TO postgres;

--
-- Name: likes_boulder(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.likes_boulder(_boulder_id uuid) RETURNS boolean
    LANGUAGE sql
    AS $$
    select exists(
        select 1 from public.boulder_likes
        where "boulderId" = _boulder_id
        and "userId" = auth.uid()
    )
$$;


ALTER FUNCTION public.likes_boulder(_boulder_id uuid) OWNER TO postgres;

--
-- Name: likes_topo(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.likes_topo(_topo_id uuid) RETURNS boolean
    LANGUAGE sql
    AS $$
    select exists(
        select 1 from public.topo_likes
        where "topoId" = _topo_id
        and "userId" = auth.uid()
    )
$$;


ALTER FUNCTION public.likes_topo(_topo_id uuid) OWNER TO postgres;

--
-- Name: light_topos; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.light_topos AS
 SELECT light_topo.id,
    light_topo.name,
    light_topo.status,
    light_topo.liked,
    light_topo.location,
    light_topo.forbidden,
    light_topo.modified,
    light_topo.submitted,
    light_topo.validated,
    light_topo.amenities,
    light_topo."rockTypes",
    light_topo.type,
    light_topo.description,
    light_topo.altitude,
    light_topo."closestCity",
    light_topo.image,
    light_topo.creator,
    light_topo."parkingLocation",
    light_topo."nbSectors",
    light_topo."nbBoulders",
    light_topo."nbTracks",
    light_topo.grades
   FROM public.topos t,
    LATERAL public.build_light_topo(t.*) light_topo(id, name, status, liked, location, forbidden, modified, submitted, validated, amenities, "rockTypes", type, description, altitude, "closestCity", image, creator, "parkingLocation", "nbSectors", "nbBoulders", "nbTracks", grades);


ALTER TABLE public.light_topos OWNER TO postgres;

--
-- Name: search_light_topos(text, integer, double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.search_light_topos(_query text, _nb integer, _similarity double precision) RETURNS SETOF public.light_topos
    LANGUAGE sql
    AS $$
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
$$;


ALTER FUNCTION public.search_light_topos(_query text, _nb integer, _similarity double precision) OWNER TO postgres;

--
-- Name: unlike_boulders(uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unlike_boulders(_ids uuid[]) RETURNS void
    LANGUAGE sql SECURITY DEFINER
    AS $$
    delete from public.boulder_likes
    where "boulderId" in ( select unnest(_ids) )
    and "userId" = auth.uid()
$$;


ALTER FUNCTION public.unlike_boulders(_ids uuid[]) OWNER TO postgres;

--
-- Name: unlike_topos(uuid[]); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.unlike_topos(_ids uuid[]) RETURNS void
    LANGUAGE sql SECURITY DEFINER
    AS $$
    delete from public.topo_likes
    where "topoId" in ( select unnest(_ids) )
    and "userId" = auth.uid()
$$;


ALTER FUNCTION public.unlike_topos(_ids uuid[]) OWNER TO postgres;

--
-- Name: apply_rls(jsonb, integer); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer DEFAULT (1024 * 1024)) RETURNS SETOF realtime.wal_rls
    LANGUAGE plpgsql
    AS $$
      declare
        -- Regclass of the table e.g. public.notes
        entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

        -- I, U, D, T: insert, update ...
        action realtime.action = (
          case wal ->> 'action'
            when 'I' then 'INSERT'
            when 'U' then 'UPDATE'
            when 'D' then 'DELETE'
            else 'ERROR'
          end
        );

        -- Is row level security enabled for the table
        is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

        subscriptions realtime.subscription[] = array_agg(subs)
          from
            realtime.subscription subs
          where
            subs.entity = entity_;

        -- Subscription vars
        roles regrole[] = array_agg(distinct us.claims_role)
          from
            unnest(subscriptions) us;

        working_role regrole;
        claimed_role regrole;
        claims jsonb;

        subscription_id uuid;
        subscription_has_access bool;
        visible_to_subscription_ids uuid[] = '{}';

        -- structured info for wal's columns
        columns realtime.wal_column[];
        -- previous identity values for update/delete
        old_columns realtime.wal_column[];

        error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

        -- Primary jsonb output for record
        output jsonb;

      begin
        perform set_config('role', null, true);

        columns =
          array_agg(
            (
              x->>'name',
              x->>'type',
              realtime.cast((x->'value') #>> '{}', (x->>'type')::regtype),
              (pks ->> 'name') is not null,
              true
            )::realtime.wal_column
          )
          from
            jsonb_array_elements(wal -> 'columns') x
            left join jsonb_array_elements(wal -> 'pk') pks
              on (x ->> 'name') = (pks ->> 'name');

        old_columns =
          array_agg(
            (
              x->>'name',
              x->>'type',
              realtime.cast((x->'value') #>> '{}', (x->>'type')::regtype),
              (pks ->> 'name') is not null,
              true
            )::realtime.wal_column
          )
          from
            jsonb_array_elements(wal -> 'identity') x
            left join jsonb_array_elements(wal -> 'pk') pks
              on (x ->> 'name') = (pks ->> 'name');

        for working_role in select * from unnest(roles) loop

          -- Update `is_selectable` for columns and old_columns
          columns =
            array_agg(
              (
                c.name,
                c.type,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
              )::realtime.wal_column
            )
            from
              unnest(columns) c;

          old_columns =
            array_agg(
              (
                c.name,
                c.type,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
              )::realtime.wal_column
            )
            from
              unnest(old_columns) c;

          if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
            return next (
              null,
              is_rls_enabled,
              -- subscriptions is already filtered by entity
              (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
              array['Error 400: Bad Request, no primary key']
            )::realtime.wal_rls;

          -- The claims role does not have SELECT permission to the primary key of entity
          elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
            return next (
              null,
              is_rls_enabled,
              (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
              array['Error 401: Unauthorized']
            )::realtime.wal_rls;

          else
            output = jsonb_build_object(
              'schema', wal ->> 'schema',
              'table', wal ->> 'table',
              'type', action,
              'commit_timestamp', to_char(
                (wal ->> 'timestamp')::timestamptz,
                'YYYY-MM-DD"T"HH24:MI:SS"Z"'
              ),
              'columns', (
                select
                  jsonb_agg(
                    jsonb_build_object(
                      'name', pa.attname,
                      'type', pt.typname
                    )
                    order by pa.attnum asc
                  )
                    from
                      pg_attribute pa
                      join pg_type pt
                        on pa.atttypid = pt.oid
                    where
                      attrelid = entity_
                      and attnum > 0
                      and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
              )
            )
            -- Add "record" key for insert and update
            || case
                when error_record_exceeds_max_size then jsonb_build_object('record', '{}'::jsonb)
                when action in ('INSERT', 'UPDATE') then
                  jsonb_build_object(
                    'record',
                    (select jsonb_object_agg((c).name, (c).value) from unnest(columns) c where (c).is_selectable)
                  )
                else '{}'::jsonb
            end
            -- Add "old_record" key for update and delete
            || case
                when error_record_exceeds_max_size then jsonb_build_object('old_record', '{}'::jsonb)
                when action in ('UPDATE', 'DELETE') then
                  jsonb_build_object(
                    'old_record',
                    (select jsonb_object_agg((c).name, (c).value) from unnest(old_columns) c where (c).is_selectable)
                  )
                else '{}'::jsonb
            end;

            -- Create the prepared statement
            if is_rls_enabled and action <> 'DELETE' then
              if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
              end if;
              execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
            end if;

            visible_to_subscription_ids = '{}';

            for subscription_id, claims in (
                select
                  subs.subscription_id,
                  subs.claims
                from
                  unnest(subscriptions) subs
                where
                  subs.entity = entity_
                  and subs.claims_role = working_role
                  and realtime.is_visible_through_filters(columns, subs.filters)
              ) loop

              if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
              else
                -- Check if RLS allows the role to see the record
                perform
                  set_config('role', working_role::text, true),
                  set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                  visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
              end if;
            end loop;

            perform set_config('role', null, true);

            return next (
              output,
              is_rls_enabled,
              visible_to_subscription_ids,
              case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
              end
            )::realtime.wal_rls;

          end if;
        end loop;

        perform set_config('role', null, true);
      end;
      $$;


ALTER FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) OWNER TO supabase_admin;

--
-- Name: build_prepared_statement_sql(text, regclass, realtime.wal_column[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) RETURNS text
    LANGUAGE sql
    AS $$
    /*
    Builds a sql string that, if executed, creates a prepared statement to
    tests retrive a row from *entity* by its primary key columns.

    Example
      select realtime.build_prepared_statment_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
    */
      select
    'prepare ' || prepared_statement_name || ' as
      select
        exists(
          select
            1
          from
            ' || entity || '
          where
            ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
        )'
      from
        unnest(columns) pkc
      where
        pkc.is_pkey
      group by
        entity
    $$;


ALTER FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) OWNER TO supabase_admin;

--
-- Name: cast(text, regtype); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime."cast"(val text, type_ regtype) RETURNS jsonb
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


ALTER FUNCTION realtime."cast"(val text, type_ regtype) OWNER TO supabase_admin;

--
-- Name: check_equality_op(realtime.equality_op, regtype, text, text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $$
    /*
    Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
    */
    declare
      op_symbol text = (
        case
          when op = 'eq' then '='
          when op = 'neq' then '!='
          when op = 'lt' then '<'
          when op = 'lte' then '<='
          when op = 'gt' then '>'
          when op = 'gte' then '>='
          else 'UNKNOWN OP'
        end
      );
      res boolean;
    begin
      execute format('select %L::'|| type_::text || ' ' || op_symbol || ' %L::'|| type_::text, val_1, val_2) into res;
      return res;
    end;
    $$;


ALTER FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) OWNER TO supabase_admin;

--
-- Name: is_visible_through_filters(realtime.wal_column[], realtime.user_defined_filter[]); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) RETURNS boolean
    LANGUAGE sql IMMUTABLE
    AS $$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
    select
      -- Default to allowed when no filters present
      coalesce(
        sum(
          realtime.check_equality_op(
            op:=f.op,
            type_:=col.type::regtype,
            -- cast jsonb to text
            val_1:=col.value #>> '{}',
            val_2:=f.value
          )::int
        ) = count(1),
        true
      )
    from
      unnest(filters) f
      join unnest(columns) col
          on f.column_name = col.name;
    $$;


ALTER FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) OWNER TO supabase_admin;

--
-- Name: quote_wal2json(regclass); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.quote_wal2json(entity regclass) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


ALTER FUNCTION realtime.quote_wal2json(entity regclass) OWNER TO supabase_admin;

--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.subscription_check_filters() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
      col_names text[] = coalesce(
        array_agg(c.column_name order by c.ordinal_position),
        '{}'::text[]
      )
      from
        information_schema.columns c
      where
        format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
        and pg_catalog.has_column_privilege(
          (new.claims ->> 'role'),
          format('%I.%I', c.table_schema, c.table_name)::regclass,
          c.column_name,
          'SELECT'
        );
      filter realtime.user_defined_filter;
      col_type regtype;
    begin
      for filter in select * from unnest(new.filters) loop
        -- Filtered column is valid
        if not filter.column_name = any(col_names) then
          raise exception 'invalid column for filter %', filter.column_name;
        end if;

        -- Type is sanitized and safe for string interpolation
        col_type = (
          select atttypid::regtype
          from pg_catalog.pg_attribute
          where attrelid = new.entity
            and attname = filter.column_name
        );
        if col_type is null then
          raise exception 'failed to lookup type for column %', filter.column_name;
        end if;
        -- raises an exception if value is not coercable to type
        perform realtime.cast(filter.value, col_type);
      end loop;

      -- Apply consistent order to filters so the unique constraint on
      -- (subscription_id, entity, filters) can't be tricked by a different filter order
      new.filters = coalesce(
        array_agg(f order by f.column_name, f.op, f.value),
        '{}'
      ) from unnest(new.filters) f;

    return new;
  end;
  $$;


ALTER FUNCTION realtime.subscription_check_filters() OWNER TO supabase_admin;

--
-- Name: to_regrole(text); Type: FUNCTION; Schema: realtime; Owner: supabase_admin
--

CREATE FUNCTION realtime.to_regrole(role_name text) RETURNS regrole
    LANGUAGE sql IMMUTABLE
    AS $$ select role_name::regrole $$;


ALTER FUNCTION realtime.to_regrole(role_name text) OWNER TO supabase_admin;

--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return split_part(_filename, '.', 2);
END
$$;


ALTER FUNCTION storage.extension(name text) OWNER TO supabase_storage_admin;

--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


ALTER FUNCTION storage.filename(name text) OWNER TO supabase_storage_admin;

--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


ALTER FUNCTION storage.foldername(name text) OWNER TO supabase_storage_admin;

--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


ALTER FUNCTION storage.get_size_by_bucket() OWNER TO supabase_storage_admin;

--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(regexp_split_to_array(objects.name, ''/''), 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(regexp_split_to_array(objects.name, ''/''), 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


ALTER FUNCTION storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) OWNER TO supabase_storage_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone
);


ALTER TABLE auth.audit_log_entries OWNER TO supabase_auth_admin;

--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.identities (
    id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.identities OWNER TO supabase_auth_admin;

--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE auth.instances OWNER TO supabase_auth_admin;

--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255)
);


ALTER TABLE auth.refresh_tokens OWNER TO supabase_auth_admin;

--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: supabase_auth_admin
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE auth.refresh_tokens_id_seq OWNER TO supabase_auth_admin;

--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: supabase_auth_admin
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


ALTER TABLE auth.schema_migrations OWNER TO supabase_auth_admin;

--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone character varying(15) DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change character varying(15) DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


ALTER TABLE auth.users OWNER TO supabase_auth_admin;

--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: supabase_auth_admin
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: boulder_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boulder_likes (
    "boulderId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.boulder_likes OWNER TO postgres;

--
-- Name: boulders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boulders (
    id uuid NOT NULL,
    location extensions.geometry(Point) NOT NULL,
    name character varying(500) NOT NULL,
    "isHighball" boolean DEFAULT false NOT NULL,
    "mustSee" boolean DEFAULT false NOT NULL,
    "dangerousDescent" boolean DEFAULT false NOT NULL,
    images public.img[] DEFAULT '{}'::public.img[] NOT NULL,
    "topoId" uuid NOT NULL
);


ALTER TABLE public.boulders OWNER TO postgres;

--
-- Name: boulders_with_like; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.boulders_with_like AS
 SELECT b.id,
    b.location,
    b.name,
    b."isHighball",
    b."mustSee",
    b."dangerousDescent",
    b.images,
    b."topoId",
    public.likes_boulder(b.id) AS liked
   FROM public.boulders b;


ALTER TABLE public.boulders_with_like OWNER TO postgres;

--
-- Name: images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.images (
    id uuid NOT NULL,
    users integer NOT NULL
);


ALTER TABLE public.images OWNER TO postgres;

--
-- Name: lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lines (
    id uuid NOT NULL,
    index double precision NOT NULL,
    points double precision[] NOT NULL,
    forbidden extensions.geometry(MultiLineString),
    hand1 extensions.geometry(Point),
    hand2 extensions.geometry(Point),
    foot1 extensions.geometry(Point),
    foot2 extensions.geometry(Point),
    "imageId" uuid,
    "topoId" uuid NOT NULL,
    "trackId" uuid NOT NULL
);


ALTER TABLE public.lines OWNER TO postgres;

--
-- Name: managers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.managers (
    id uuid NOT NULL,
    name character varying(500) NOT NULL,
    "contactName" character varying(500) NOT NULL,
    "contactPhone" character varying(30),
    "contactMail" character varying(500),
    description character varying(5000),
    address character varying(5000),
    zip integer,
    city character varying(500),
    "topoId" uuid NOT NULL,
    image public.img
);


ALTER TABLE public.managers OWNER TO postgres;

--
-- Name: parkings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parkings (
    id uuid NOT NULL,
    spaces integer NOT NULL,
    location extensions.geometry(Point) NOT NULL,
    name character varying(500),
    description character varying(5000),
    "topoId" uuid NOT NULL,
    image public.img
);


ALTER TABLE public.parkings OWNER TO postgres;

--
-- Name: sectors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sectors (
    id uuid NOT NULL,
    index double precision NOT NULL,
    name character varying(255) NOT NULL,
    path extensions.geometry(LineString) NOT NULL,
    boulders uuid[] NOT NULL,
    "topoId" uuid NOT NULL
);


ALTER TABLE public.sectors OWNER TO postgres;

--
-- Name: topo_accesses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topo_accesses (
    id uuid NOT NULL,
    danger character varying(5000),
    difficulty smallint,
    duration integer,
    steps public.topo_access_step[] NOT NULL,
    "topoId" uuid NOT NULL
);


ALTER TABLE public.topo_accesses OWNER TO postgres;

--
-- Name: topo_contributors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topo_contributors (
    topo_id uuid NOT NULL,
    user_id uuid NOT NULL,
    role public.contributor_role NOT NULL
);


ALTER TABLE public.topo_contributors OWNER TO postgres;

--
-- Name: topo_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topo_likes (
    "topoId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.topo_likes OWNER TO postgres;

--
-- Name: topos_with_like; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.topos_with_like AS
 SELECT t.id,
    t.name,
    t.status,
    t.location,
    t.forbidden,
    t.modified,
    t.submitted,
    t.validated,
    t.amenities,
    t."rockTypes",
    t.type,
    t.description,
    t."faunaProtection",
    t.ethics,
    t.danger,
    t.cleaned,
    t.altitude,
    t."closestCity",
    t."otherAmenities",
    t."lonelyBoulders",
    t.image,
    t."creatorId",
    t."validatorId",
    public.likes_topo(t.id) AS liked
   FROM public.topos t;


ALTER TABLE public.topos_with_like OWNER TO postgres;

--
-- Name: track_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.track_ratings (
    id uuid NOT NULL,
    finished boolean NOT NULL,
    rating smallint NOT NULL,
    comment character varying(5000),
    created timestamp with time zone DEFAULT now() NOT NULL,
    modified timestamp with time zone DEFAULT now() NOT NULL,
    "topoId" uuid NOT NULL,
    "trackId" uuid NOT NULL,
    "authorId" uuid
);


ALTER TABLE public.track_ratings OWNER TO postgres;

--
-- Name: tracks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracks (
    id uuid NOT NULL,
    index double precision NOT NULL,
    name character varying(500),
    description character varying(5000),
    height integer,
    grade public.grade,
    orientation smallint,
    reception smallint,
    anchors integer,
    techniques integer DEFAULT 0 NOT NULL,
    "isTraverse" boolean DEFAULT false NOT NULL,
    "isSittingStart" boolean DEFAULT false NOT NULL,
    "mustSee" boolean DEFAULT false NOT NULL,
    "hasMantle" boolean DEFAULT false NOT NULL,
    "topoId" uuid NOT NULL,
    "boulderId" uuid NOT NULL,
    "creatorId" uuid
);


ALTER TABLE public.tracks OWNER TO postgres;

--
-- Name: users; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.users AS
 SELECT accounts.id,
    accounts."userName",
    accounts.email,
    accounts.role,
    accounts.created,
    accounts."firstName",
    accounts."lastName",
    accounts.country,
    accounts.city,
    accounts.phone,
    accounts."birthDate",
    accounts.image
   FROM public.accounts
  WHERE (accounts.id = auth.uid());


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: waypoints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waypoints (
    id uuid NOT NULL,
    name character varying(500) NOT NULL,
    location extensions.geometry(Point) NOT NULL,
    description character varying(5000),
    "topoId" uuid NOT NULL,
    image public.img
);


ALTER TABLE public.waypoints OWNER TO postgres;

--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.schema_migrations (
    version bigint NOT NULL,
    inserted_at timestamp(0) without time zone
);


ALTER TABLE realtime.schema_migrations OWNER TO supabase_admin;

--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: supabase_admin
--

CREATE TABLE realtime.subscription (
    id bigint NOT NULL,
    subscription_id uuid NOT NULL,
    entity regclass NOT NULL,
    filters realtime.user_defined_filter[] DEFAULT '{}'::realtime.user_defined_filter[] NOT NULL,
    claims jsonb NOT NULL,
    claims_role regrole GENERATED ALWAYS AS (realtime.to_regrole((claims ->> 'role'::text))) STORED NOT NULL,
    created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


ALTER TABLE realtime.subscription OWNER TO supabase_admin;

--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE realtime.subscription ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME realtime.subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false
);


ALTER TABLE storage.buckets OWNER TO supabase_storage_admin;

--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE storage.migrations OWNER TO supabase_storage_admin;

--
-- Name: objects; Type: TABLE; Schema: storage; Owner: supabase_storage_admin
--

CREATE TABLE storage.objects (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED
);


ALTER TABLE storage.objects OWNER TO supabase_storage_admin;

--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: postgres
--

CREATE TABLE supabase_migrations.schema_migrations (
    version text NOT NULL
);


ALTER TABLE supabase_migrations.schema_migrations OWNER TO postgres;

--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (provider, id);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: boulder_likes boulder_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boulder_likes
    ADD CONSTRAINT boulder_likes_pkey PRIMARY KEY ("boulderId", "userId");


--
-- Name: boulders boulders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boulders
    ADD CONSTRAINT boulders_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: lines lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lines
    ADD CONSTRAINT lines_pkey PRIMARY KEY (id);


--
-- Name: managers managers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.managers
    ADD CONSTRAINT managers_pkey PRIMARY KEY (id);


--
-- Name: parkings parkings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parkings
    ADD CONSTRAINT parkings_pkey PRIMARY KEY (id);


--
-- Name: sectors sectors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT sectors_pkey PRIMARY KEY (id);


--
-- Name: topo_accesses topo_accesses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_accesses
    ADD CONSTRAINT topo_accesses_pkey PRIMARY KEY (id);


--
-- Name: topo_contributors topo_contributors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_contributors
    ADD CONSTRAINT topo_contributors_pkey PRIMARY KEY (topo_id, user_id);


--
-- Name: topo_likes topo_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_likes
    ADD CONSTRAINT topo_likes_pkey PRIMARY KEY ("topoId", "userId");


--
-- Name: topos topos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topos
    ADD CONSTRAINT topos_pkey PRIMARY KEY (id);


--
-- Name: track_ratings track_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_ratings
    ADD CONSTRAINT track_ratings_pkey PRIMARY KEY (id);


--
-- Name: tracks tracks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT tracks_pkey PRIMARY KEY (id);


--
-- Name: waypoints waypoints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waypoints
    ADD CONSTRAINT waypoints_pkey PRIMARY KEY (id);


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.subscription
    ADD CONSTRAINT pk_subscription PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: supabase_admin
--

ALTER TABLE ONLY realtime.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: postgres
--

ALTER TABLE ONLY supabase_migrations.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_token_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX refresh_tokens_token_idx ON auth.refresh_tokens USING btree (token);


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: supabase_auth_admin
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: accesses_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX accesses_topo_idx ON public.topo_accesses USING btree ("topoId");


--
-- Name: boulder_likes_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX boulder_likes_user_idx ON public.boulder_likes USING btree ("userId");


--
-- Name: boulders_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX boulders_topo_idx ON public.boulders USING btree ("topoId");


--
-- Name: lines_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lines_topo_idx ON public.lines USING btree ("topoId");


--
-- Name: lines_track_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX lines_track_idx ON public.lines USING btree ("trackId");


--
-- Name: managers_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX managers_topo_idx ON public.managers USING btree ("topoId");


--
-- Name: parkings_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parkings_topo_idx ON public.parkings USING btree ("topoId");


--
-- Name: sectors_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sectors_topo_idx ON public.sectors USING btree ("topoId");


--
-- Name: topo_contributors_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX topo_contributors_user_idx ON public.topo_contributors USING btree (user_id);


--
-- Name: topo_creator_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX topo_creator_idx ON public.topos USING btree ("creatorId");


--
-- Name: topo_likes_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX topo_likes_user_idx ON public.topo_likes USING btree ("userId");


--
-- Name: topo_validator_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX topo_validator_idx ON public.topos USING btree ("validatorId");


--
-- Name: track_ratings_author_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX track_ratings_author_idx ON public.track_ratings USING btree ("authorId");


--
-- Name: track_ratings_track_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX track_ratings_track_idx ON public.track_ratings USING btree ("trackId", "authorId");


--
-- Name: tracks_boulder_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tracks_boulder_idx ON public.tracks USING btree ("boulderId");


--
-- Name: tracks_creator_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tracks_creator_idx ON public.tracks USING btree ("creatorId");


--
-- Name: tracks_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tracks_topo_idx ON public.tracks USING btree ("topoId");


--
-- Name: trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trgm_idx ON public.topos USING gin (name extensions.gin_trgm_ops);


--
-- Name: waypoints_topo_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX waypoints_topo_idx ON public.waypoints USING btree ("topoId");


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE INDEX ix_realtime_subscription_entity ON realtime.subscription USING hash (entity);


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: supabase_admin
--

CREATE UNIQUE INDEX subscription_subscription_id_entity_filters_key ON realtime.subscription USING btree (subscription_id, entity, filters);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: supabase_storage_admin
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: users on_email_change; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_email_change AFTER UPDATE OF email ON auth.users FOR EACH ROW EXECUTE FUNCTION internal.sync_email();


--
-- Name: users on_new_user; Type: TRIGGER; Schema: auth; Owner: supabase_auth_admin
--

CREATE TRIGGER on_new_user AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION internal.handle_new_user();


--
-- Name: topos before_topo_created; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER before_topo_created AFTER INSERT ON public.topos FOR EACH ROW EXECUTE FUNCTION internal.setup_topo_admin();


--
-- Name: boulders boulder_delete; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER boulder_delete AFTER DELETE ON public.boulders FOR EACH ROW EXECUTE FUNCTION internal.on_boulder_delete();


--
-- Name: boulders boulder_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER boulder_insert AFTER INSERT ON public.boulders FOR EACH ROW EXECUTE FUNCTION internal.on_boulder_insert();


--
-- Name: boulders boulder_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER boulder_update AFTER UPDATE OF images ON public.boulders FOR EACH ROW EXECUTE FUNCTION internal.on_boulder_update();


--
-- Name: managers check_new_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_new_img AFTER INSERT ON public.managers FOR EACH ROW EXECUTE FUNCTION internal.check_new_img();


--
-- Name: parkings check_new_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_new_img AFTER INSERT ON public.parkings FOR EACH ROW EXECUTE FUNCTION internal.check_new_img();


--
-- Name: topos check_new_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_new_img AFTER INSERT ON public.topos FOR EACH ROW EXECUTE FUNCTION internal.check_new_img();


--
-- Name: waypoints check_new_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_new_img AFTER INSERT ON public.waypoints FOR EACH ROW EXECUTE FUNCTION internal.check_new_img();


--
-- Name: users create_user_does_nothing; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER create_user_does_nothing INSTEAD OF INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION internal.do_nothing();


--
-- Name: topo_accesses delete_images; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_images AFTER DELETE ON public.topo_accesses FOR EACH ROW EXECUTE FUNCTION internal.on_access_delete();


--
-- Name: users delete_user_does_nothing; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_user_does_nothing INSTEAD OF DELETE ON public.users FOR EACH ROW EXECUTE FUNCTION internal.do_nothing();


--
-- Name: boulders handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.boulders FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: lines handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.lines FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: managers handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.managers FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: parkings handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.parkings FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: sectors handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.sectors FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: topo_accesses handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.topo_accesses FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: tracks handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.tracks FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: waypoints handle_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER handle_updated_at AFTER INSERT OR UPDATE ON public.waypoints FOR EACH ROW EXECUTE FUNCTION internal.topo_was_modified();


--
-- Name: accounts img_changed; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER img_changed AFTER UPDATE ON public.accounts FOR EACH ROW WHEN (((old.image).id <> (new.image).id)) EXECUTE FUNCTION internal.img_changed();


--
-- Name: managers img_changed; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER img_changed AFTER UPDATE ON public.managers FOR EACH ROW WHEN (((old.image).id <> (new.image).id)) EXECUTE FUNCTION internal.img_changed();


--
-- Name: parkings img_changed; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER img_changed AFTER UPDATE OF image ON public.parkings FOR EACH ROW WHEN (((old.image).id <> (new.image).id)) EXECUTE FUNCTION internal.img_changed();


--
-- Name: topos img_changed; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER img_changed AFTER UPDATE OF image ON public.topos FOR EACH ROW WHEN (((old.image).id <> (new.image).id)) EXECUTE FUNCTION internal.img_changed();


--
-- Name: waypoints img_changed; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER img_changed AFTER UPDATE OF image ON public.waypoints FOR EACH ROW WHEN (((old.image).id <> (new.image).id)) EXECUTE FUNCTION internal.img_changed();


--
-- Name: track_ratings on_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_insert BEFORE INSERT ON public.track_ratings FOR EACH ROW EXECUTE FUNCTION internal.insert_timestamps();


--
-- Name: accounts on_role_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_role_change AFTER UPDATE ON public.accounts FOR EACH ROW WHEN ((old.role <> new.role)) EXECUTE FUNCTION internal.sync_role();


--
-- Name: topos on_status_change; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_status_change BEFORE UPDATE ON public.topos FOR EACH ROW WHEN ((old.status <> new.status)) EXECUTE FUNCTION public.check_status_change();


--
-- Name: track_ratings on_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER on_update BEFORE UPDATE ON public.track_ratings FOR EACH ROW EXECUTE FUNCTION internal.update_timestamps();


--
-- Name: profiles profiles_are_read_only; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER profiles_are_read_only INSTEAD OF INSERT OR DELETE OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION internal.do_nothing();


--
-- Name: topo_accesses register_images; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER register_images AFTER INSERT ON public.topo_accesses FOR EACH ROW EXECUTE FUNCTION internal.on_access_insert();


--
-- Name: topos timestamp_topo; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER timestamp_topo BEFORE UPDATE ON public.topos FOR EACH ROW EXECUTE FUNCTION internal.timestamp_topo();


--
-- Name: accounts unregister_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER unregister_img AFTER DELETE ON public.accounts FOR EACH ROW EXECUTE FUNCTION internal.unregister_img();


--
-- Name: managers unregister_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER unregister_img AFTER DELETE ON public.managers FOR EACH ROW EXECUTE FUNCTION internal.unregister_img();


--
-- Name: parkings unregister_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER unregister_img AFTER DELETE ON public.parkings FOR EACH ROW EXECUTE FUNCTION internal.unregister_img();


--
-- Name: topos unregister_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER unregister_img AFTER DELETE ON public.topos FOR EACH ROW EXECUTE FUNCTION internal.unregister_img();


--
-- Name: waypoints unregister_img; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER unregister_img AFTER DELETE ON public.waypoints FOR EACH ROW EXECUTE FUNCTION internal.unregister_img();


--
-- Name: topo_accesses update_images; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_images AFTER UPDATE ON public.topo_accesses FOR EACH ROW EXECUTE FUNCTION internal.on_access_update();


--
-- Name: users update_user; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user INSTEAD OF UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION internal.handle_user_update();


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_parent_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: supabase_auth_admin
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_parent_fkey FOREIGN KEY (parent) REFERENCES auth.refresh_tokens(token);


--
-- Name: accounts accounts_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: boulder_likes boulder_likes_boulderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boulder_likes
    ADD CONSTRAINT "boulder_likes_boulderId_fkey" FOREIGN KEY ("boulderId") REFERENCES public.boulders(id) ON DELETE CASCADE;


--
-- Name: boulder_likes boulder_likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boulder_likes
    ADD CONSTRAINT "boulder_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: boulders boulders_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.boulders
    ADD CONSTRAINT "boulders_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: lines lines_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lines
    ADD CONSTRAINT "lines_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: lines lines_trackId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lines
    ADD CONSTRAINT "lines_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES public.tracks(id) ON DELETE CASCADE;


--
-- Name: managers managers_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.managers
    ADD CONSTRAINT "managers_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: parkings parkings_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parkings
    ADD CONSTRAINT "parkings_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: sectors sectors_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sectors
    ADD CONSTRAINT "sectors_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: topo_accesses topo_accesses_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_accesses
    ADD CONSTRAINT "topo_accesses_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: topo_contributors topo_contributors_topo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_contributors
    ADD CONSTRAINT topo_contributors_topo_id_fkey FOREIGN KEY (topo_id) REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: topo_contributors topo_contributors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_contributors
    ADD CONSTRAINT topo_contributors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: topo_likes topo_likes_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_likes
    ADD CONSTRAINT "topo_likes_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: topo_likes topo_likes_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topo_likes
    ADD CONSTRAINT "topo_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: topos topos_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topos
    ADD CONSTRAINT "topos_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: topos topos_validatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topos
    ADD CONSTRAINT "topos_validatorId_fkey" FOREIGN KEY ("validatorId") REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: track_ratings track_ratings_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_ratings
    ADD CONSTRAINT "track_ratings_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: track_ratings track_ratings_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_ratings
    ADD CONSTRAINT "track_ratings_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: track_ratings track_ratings_trackId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track_ratings
    ADD CONSTRAINT "track_ratings_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES public.tracks(id) ON DELETE CASCADE;


--
-- Name: tracks tracks_boulderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT "tracks_boulderId_fkey" FOREIGN KEY ("boulderId") REFERENCES public.boulders(id) ON DELETE CASCADE;


--
-- Name: tracks tracks_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT "tracks_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public.accounts(id) ON DELETE SET NULL;


--
-- Name: tracks tracks_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT "tracks_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: waypoints waypoints_topoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waypoints
    ADD CONSTRAINT "waypoints_topoId_fkey" FOREIGN KEY ("topoId") REFERENCES public.topos(id) ON DELETE CASCADE;


--
-- Name: buckets buckets_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: objects objects_owner_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);


--
-- Name: boulder_likes Admins are omnipotent; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins are omnipotent" ON public.boulder_likes FOR SELECT USING (true);


--
-- Name: managers Admins are omnipotent; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins are omnipotent" ON public.managers USING (public.is_admin(auth.uid()));


--
-- Name: topo_contributors Admins are omnipotent; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins are omnipotent" ON public.topo_contributors USING (public.is_admin(auth.uid()));


--
-- Name: topo_likes Admins are omnipotent; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins are omnipotent" ON public.topo_likes FOR SELECT USING (true);


--
-- Name: track_ratings Admins are omnipotent; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Admins are omnipotent" ON public.track_ratings USING (public.is_admin(auth.uid()));


--
-- Name: boulders Boulders can be modified by topo contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Boulders can be modified by topo contributors" ON public.boulders USING (public.can_edit_topo("topoId"));


--
-- Name: boulders Boulders visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Boulders visibility" ON public.boulders FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: topos Draft topos can be modified by contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Draft topos can be modified by contributors" ON public.topos FOR UPDATE USING (public.can_edit_topo(id));


--
-- Name: images Images are visible for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Images are visible for everyone" ON public.images FOR SELECT USING (true);


--
-- Name: boulder_likes Likes are visible for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Likes are visible for everyone" ON public.boulder_likes FOR SELECT USING (true);


--
-- Name: topo_likes Likes are visible for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Likes are visible for everyone" ON public.topo_likes FOR SELECT USING (true);


--
-- Name: lines Lines are visible for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Lines are visible for everyone" ON public.lines FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: lines Lines can be modified by topo contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Lines can be modified by topo contributors" ON public.lines USING (public.can_edit_topo("topoId"));


--
-- Name: managers Managers are visible for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers are visible for everyone" ON public.managers FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: managers Managers can be modified by topo admins; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Managers can be modified by topo admins" ON public.managers USING (public.is_topo_admin("topoId", auth.uid()));


--
-- Name: topo_contributors Only topo admins can manage contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Only topo admins can manage contributors" ON public.topo_contributors USING (public.is_topo_admin(topo_id, auth.uid()));


--
-- Name: parkings Parkings can be modified by topo contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Parkings can be modified by topo contributors" ON public.parkings USING (public.can_edit_topo("topoId"));


--
-- Name: parkings Parkings visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Parkings visibility" ON public.parkings FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: sectors Sectors are visible for everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Sectors are visible for everyone" ON public.sectors FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: sectors Sectors can be modified by topo contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Sectors can be modified by topo contributors" ON public.sectors USING (public.can_edit_topo("topoId"));


--
-- Name: topo_accesses Topo accesses can be modified by topo contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Topo accesses can be modified by topo contributors" ON public.topo_accesses USING (public.can_edit_topo("topoId"));


--
-- Name: topo_contributors Topo contributors are visible by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Topo contributors are visible by everyone" ON public.topo_contributors FOR SELECT USING (true);


--
-- Name: topo_accesses Topo visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Topo visibility" ON public.topo_accesses FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: topos Topo visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Topo visibility" ON public.topos FOR SELECT USING (((status = 2) OR public.is_contributor(id, auth.uid()) OR public.is_admin(auth.uid())));


--
-- Name: topos Topos can be deleted by their admin; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Topos can be deleted by their admin" ON public.topos FOR DELETE USING (public.can_delete_topo(id));


--
-- Name: topos Topos can be inserted by their creator.; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Topos can be inserted by their creator." ON public.topos FOR INSERT WITH CHECK ((("creatorId" IS NOT NULL) AND (auth.uid() = "creatorId")));


--
-- Name: tracks Tracks can be modified by topo contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Tracks can be modified by topo contributors" ON public.tracks USING (public.can_edit_topo("topoId"));


--
-- Name: tracks Tracks visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Tracks visibility" ON public.tracks FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: waypoints Waypoints can be modified by topo contributors; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Waypoints can be modified by topo contributors" ON public.waypoints USING (public.can_edit_topo("topoId"));


--
-- Name: waypoints Waypoints visibility; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Waypoints visibility" ON public.waypoints FOR SELECT USING (public.can_view_topo("topoId"));


--
-- Name: accounts; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;

--
-- Name: boulder_likes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.boulder_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: boulders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.boulders ENABLE ROW LEVEL SECURITY;

--
-- Name: images; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

--
-- Name: lines; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lines ENABLE ROW LEVEL SECURITY;

--
-- Name: managers; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

--
-- Name: parkings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.parkings ENABLE ROW LEVEL SECURITY;

--
-- Name: sectors; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;

--
-- Name: topo_accesses; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.topo_accesses ENABLE ROW LEVEL SECURITY;

--
-- Name: topo_contributors; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.topo_contributors ENABLE ROW LEVEL SECURITY;

--
-- Name: topo_likes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.topo_likes ENABLE ROW LEVEL SECURITY;

--
-- Name: topos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.topos ENABLE ROW LEVEL SECURITY;

--
-- Name: track_ratings; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.track_ratings ENABLE ROW LEVEL SECURITY;

--
-- Name: track_ratings track_ratings are visible by everyone; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "track_ratings are visible by everyone" ON public.track_ratings FOR SELECT USING (true);


--
-- Name: track_ratings track_ratings can be placed by their authors on validated topos; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "track_ratings can be placed by their authors on validated topos" ON public.track_ratings USING ((("authorId" = auth.uid()) AND (EXISTS ( SELECT 1
   FROM public.topos t
  WHERE ((t.id = track_ratings."topoId") AND (t.status = 2))))));


--
-- Name: tracks; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

--
-- Name: waypoints; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.waypoints ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: supabase_storage_admin
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: postgres
--

CREATE PUBLICATION supabase_realtime WITH (publish = 'insert, update, delete, truncate');


ALTER PUBLICATION supabase_realtime OWNER TO postgres;

--
-- Name: SCHEMA auth; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA auth TO anon;
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON SCHEMA auth TO supabase_auth_admin;
GRANT ALL ON SCHEMA auth TO dashboard_user;
GRANT ALL ON SCHEMA auth TO postgres;


--
-- Name: SCHEMA extensions; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA extensions TO anon;
GRANT USAGE ON SCHEMA extensions TO authenticated;
GRANT USAGE ON SCHEMA extensions TO service_role;
GRANT ALL ON SCHEMA extensions TO dashboard_user;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: SCHEMA graphql_public; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA graphql_public TO postgres;
GRANT USAGE ON SCHEMA graphql_public TO anon;
GRANT USAGE ON SCHEMA graphql_public TO authenticated;
GRANT USAGE ON SCHEMA graphql_public TO service_role;


--
-- Name: SCHEMA realtime; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA realtime TO postgres;


--
-- Name: SCHEMA storage; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT ALL ON SCHEMA storage TO postgres;
GRANT USAGE ON SCHEMA storage TO anon;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT USAGE ON SCHEMA storage TO service_role;
GRANT ALL ON SCHEMA storage TO supabase_storage_admin;
GRANT ALL ON SCHEMA storage TO dashboard_user;


--
-- Name: TABLE accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.accounts TO anon;
GRANT ALL ON TABLE public.accounts TO authenticated;
GRANT ALL ON TABLE public.accounts TO service_role;


--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;


--
-- Name: FUNCTION email(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.email() TO dashboard_user;


--
-- Name: FUNCTION jwt(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.jwt() TO postgres;
GRANT ALL ON FUNCTION auth.jwt() TO dashboard_user;


--
-- Name: FUNCTION role(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.role() TO dashboard_user;


--
-- Name: FUNCTION uid(); Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON FUNCTION auth.uid() TO dashboard_user;


--
-- Name: FUNCTION algorithm_sign(signables text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.algorithm_sign(signables text, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.armor(bytea) TO dashboard_user;


--
-- Name: FUNCTION armor(bytea, text[], text[]); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.armor(bytea, text[], text[]) TO dashboard_user;


--
-- Name: FUNCTION crypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.crypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION dearmor(text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.dearmor(text) TO dashboard_user;


--
-- Name: FUNCTION decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION decrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.decrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.digest(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION digest(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.digest(text, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.encrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION encrypt_iv(bytea, bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.encrypt_iv(bytea, bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION gen_random_bytes(integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_random_bytes(integer) TO dashboard_user;


--
-- Name: FUNCTION gen_random_uuid(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_random_uuid() TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_salt(text) TO dashboard_user;


--
-- Name: FUNCTION gen_salt(text, integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.gen_salt(text, integer) TO dashboard_user;


--
-- Name: FUNCTION grant_pg_cron_access(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.grant_pg_cron_access() TO dashboard_user;


--
-- Name: FUNCTION grant_pg_net_access(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.grant_pg_net_access() TO dashboard_user;


--
-- Name: FUNCTION hmac(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.hmac(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION hmac(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.hmac(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements(showtext boolean, OUT userid oid, OUT dbid oid, OUT toplevel boolean, OUT queryid bigint, OUT query text, OUT plans bigint, OUT total_plan_time double precision, OUT min_plan_time double precision, OUT max_plan_time double precision, OUT mean_plan_time double precision, OUT stddev_plan_time double precision, OUT calls bigint, OUT total_exec_time double precision, OUT min_exec_time double precision, OUT max_exec_time double precision, OUT mean_exec_time double precision, OUT stddev_exec_time double precision, OUT rows bigint, OUT shared_blks_hit bigint, OUT shared_blks_read bigint, OUT shared_blks_dirtied bigint, OUT shared_blks_written bigint, OUT local_blks_hit bigint, OUT local_blks_read bigint, OUT local_blks_dirtied bigint, OUT local_blks_written bigint, OUT temp_blks_read bigint, OUT temp_blks_written bigint, OUT blk_read_time double precision, OUT blk_write_time double precision, OUT wal_records bigint, OUT wal_fpi bigint, OUT wal_bytes numeric) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_info(OUT dealloc bigint, OUT stats_reset timestamp with time zone) TO dashboard_user;


--
-- Name: FUNCTION pg_stat_statements_reset(userid oid, dbid oid, queryid bigint); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pg_stat_statements_reset(userid oid, dbid oid, queryid bigint) TO dashboard_user;


--
-- Name: FUNCTION pgp_armor_headers(text, OUT key text, OUT value text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_armor_headers(text, OUT key text, OUT value text) TO dashboard_user;


--
-- Name: FUNCTION pgp_key_id(bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_key_id(bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_decrypt_bytea(bytea, bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_decrypt_bytea(bytea, bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt(text, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt(text, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea) TO dashboard_user;


--
-- Name: FUNCTION pgp_pub_encrypt_bytea(bytea, bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_pub_encrypt_bytea(bytea, bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_decrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_decrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt(text, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt(text, text, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text) TO dashboard_user;


--
-- Name: FUNCTION pgp_sym_encrypt_bytea(bytea, text, text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.pgp_sym_encrypt_bytea(bytea, text, text) TO dashboard_user;


--
-- Name: FUNCTION sign(payload json, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.sign(payload json, secret text, algorithm text) TO dashboard_user;


--
-- Name: FUNCTION try_cast_double(inp text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.try_cast_double(inp text) TO dashboard_user;


--
-- Name: FUNCTION url_decode(data text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.url_decode(data text) TO dashboard_user;


--
-- Name: FUNCTION url_encode(data bytea); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.url_encode(data bytea) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v1mc(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v1mc() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v3(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v3(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v4(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v4() TO dashboard_user;


--
-- Name: FUNCTION uuid_generate_v5(namespace uuid, name text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_generate_v5(namespace uuid, name text) TO dashboard_user;


--
-- Name: FUNCTION uuid_nil(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_nil() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_dns(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_dns() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_oid(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_oid() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_url(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_url() TO dashboard_user;


--
-- Name: FUNCTION uuid_ns_x500(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.uuid_ns_x500() TO dashboard_user;


--
-- Name: FUNCTION verify(token text, secret text, algorithm text); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION extensions.verify(token text, secret text, algorithm text) TO dashboard_user;


--
-- Name: TABLE _field; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON TABLE graphql._field TO postgres;


--
-- Name: FUNCTION get_built_schema_version(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO postgres;
GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO anon;
GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO authenticated;
GRANT ALL ON FUNCTION graphql.get_built_schema_version() TO service_role;


--
-- Name: FUNCTION rebuild_on_ddl(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO postgres;
GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO anon;
GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO authenticated;
GRANT ALL ON FUNCTION graphql.rebuild_on_ddl() TO service_role;


--
-- Name: FUNCTION rebuild_on_drop(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO postgres;
GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO anon;
GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO authenticated;
GRANT ALL ON FUNCTION graphql.rebuild_on_drop() TO service_role;


--
-- Name: FUNCTION rebuild_schema(); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.rebuild_schema() TO postgres;
GRANT ALL ON FUNCTION graphql.rebuild_schema() TO anon;
GRANT ALL ON FUNCTION graphql.rebuild_schema() TO authenticated;
GRANT ALL ON FUNCTION graphql.rebuild_schema() TO service_role;


--
-- Name: TABLE _type; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON TABLE graphql._type TO postgres;


--
-- Name: FUNCTION variable_definitions_sort(variable_definitions jsonb); Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql.variable_definitions_sort(variable_definitions jsonb) TO service_role;


--
-- Name: FUNCTION graphql("operationName" text, query text, variables jsonb, extensions jsonb); Type: ACL; Schema: graphql_public; Owner: supabase_admin
--

GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO postgres;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO anon;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO authenticated;
GRANT ALL ON FUNCTION graphql_public.graphql("operationName" text, query text, variables jsonb, extensions jsonb) TO service_role;


--
-- Name: FUNCTION get_auth(p_usename text); Type: ACL; Schema: pgbouncer; Owner: postgres
--

REVOKE ALL ON FUNCTION pgbouncer.get_auth(p_usename text) FROM PUBLIC;
GRANT ALL ON FUNCTION pgbouncer.get_auth(p_usename text) TO pgbouncer;


--
-- Name: TABLE topos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.topos TO anon;
GRANT ALL ON TABLE public.topos TO authenticated;
GRANT ALL ON TABLE public.topos TO service_role;


--
-- Name: FUNCTION build_light_topo(_topo public.topos); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.build_light_topo(_topo public.topos) TO anon;
GRANT ALL ON FUNCTION public.build_light_topo(_topo public.topos) TO authenticated;
GRANT ALL ON FUNCTION public.build_light_topo(_topo public.topos) TO service_role;


--
-- Name: FUNCTION can_delete_topo(_topo_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_delete_topo(_topo_id uuid) TO anon;
GRANT ALL ON FUNCTION public.can_delete_topo(_topo_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_delete_topo(_topo_id uuid) TO service_role;


--
-- Name: FUNCTION can_edit_topo(_topo_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_edit_topo(_topo_id uuid) TO anon;
GRANT ALL ON FUNCTION public.can_edit_topo(_topo_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_edit_topo(_topo_id uuid) TO service_role;


--
-- Name: FUNCTION can_view_topo(_topo_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.can_view_topo(_topo_id uuid) TO anon;
GRANT ALL ON FUNCTION public.can_view_topo(_topo_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.can_view_topo(_topo_id uuid) TO service_role;


--
-- Name: FUNCTION check_status_change(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.check_status_change() TO anon;
GRANT ALL ON FUNCTION public.check_status_change() TO authenticated;
GRANT ALL ON FUNCTION public.check_status_change() TO service_role;


--
-- Name: FUNCTION grade_to_category(grade public.grade); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.grade_to_category(grade public.grade) TO anon;
GRANT ALL ON FUNCTION public.grade_to_category(grade public.grade) TO authenticated;
GRANT ALL ON FUNCTION public.grade_to_category(grade public.grade) TO service_role;


--
-- Name: FUNCTION is_admin(_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_admin(_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_admin(_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_admin(_user_id uuid) TO service_role;


--
-- Name: FUNCTION is_contributor(_topo_id uuid, _user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_contributor(_topo_id uuid, _user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_contributor(_topo_id uuid, _user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_contributor(_topo_id uuid, _user_id uuid) TO service_role;


--
-- Name: FUNCTION is_topo_admin(_topo_id uuid, _user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.is_topo_admin(_topo_id uuid, _user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.is_topo_admin(_topo_id uuid, _user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.is_topo_admin(_topo_id uuid, _user_id uuid) TO service_role;


--
-- Name: FUNCTION like_boulders(_ids uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.like_boulders(_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.like_boulders(_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.like_boulders(_ids uuid[]) TO service_role;


--
-- Name: FUNCTION like_topos(_ids uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.like_topos(_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.like_topos(_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.like_topos(_ids uuid[]) TO service_role;


--
-- Name: FUNCTION liked_topos_of_user(_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.liked_topos_of_user(_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.liked_topos_of_user(_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.liked_topos_of_user(_user_id uuid) TO service_role;


--
-- Name: FUNCTION likes_boulder(_boulder_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.likes_boulder(_boulder_id uuid) TO anon;
GRANT ALL ON FUNCTION public.likes_boulder(_boulder_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.likes_boulder(_boulder_id uuid) TO service_role;


--
-- Name: FUNCTION likes_topo(_topo_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.likes_topo(_topo_id uuid) TO anon;
GRANT ALL ON FUNCTION public.likes_topo(_topo_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.likes_topo(_topo_id uuid) TO service_role;


--
-- Name: TABLE light_topos; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.light_topos TO anon;
GRANT ALL ON TABLE public.light_topos TO authenticated;
GRANT ALL ON TABLE public.light_topos TO service_role;


--
-- Name: FUNCTION search_light_topos(_query text, _nb integer, _similarity double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.search_light_topos(_query text, _nb integer, _similarity double precision) TO anon;
GRANT ALL ON FUNCTION public.search_light_topos(_query text, _nb integer, _similarity double precision) TO authenticated;
GRANT ALL ON FUNCTION public.search_light_topos(_query text, _nb integer, _similarity double precision) TO service_role;


--
-- Name: FUNCTION unlike_boulders(_ids uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unlike_boulders(_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.unlike_boulders(_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.unlike_boulders(_ids uuid[]) TO service_role;


--
-- Name: FUNCTION unlike_topos(_ids uuid[]); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.unlike_topos(_ids uuid[]) TO anon;
GRANT ALL ON FUNCTION public.unlike_topos(_ids uuid[]) TO authenticated;
GRANT ALL ON FUNCTION public.unlike_topos(_ids uuid[]) TO service_role;


--
-- Name: FUNCTION apply_rls(wal jsonb, max_record_bytes integer); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO postgres;
GRANT ALL ON FUNCTION realtime.apply_rls(wal jsonb, max_record_bytes integer) TO dashboard_user;


--
-- Name: FUNCTION build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO postgres;
GRANT ALL ON FUNCTION realtime.build_prepared_statement_sql(prepared_statement_name text, entity regclass, columns realtime.wal_column[]) TO dashboard_user;


--
-- Name: FUNCTION "cast"(val text, type_ regtype); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO postgres;
GRANT ALL ON FUNCTION realtime."cast"(val text, type_ regtype) TO dashboard_user;


--
-- Name: FUNCTION check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO postgres;
GRANT ALL ON FUNCTION realtime.check_equality_op(op realtime.equality_op, type_ regtype, val_1 text, val_2 text) TO dashboard_user;


--
-- Name: FUNCTION is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO postgres;
GRANT ALL ON FUNCTION realtime.is_visible_through_filters(columns realtime.wal_column[], filters realtime.user_defined_filter[]) TO dashboard_user;


--
-- Name: FUNCTION quote_wal2json(entity regclass); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO postgres;
GRANT ALL ON FUNCTION realtime.quote_wal2json(entity regclass) TO dashboard_user;


--
-- Name: FUNCTION subscription_check_filters(); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO postgres;
GRANT ALL ON FUNCTION realtime.subscription_check_filters() TO dashboard_user;


--
-- Name: FUNCTION to_regrole(role_name text); Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO postgres;
GRANT ALL ON FUNCTION realtime.to_regrole(role_name text) TO dashboard_user;


--
-- Name: FUNCTION extension(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.extension(name text) TO anon;
GRANT ALL ON FUNCTION storage.extension(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.extension(name text) TO service_role;
GRANT ALL ON FUNCTION storage.extension(name text) TO dashboard_user;
GRANT ALL ON FUNCTION storage.extension(name text) TO postgres;


--
-- Name: FUNCTION filename(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.filename(name text) TO anon;
GRANT ALL ON FUNCTION storage.filename(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.filename(name text) TO service_role;
GRANT ALL ON FUNCTION storage.filename(name text) TO dashboard_user;
GRANT ALL ON FUNCTION storage.filename(name text) TO postgres;


--
-- Name: FUNCTION foldername(name text); Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON FUNCTION storage.foldername(name text) TO anon;
GRANT ALL ON FUNCTION storage.foldername(name text) TO authenticated;
GRANT ALL ON FUNCTION storage.foldername(name text) TO service_role;
GRANT ALL ON FUNCTION storage.foldername(name text) TO dashboard_user;
GRANT ALL ON FUNCTION storage.foldername(name text) TO postgres;


--
-- Name: TABLE audit_log_entries; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.audit_log_entries TO dashboard_user;
GRANT ALL ON TABLE auth.audit_log_entries TO postgres;


--
-- Name: TABLE identities; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.identities TO postgres;
GRANT ALL ON TABLE auth.identities TO dashboard_user;


--
-- Name: TABLE instances; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.instances TO dashboard_user;
GRANT ALL ON TABLE auth.instances TO postgres;


--
-- Name: TABLE refresh_tokens; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.refresh_tokens TO dashboard_user;
GRANT ALL ON TABLE auth.refresh_tokens TO postgres;


--
-- Name: SEQUENCE refresh_tokens_id_seq; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO dashboard_user;
GRANT ALL ON SEQUENCE auth.refresh_tokens_id_seq TO postgres;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.schema_migrations TO dashboard_user;
GRANT ALL ON TABLE auth.schema_migrations TO postgres;


--
-- Name: TABLE users; Type: ACL; Schema: auth; Owner: supabase_auth_admin
--

GRANT ALL ON TABLE auth.users TO dashboard_user;
GRANT ALL ON TABLE auth.users TO postgres;


--
-- Name: TABLE pg_stat_statements; Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON TABLE extensions.pg_stat_statements TO dashboard_user;


--
-- Name: TABLE pg_stat_statements_info; Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON TABLE extensions.pg_stat_statements_info TO dashboard_user;


--
-- Name: TABLE introspection_query_cache; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON TABLE graphql.introspection_query_cache TO postgres;


--
-- Name: TABLE schema_version; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON TABLE graphql.schema_version TO postgres;
GRANT ALL ON TABLE graphql.schema_version TO anon;
GRANT ALL ON TABLE graphql.schema_version TO authenticated;
GRANT ALL ON TABLE graphql.schema_version TO service_role;


--
-- Name: SEQUENCE seq_schema_version; Type: ACL; Schema: graphql; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE graphql.seq_schema_version TO postgres;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO anon;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO authenticated;
GRANT ALL ON SEQUENCE graphql.seq_schema_version TO service_role;


--
-- Name: TABLE boulder_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.boulder_likes TO anon;
GRANT ALL ON TABLE public.boulder_likes TO authenticated;
GRANT ALL ON TABLE public.boulder_likes TO service_role;


--
-- Name: TABLE boulders; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.boulders TO anon;
GRANT ALL ON TABLE public.boulders TO authenticated;
GRANT ALL ON TABLE public.boulders TO service_role;


--
-- Name: TABLE boulders_with_like; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.boulders_with_like TO anon;
GRANT ALL ON TABLE public.boulders_with_like TO authenticated;
GRANT ALL ON TABLE public.boulders_with_like TO service_role;


--
-- Name: TABLE images; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.images TO anon;
GRANT ALL ON TABLE public.images TO authenticated;
GRANT ALL ON TABLE public.images TO service_role;


--
-- Name: TABLE lines; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.lines TO anon;
GRANT ALL ON TABLE public.lines TO authenticated;
GRANT ALL ON TABLE public.lines TO service_role;


--
-- Name: TABLE managers; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.managers TO anon;
GRANT ALL ON TABLE public.managers TO authenticated;
GRANT ALL ON TABLE public.managers TO service_role;


--
-- Name: TABLE parkings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.parkings TO anon;
GRANT ALL ON TABLE public.parkings TO authenticated;
GRANT ALL ON TABLE public.parkings TO service_role;


--
-- Name: TABLE sectors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sectors TO anon;
GRANT ALL ON TABLE public.sectors TO authenticated;
GRANT ALL ON TABLE public.sectors TO service_role;


--
-- Name: TABLE topo_accesses; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.topo_accesses TO anon;
GRANT ALL ON TABLE public.topo_accesses TO authenticated;
GRANT ALL ON TABLE public.topo_accesses TO service_role;


--
-- Name: TABLE topo_contributors; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.topo_contributors TO anon;
GRANT ALL ON TABLE public.topo_contributors TO authenticated;
GRANT ALL ON TABLE public.topo_contributors TO service_role;


--
-- Name: TABLE topo_likes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.topo_likes TO anon;
GRANT ALL ON TABLE public.topo_likes TO authenticated;
GRANT ALL ON TABLE public.topo_likes TO service_role;


--
-- Name: TABLE topos_with_like; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.topos_with_like TO anon;
GRANT ALL ON TABLE public.topos_with_like TO authenticated;
GRANT ALL ON TABLE public.topos_with_like TO service_role;


--
-- Name: TABLE track_ratings; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.track_ratings TO anon;
GRANT ALL ON TABLE public.track_ratings TO authenticated;
GRANT ALL ON TABLE public.track_ratings TO service_role;


--
-- Name: TABLE tracks; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tracks TO anon;
GRANT ALL ON TABLE public.tracks TO authenticated;
GRANT ALL ON TABLE public.tracks TO service_role;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO anon;
GRANT ALL ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO service_role;


--
-- Name: TABLE waypoints; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.waypoints TO anon;
GRANT ALL ON TABLE public.waypoints TO authenticated;
GRANT ALL ON TABLE public.waypoints TO service_role;


--
-- Name: TABLE schema_migrations; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.schema_migrations TO postgres;
GRANT ALL ON TABLE realtime.schema_migrations TO dashboard_user;


--
-- Name: TABLE subscription; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON TABLE realtime.subscription TO postgres;
GRANT ALL ON TABLE realtime.subscription TO dashboard_user;


--
-- Name: SEQUENCE subscription_id_seq; Type: ACL; Schema: realtime; Owner: supabase_admin
--

GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO postgres;
GRANT ALL ON SEQUENCE realtime.subscription_id_seq TO dashboard_user;


--
-- Name: TABLE buckets; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.buckets TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT ALL ON TABLE storage.buckets TO service_role;
GRANT ALL ON TABLE storage.buckets TO postgres;


--
-- Name: TABLE migrations; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.migrations TO anon;
GRANT ALL ON TABLE storage.migrations TO authenticated;
GRANT ALL ON TABLE storage.migrations TO service_role;
GRANT ALL ON TABLE storage.migrations TO postgres;


--
-- Name: TABLE objects; Type: ACL; Schema: storage; Owner: supabase_storage_admin
--

GRANT ALL ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT ALL ON TABLE storage.objects TO service_role;
GRANT ALL ON TABLE storage.objects TO postgres;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: auth; Owner: supabase_auth_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_auth_admin IN SCHEMA auth GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql_public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA graphql_public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON SEQUENCES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON FUNCTIONS  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: realtime; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA realtime GRANT ALL ON TABLES  TO dashboard_user;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON SEQUENCES  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON FUNCTIONS  TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: storage; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA storage GRANT ALL ON TABLES  TO service_role;


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_graphql_placeholder ON sql_drop
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION extensions.set_graphql_placeholder();


ALTER EVENT TRIGGER issue_graphql_placeholder OWNER TO supabase_admin;

--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_cron_access ON ddl_command_end
         WHEN TAG IN ('CREATE SCHEMA')
   EXECUTE FUNCTION extensions.grant_pg_cron_access();


ALTER EVENT TRIGGER issue_pg_cron_access OWNER TO postgres;

--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER issue_pg_graphql_access ON ddl_command_end
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION extensions.grant_pg_graphql_access();


ALTER EVENT TRIGGER issue_pg_graphql_access OWNER TO supabase_admin;

--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: postgres
--

CREATE EVENT TRIGGER issue_pg_net_access ON ddl_command_end
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION extensions.grant_pg_net_access();


ALTER EVENT TRIGGER issue_pg_net_access OWNER TO postgres;

--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_ddl_watch ON ddl_command_end
   EXECUTE FUNCTION extensions.pgrst_ddl_watch();


ALTER EVENT TRIGGER pgrst_ddl_watch OWNER TO supabase_admin;

--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: supabase_admin
--

CREATE EVENT TRIGGER pgrst_drop_watch ON sql_drop
   EXECUTE FUNCTION extensions.pgrst_drop_watch();


ALTER EVENT TRIGGER pgrst_drop_watch OWNER TO supabase_admin;

--
-- PostgreSQL database dump complete
--

