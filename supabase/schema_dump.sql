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

CREATE EXTENSION IF NOT EXISTS pg_graphql WITH SCHEMA extensions;


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
-- Name: plv8; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plv8 WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plv8; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plv8 IS 'PL/JavaScript (v8) trusted procedural language';


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
	ratio double precision,
	placeholder text
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
-- Name: check_user_update(); Type: FUNCTION; Schema: internal; Owner: postgres
--

CREATE FUNCTION internal.check_user_update() RETURNS trigger
    LANGUAGE plpgsql STABLE
    AS $$
begin
	if old.role <> new.role then
		raise exception 'Role changes have to be done by a system administrator';
	end if;
	
	if old.email <> new.email then
		raise exception 'Email changes have to be done through the authentication system';
	end if;

	return new;
end;
$$;


ALTER FUNCTION internal.check_user_update() OWNER TO postgres;

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
        select (step.image).id as id, 1 as users, (step.image).ratio, (step.image).placeholder
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

    -- Basically insert + delete
    insert into public.images
        select (step.image).id as id, 1 as users, (step.image).ratio, (step.image).placeholder
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
        select img.id as id, 1 as users, img.ratio, img.placeholder
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
    insert into public.images
        select img.id as id, 1 as users, img.ratio, img.placeholder
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

		if new.status <> old.status then
			if new.status = 0 then
				new.submitted = null;
				new.validated = null;
			elsif new.status = 1 then
				new.submitted = now();
				new.validated = null;
			elsif new.status = 2 then
			 	new.submitted = old.submitted;
				new.validated = now();
			end if;
		else
			new.submitted = old.submitted;
			new.validated = old.validated;
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
    insert into public.images (id, ratio, placeholder, users)
    values 
        (_image.id, _image.ratio, _image.placeholder, 1)
    on conflict (id)
    do update set
        users = images.users + 1;
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
-- Name: get_contributor_topos(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.get_contributor_topos(_user_id uuid) RETURNS SETOF public.light_topo
    LANGUAGE sql STABLE
    AS $$
	select t.*
	from topo_contributors tc
	join light_topos t on t.id = tc.topo_id
	where tc.user_id = _user_id;
$$;


ALTER FUNCTION public.get_contributor_topos(_user_id uuid) OWNER TO postgres;

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
        from accounts
        where
            accounts.id = _user_id and
            accounts.role = 'ADMIN'
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
-- Name: plv8ify_createdoc(double precision); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.plv8ify_createdoc(x double precision) RETURNS jsonb
    LANGUAGE plv8 IMMUTABLE STRICT
    AS $_$
"use strict";
var plv8ify = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from2, except, desc) => {
    if (from2 && typeof from2 === "object" || typeof from2 === "function") {
      for (let key of __getOwnPropNames(from2))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // input.ts
  var input_exports = {};
  __export(input_exports, {
    createDoc: () => createDoc
  });

  // node_modules/lib0/map.js
  var create = () => /* @__PURE__ */ new Map();
  var copy = (m) => {
    const r = create();
    m.forEach((v, k) => {
      r.set(k, v);
    });
    return r;
  };
  var setIfUndefined = (map2, key, createT) => {
    let set = map2.get(key);
    if (set === void 0) {
      map2.set(key, set = createT());
    }
    return set;
  };
  var map = (m, f) => {
    const res = [];
    for (const [key, value] of m) {
      res.push(f(value, key));
    }
    return res;
  };
  var any = (m, f) => {
    for (const [key, value] of m) {
      if (f(value, key)) {
        return true;
      }
    }
    return false;
  };

  // node_modules/lib0/set.js
  var create2 = () => /* @__PURE__ */ new Set();

  // node_modules/lib0/array.js
  var last = (arr) => arr[arr.length - 1];
  var from = Array.from;
  var isArray = Array.isArray;

  // node_modules/lib0/observable.js
  var Observable = class {
    constructor() {
      this._observers = create();
    }
    on(name, f) {
      setIfUndefined(this._observers, name, create2).add(f);
    }
    once(name, f) {
      const _f = (...args2) => {
        this.off(name, _f);
        f(...args2);
      };
      this.on(name, _f);
    }
    off(name, f) {
      const observers = this._observers.get(name);
      if (observers !== void 0) {
        observers.delete(f);
        if (observers.size === 0) {
          this._observers.delete(name);
        }
      }
    }
    emit(name, args2) {
      return from((this._observers.get(name) || create()).values()).forEach((f) => f(...args2));
    }
    destroy() {
      this._observers = create();
    }
  };

  // node_modules/lib0/math.js
  var floor = Math.floor;
  var abs = Math.abs;
  var min = (a, b) => a < b ? a : b;
  var max = (a, b) => a > b ? a : b;
  var isNaN = Number.isNaN;
  var isNegativeZero = (n) => n !== 0 ? n < 0 : 1 / n < 0;

  // node_modules/lib0/string.js
  var fromCharCode = String.fromCharCode;
  var fromCodePoint = String.fromCodePoint;
  var toLowerCase = (s) => s.toLowerCase();
  var trimLeftRegex = /^\s*/g;
  var trimLeft = (s) => s.replace(trimLeftRegex, "");
  var fromCamelCaseRegex = /([A-Z])/g;
  var fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, (match) => `${separator}${toLowerCase(match)}`));
  var utf8TextEncoder = typeof TextEncoder !== "undefined" ? new TextEncoder() : null;
  var utf8TextDecoder = typeof TextDecoder === "undefined" ? null : new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
    utf8TextDecoder = null;
  }

  // node_modules/lib0/conditions.js
  var undefinedToNull = (v) => v === void 0 ? null : v;

  // node_modules/lib0/storage.js
  var VarStoragePolyfill = class {
    constructor() {
      this.map = /* @__PURE__ */ new Map();
    }
    setItem(key, newValue) {
      this.map.set(key, newValue);
    }
    getItem(key) {
      return this.map.get(key);
    }
  };
  var _localStorage = new VarStoragePolyfill();
  var usePolyfill = true;
  try {
    if (typeof localStorage !== "undefined") {
      _localStorage = localStorage;
      usePolyfill = false;
    }
  } catch (e) {
  }
  var varStorage = _localStorage;

  // node_modules/lib0/environment.js
  var isNode = typeof process !== "undefined" && process.release && /node|io\.js/.test(process.release.name);
  var isMac = typeof navigator !== "undefined" ? /Mac/.test(navigator.platform) : false;
  var params;
  var args = [];
  var computeParams = () => {
    if (params === void 0) {
      if (isNode) {
        params = create();
        const pargs = process.argv;
        let currParamName = null;
        for (let i = 0; i < pargs.length; i++) {
          const parg = pargs[i];
          if (parg[0] === "-") {
            if (currParamName !== null) {
              params.set(currParamName, "");
            }
            currParamName = parg;
          } else {
            if (currParamName !== null) {
              params.set(currParamName, parg);
              currParamName = null;
            } else {
              args.push(parg);
            }
          }
        }
        if (currParamName !== null) {
          params.set(currParamName, "");
        }
      } else if (typeof location === "object") {
        params = create();
        (location.search || "?").slice(1).split("&").forEach((kv) => {
          if (kv.length !== 0) {
            const [key, value] = kv.split("=");
            params.set(`--${fromCamelCase(key, "-")}`, value);
            params.set(`-${fromCamelCase(key, "-")}`, value);
          }
        });
      } else {
        params = create();
      }
    }
    return params;
  };
  var hasParam = (name) => computeParams().has(name);
  var getVariable = (name) => isNode ? undefinedToNull(process.env[name.toUpperCase()]) : undefinedToNull(varStorage.getItem(name));
  var hasConf = (name) => hasParam("--" + name) || getVariable(name) !== null;
  var production = hasConf("production");

  // node_modules/lib0/binary.js
  var BIT1 = 1;
  var BIT2 = 2;
  var BIT3 = 4;
  var BIT4 = 8;
  var BIT6 = 32;
  var BIT7 = 64;
  var BIT8 = 128;
  var BIT18 = 1 << 17;
  var BIT19 = 1 << 18;
  var BIT20 = 1 << 19;
  var BIT21 = 1 << 20;
  var BIT22 = 1 << 21;
  var BIT23 = 1 << 22;
  var BIT24 = 1 << 23;
  var BIT25 = 1 << 24;
  var BIT26 = 1 << 25;
  var BIT27 = 1 << 26;
  var BIT28 = 1 << 27;
  var BIT29 = 1 << 28;
  var BIT30 = 1 << 29;
  var BIT31 = 1 << 30;
  var BIT32 = 1 << 31;
  var BITS5 = 31;
  var BITS6 = 63;
  var BITS7 = 127;
  var BITS17 = BIT18 - 1;
  var BITS18 = BIT19 - 1;
  var BITS19 = BIT20 - 1;
  var BITS20 = BIT21 - 1;
  var BITS21 = BIT22 - 1;
  var BITS22 = BIT23 - 1;
  var BITS23 = BIT24 - 1;
  var BITS24 = BIT25 - 1;
  var BITS25 = BIT26 - 1;
  var BITS26 = BIT27 - 1;
  var BITS27 = BIT28 - 1;
  var BITS28 = BIT29 - 1;
  var BITS29 = BIT30 - 1;
  var BITS30 = BIT31 - 1;
  var BITS31 = 2147483647;

  // node_modules/lib0/buffer.js
  var createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length3) => new Uint8Array(buffer, byteOffset, length3);

  // node_modules/lib0/number.js
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  var MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;
  var LOWEST_INT32 = 1 << 31;
  var isInteger = Number.isInteger || ((num) => typeof num === "number" && isFinite(num) && floor(num) === num);
  var isNaN2 = Number.isNaN;
  var parseInt = Number.parseInt;

  // node_modules/lib0/encoding.js
  var Encoder = class {
    constructor() {
      this.cpos = 0;
      this.cbuf = new Uint8Array(100);
      this.bufs = [];
    }
  };
  var createEncoder = () => new Encoder();
  var length = (encoder) => {
    let len = encoder.cpos;
    for (let i = 0; i < encoder.bufs.length; i++) {
      len += encoder.bufs[i].length;
    }
    return len;
  };
  var toUint8Array = (encoder) => {
    const uint8arr = new Uint8Array(length(encoder));
    let curPos = 0;
    for (let i = 0; i < encoder.bufs.length; i++) {
      const d = encoder.bufs[i];
      uint8arr.set(d, curPos);
      curPos += d.length;
    }
    uint8arr.set(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
    return uint8arr;
  };
  var verifyLen = (encoder, len) => {
    const bufferLen = encoder.cbuf.length;
    if (bufferLen - encoder.cpos < len) {
      encoder.bufs.push(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos));
      encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
      encoder.cpos = 0;
    }
  };
  var write = (encoder, num) => {
    const bufferLen = encoder.cbuf.length;
    if (encoder.cpos === bufferLen) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(bufferLen * 2);
      encoder.cpos = 0;
    }
    encoder.cbuf[encoder.cpos++] = num;
  };
  var writeUint8 = write;
  var writeVarUint = (encoder, num) => {
    while (num > BITS7) {
      write(encoder, BIT8 | BITS7 & num);
      num >>>= 7;
    }
    write(encoder, BITS7 & num);
  };
  var writeVarInt = (encoder, num) => {
    const isNegative = isNegativeZero(num);
    if (isNegative) {
      num = -num;
    }
    write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | BITS6 & num);
    num >>>= 6;
    while (num > 0) {
      write(encoder, (num > BITS7 ? BIT8 : 0) | BITS7 & num);
      num >>>= 7;
    }
  };
  var writeVarString = (encoder, str) => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    writeVarUint(encoder, len);
    for (let i = 0; i < len; i++) {
      write(encoder, encodedString.codePointAt(i));
    }
  };
  var writeUint8Array = (encoder, uint8Array) => {
    const bufferLen = encoder.cbuf.length;
    const cpos = encoder.cpos;
    const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
    const rightCopyLen = uint8Array.length - leftCopyLen;
    encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
    encoder.cpos += leftCopyLen;
    if (rightCopyLen > 0) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
      encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
      encoder.cpos = rightCopyLen;
    }
  };
  var writeVarUint8Array = (encoder, uint8Array) => {
    writeVarUint(encoder, uint8Array.byteLength);
    writeUint8Array(encoder, uint8Array);
  };
  var writeOnDataView = (encoder, len) => {
    verifyLen(encoder, len);
    const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
    encoder.cpos += len;
    return dview;
  };
  var writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);
  var writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);
  var writeBigInt64 = (encoder, num) => writeOnDataView(encoder, 8).setBigInt64(0, num, false);
  var floatTestBed = new DataView(new ArrayBuffer(4));
  var isFloat32 = (num) => {
    floatTestBed.setFloat32(0, num);
    return floatTestBed.getFloat32(0) === num;
  };
  var writeAny = (encoder, data) => {
    switch (typeof data) {
      case "string":
        write(encoder, 119);
        writeVarString(encoder, data);
        break;
      case "number":
        if (isInteger(data) && abs(data) <= BITS31) {
          write(encoder, 125);
          writeVarInt(encoder, data);
        } else if (isFloat32(data)) {
          write(encoder, 124);
          writeFloat32(encoder, data);
        } else {
          write(encoder, 123);
          writeFloat64(encoder, data);
        }
        break;
      case "bigint":
        write(encoder, 122);
        writeBigInt64(encoder, data);
        break;
      case "object":
        if (data === null) {
          write(encoder, 126);
        } else if (data instanceof Array) {
          write(encoder, 117);
          writeVarUint(encoder, data.length);
          for (let i = 0; i < data.length; i++) {
            writeAny(encoder, data[i]);
          }
        } else if (data instanceof Uint8Array) {
          write(encoder, 116);
          writeVarUint8Array(encoder, data);
        } else {
          write(encoder, 118);
          const keys2 = Object.keys(data);
          writeVarUint(encoder, keys2.length);
          for (let i = 0; i < keys2.length; i++) {
            const key = keys2[i];
            writeVarString(encoder, key);
            writeAny(encoder, data[key]);
          }
        }
        break;
      case "boolean":
        write(encoder, data ? 120 : 121);
        break;
      default:
        write(encoder, 127);
    }
  };
  var RleEncoder = class extends Encoder {
    constructor(writer) {
      super();
      this.w = writer;
      this.s = null;
      this.count = 0;
    }
    write(v) {
      if (this.s === v) {
        this.count++;
      } else {
        if (this.count > 0) {
          writeVarUint(this, this.count - 1);
        }
        this.count = 1;
        this.w(this, v);
        this.s = v;
      }
    }
  };
  var flushUintOptRleEncoder = (encoder) => {
    if (encoder.count > 0) {
      writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2);
      }
    }
  };
  var UintOptRleEncoder = class {
    constructor() {
      this.encoder = new Encoder();
      this.s = 0;
      this.count = 0;
    }
    write(v) {
      if (this.s === v) {
        this.count++;
      } else {
        flushUintOptRleEncoder(this);
        this.count = 1;
        this.s = v;
      }
    }
    toUint8Array() {
      flushUintOptRleEncoder(this);
      return toUint8Array(this.encoder);
    }
  };
  var flushIntDiffOptRleEncoder = (encoder) => {
    if (encoder.count > 0) {
      const encodedDiff = encoder.diff << 1 | (encoder.count === 1 ? 0 : 1);
      writeVarInt(encoder.encoder, encodedDiff);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2);
      }
    }
  };
  var IntDiffOptRleEncoder = class {
    constructor() {
      this.encoder = new Encoder();
      this.s = 0;
      this.count = 0;
      this.diff = 0;
    }
    write(v) {
      if (this.diff === v - this.s) {
        this.s = v;
        this.count++;
      } else {
        flushIntDiffOptRleEncoder(this);
        this.count = 1;
        this.diff = v - this.s;
        this.s = v;
      }
    }
    toUint8Array() {
      flushIntDiffOptRleEncoder(this);
      return toUint8Array(this.encoder);
    }
  };
  var StringEncoder = class {
    constructor() {
      this.sarr = [];
      this.s = "";
      this.lensE = new UintOptRleEncoder();
    }
    write(string) {
      this.s += string;
      if (this.s.length > 19) {
        this.sarr.push(this.s);
        this.s = "";
      }
      this.lensE.write(string.length);
    }
    toUint8Array() {
      const encoder = new Encoder();
      this.sarr.push(this.s);
      this.s = "";
      writeVarString(encoder, this.sarr.join(""));
      writeUint8Array(encoder, this.lensE.toUint8Array());
      return toUint8Array(encoder);
    }
  };

  // node_modules/isomorphic.js/browser.mjs
  var performance = typeof window === "undefined" ? null : typeof window.performance !== "undefined" && window.performance || null;
  var isoCrypto = typeof crypto === "undefined" ? null : crypto;
  var cryptoRandomBuffer = isoCrypto !== null ? (len) => {
    const buf = new ArrayBuffer(len);
    const arr = new Uint8Array(buf);
    isoCrypto.getRandomValues(arr);
    return buf;
  } : (len) => {
    const buf = new ArrayBuffer(len);
    const arr = new Uint8Array(buf);
    for (let i = 0; i < len; i++) {
      arr[i] = Math.ceil(Math.random() * 4294967295 >>> 0);
    }
    return buf;
  };

  // node_modules/lib0/random.js
  var uint32 = () => new Uint32Array(cryptoRandomBuffer(4))[0];
  var uuidv4Template = [1e7] + -1e3 + -4e3 + -8e3 + -1e11;
  var uuidv4 = () => uuidv4Template.replace(/[018]/g, (c) => (c ^ uint32() & 15 >> c / 4).toString(16));

  // node_modules/lib0/time.js
  var getUnixTime = Date.now;

  // node_modules/lib0/promise.js
  var create3 = (f) => new Promise(f);

  // node_modules/lib0/error.js
  var create4 = (s) => new Error(s);
  var methodUnimplemented = () => {
    throw create4("Method unimplemented");
  };
  var unexpectedCase = () => {
    throw create4("Unexpected case");
  };

  // node_modules/lib0/object.js
  var keys = Object.keys;
  var length2 = (obj) => keys(obj).length;
  var every = (obj, f) => {
    for (const key in obj) {
      if (!f(obj[key], key)) {
        return false;
      }
    }
    return true;
  };
  var hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  var equalFlat = (a, b) => a === b || length2(a) === length2(b) && every(a, (val, key) => (val !== void 0 || hasProperty(b, key)) && b[key] === val);

  // node_modules/lib0/function.js
  var callAll = (fs, args2, i = 0) => {
    try {
      for (; i < fs.length; i++) {
        fs[i](...args2);
      }
    } finally {
      if (i < fs.length) {
        callAll(fs, args2, i + 1);
      }
    }
  };

  // node_modules/lib0/symbol.js
  var create5 = Symbol;

  // node_modules/lib0/pair.js
  var Pair = class {
    constructor(left, right) {
      this.left = left;
      this.right = right;
    }
  };
  var create6 = (left, right) => new Pair(left, right);

  // node_modules/lib0/dom.js
  var doc = typeof document !== "undefined" ? document : {};
  var domParser = typeof DOMParser !== "undefined" ? new DOMParser() : null;
  var mapToStyleString = (m) => map(m, (value, key) => `${key}:${value};`).join("");
  var ELEMENT_NODE = doc.ELEMENT_NODE;
  var TEXT_NODE = doc.TEXT_NODE;
  var CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
  var COMMENT_NODE = doc.COMMENT_NODE;
  var DOCUMENT_NODE = doc.DOCUMENT_NODE;
  var DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
  var DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;

  // node_modules/lib0/logging.js
  var BOLD = create5();
  var UNBOLD = create5();
  var BLUE = create5();
  var GREY = create5();
  var GREEN = create5();
  var RED = create5();
  var PURPLE = create5();
  var ORANGE = create5();
  var UNCOLOR = create5();
  var _browserStyleMap = {
    [BOLD]: create6("font-weight", "bold"),
    [UNBOLD]: create6("font-weight", "normal"),
    [BLUE]: create6("color", "blue"),
    [GREEN]: create6("color", "green"),
    [GREY]: create6("color", "grey"),
    [RED]: create6("color", "red"),
    [PURPLE]: create6("color", "purple"),
    [ORANGE]: create6("color", "orange"),
    [UNCOLOR]: create6("color", "black")
  };
  var _nodeStyleMap = {
    [BOLD]: "\x1B[1m",
    [UNBOLD]: "\x1B[2m",
    [BLUE]: "\x1B[34m",
    [GREEN]: "\x1B[32m",
    [GREY]: "\x1B[37m",
    [RED]: "\x1B[31m",
    [PURPLE]: "\x1B[35m",
    [ORANGE]: "\x1B[38;5;208m",
    [UNCOLOR]: "\x1B[0m"
  };
  var computeBrowserLoggingArgs = (args2) => {
    const strBuilder = [];
    const styles = [];
    const currentStyle = create();
    let logArgs = [];
    let i = 0;
    for (; i < args2.length; i++) {
      const arg = args2[i];
      const style = _browserStyleMap[arg];
      if (style !== void 0) {
        currentStyle.set(style.left, style.right);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          const style2 = mapToStyleString(currentStyle);
          if (i > 0 || style2.length > 0) {
            strBuilder.push("%c" + arg);
            styles.push(style2);
          } else {
            strBuilder.push(arg);
          }
        } else {
          break;
        }
      }
    }
    if (i > 0) {
      logArgs = styles;
      logArgs.unshift(strBuilder.join(""));
    }
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs;
  };
  var computeNodeLoggingArgs = (args2) => {
    const strBuilder = [];
    const logArgs = [];
    let i = 0;
    for (; i < args2.length; i++) {
      const arg = args2[i];
      const style = _nodeStyleMap[arg];
      if (style !== void 0) {
        strBuilder.push(style);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          strBuilder.push(arg);
        } else {
          break;
        }
      }
    }
    if (i > 0) {
      strBuilder.push("\x1B[0m");
      logArgs.push(strBuilder.join(""));
    }
    for (; i < args2.length; i++) {
      const arg = args2[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs;
  };
  var computeLoggingArgs = isNode ? computeNodeLoggingArgs : computeBrowserLoggingArgs;
  var print = (...args2) => {
    console.log(...computeLoggingArgs(args2));
    vconsoles.forEach((vc) => vc.print(args2));
  };
  var vconsoles = /* @__PURE__ */ new Set();
  var lastLoggingTime = getUnixTime();

  // node_modules/lib0/iterator.js
  var createIterator = (next) => ({
    [Symbol.iterator]() {
      return this;
    },
    next
  });
  var iteratorFilter = (iterator, filter) => createIterator(() => {
    let res;
    do {
      res = iterator.next();
    } while (!res.done && !filter(res.value));
    return res;
  });
  var iteratorMap = (iterator, fmap) => createIterator(() => {
    const { done, value } = iterator.next();
    return { done, value: done ? void 0 : fmap(value) };
  });

  // node_modules/yjs/dist/yjs.mjs
  var DeleteItem = class {
    constructor(clock, len) {
      this.clock = clock;
      this.len = len;
    }
  };
  var DeleteSet = class {
    constructor() {
      this.clients = /* @__PURE__ */ new Map();
    }
  };
  var iterateDeletedStructs = (transaction, ds, f) => ds.clients.forEach((deletes, clientid) => {
    const structs = transaction.doc.store.clients.get(clientid);
    for (let i = 0; i < deletes.length; i++) {
      const del = deletes[i];
      iterateStructs(transaction, structs, del.clock, del.len, f);
    }
  });
  var findIndexDS = (dis, clock) => {
    let left = 0;
    let right = dis.length - 1;
    while (left <= right) {
      const midindex = floor((left + right) / 2);
      const mid = dis[midindex];
      const midclock = mid.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.len) {
          return midindex;
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
    }
    return null;
  };
  var isDeleted = (ds, id) => {
    const dis = ds.clients.get(id.client);
    return dis !== void 0 && findIndexDS(dis, id.clock) !== null;
  };
  var sortAndMergeDeleteSet = (ds) => {
    ds.clients.forEach((dels) => {
      dels.sort((a, b) => a.clock - b.clock);
      let i, j;
      for (i = 1, j = 1; i < dels.length; i++) {
        const left = dels[j - 1];
        const right = dels[i];
        if (left.clock + left.len >= right.clock) {
          left.len = max(left.len, right.clock + right.len - left.clock);
        } else {
          if (j < i) {
            dels[j] = right;
          }
          j++;
        }
      }
      dels.length = j;
    });
  };
  var addToDeleteSet = (ds, client, clock, length3) => {
    setIfUndefined(ds.clients, client, () => []).push(new DeleteItem(clock, length3));
  };
  var createDeleteSet = () => new DeleteSet();
  var writeDeleteSet = (encoder, ds) => {
    writeVarUint(encoder.restEncoder, ds.clients.size);
    ds.clients.forEach((dsitems, client) => {
      encoder.resetDsCurVal();
      writeVarUint(encoder.restEncoder, client);
      const len = dsitems.length;
      writeVarUint(encoder.restEncoder, len);
      for (let i = 0; i < len; i++) {
        const item = dsitems[i];
        encoder.writeDsClock(item.clock);
        encoder.writeDsLen(item.len);
      }
    });
  };
  var generateNewClientId = uint32;
  var Doc = class extends Observable {
    constructor({ guid = uuidv4(), collectionid = null, gc = true, gcFilter = () => true, meta = null, autoLoad = false, shouldLoad = true } = {}) {
      super();
      this.gc = gc;
      this.gcFilter = gcFilter;
      this.clientID = generateNewClientId();
      this.guid = guid;
      this.collectionid = collectionid;
      this.share = /* @__PURE__ */ new Map();
      this.store = new StructStore();
      this._transaction = null;
      this._transactionCleanups = [];
      this.subdocs = /* @__PURE__ */ new Set();
      this._item = null;
      this.shouldLoad = shouldLoad;
      this.autoLoad = autoLoad;
      this.meta = meta;
      this.isLoaded = false;
      this.whenLoaded = create3((resolve) => {
        this.on("load", () => {
          this.isLoaded = true;
          resolve(this);
        });
      });
    }
    load() {
      const item = this._item;
      if (item !== null && !this.shouldLoad) {
        transact(item.parent.doc, (transaction) => {
          transaction.subdocsLoaded.add(this);
        }, null, true);
      }
      this.shouldLoad = true;
    }
    getSubdocs() {
      return this.subdocs;
    }
    getSubdocGuids() {
      return new Set(Array.from(this.subdocs).map((doc2) => doc2.guid));
    }
    transact(f, origin = null) {
      transact(this, f, origin);
    }
    get(name, TypeConstructor = AbstractType) {
      const type = setIfUndefined(this.share, name, () => {
        const t = new TypeConstructor();
        t._integrate(this, null);
        return t;
      });
      const Constr = type.constructor;
      if (TypeConstructor !== AbstractType && Constr !== TypeConstructor) {
        if (Constr === AbstractType) {
          const t = new TypeConstructor();
          t._map = type._map;
          type._map.forEach((n) => {
            for (; n !== null; n = n.left) {
              n.parent = t;
            }
          });
          t._start = type._start;
          for (let n = t._start; n !== null; n = n.right) {
            n.parent = t;
          }
          t._length = type._length;
          this.share.set(name, t);
          t._integrate(this, null);
          return t;
        } else {
          throw new Error(`Type with the name ${name} has already been defined with a different constructor`);
        }
      }
      return type;
    }
    getArray(name = "") {
      return this.get(name, YArray);
    }
    getText(name = "") {
      return this.get(name, YText);
    }
    getMap(name = "") {
      return this.get(name, YMap);
    }
    getXmlFragment(name = "") {
      return this.get(name, YXmlFragment);
    }
    toJSON() {
      const doc2 = {};
      this.share.forEach((value, key) => {
        doc2[key] = value.toJSON();
      });
      return doc2;
    }
    destroy() {
      from(this.subdocs).forEach((subdoc) => subdoc.destroy());
      const item = this._item;
      if (item !== null) {
        this._item = null;
        const content = item.content;
        content.doc = new Doc(__spreadProps(__spreadValues({ guid: this.guid }, content.opts), { shouldLoad: false }));
        content.doc._item = item;
        transact(item.parent.doc, (transaction) => {
          const doc2 = content.doc;
          if (!item.deleted) {
            transaction.subdocsAdded.add(doc2);
          }
          transaction.subdocsRemoved.add(this);
        }, null, true);
      }
      this.emit("destroyed", [true]);
      this.emit("destroy", [this]);
      super.destroy();
    }
    on(eventName, f) {
      super.on(eventName, f);
    }
    off(eventName, f) {
      super.off(eventName, f);
    }
  };
  var DSEncoderV1 = class {
    constructor() {
      this.restEncoder = createEncoder();
    }
    toUint8Array() {
      return toUint8Array(this.restEncoder);
    }
    resetDsCurVal() {
    }
    writeDsClock(clock) {
      writeVarUint(this.restEncoder, clock);
    }
    writeDsLen(len) {
      writeVarUint(this.restEncoder, len);
    }
  };
  var UpdateEncoderV1 = class extends DSEncoderV1 {
    writeLeftID(id) {
      writeVarUint(this.restEncoder, id.client);
      writeVarUint(this.restEncoder, id.clock);
    }
    writeRightID(id) {
      writeVarUint(this.restEncoder, id.client);
      writeVarUint(this.restEncoder, id.clock);
    }
    writeClient(client) {
      writeVarUint(this.restEncoder, client);
    }
    writeInfo(info) {
      writeUint8(this.restEncoder, info);
    }
    writeString(s) {
      writeVarString(this.restEncoder, s);
    }
    writeParentInfo(isYKey) {
      writeVarUint(this.restEncoder, isYKey ? 1 : 0);
    }
    writeTypeRef(info) {
      writeVarUint(this.restEncoder, info);
    }
    writeLen(len) {
      writeVarUint(this.restEncoder, len);
    }
    writeAny(any2) {
      writeAny(this.restEncoder, any2);
    }
    writeBuf(buf) {
      writeVarUint8Array(this.restEncoder, buf);
    }
    writeJSON(embed) {
      writeVarString(this.restEncoder, JSON.stringify(embed));
    }
    writeKey(key) {
      writeVarString(this.restEncoder, key);
    }
  };
  var DSEncoderV2 = class {
    constructor() {
      this.restEncoder = createEncoder();
      this.dsCurrVal = 0;
    }
    toUint8Array() {
      return toUint8Array(this.restEncoder);
    }
    resetDsCurVal() {
      this.dsCurrVal = 0;
    }
    writeDsClock(clock) {
      const diff = clock - this.dsCurrVal;
      this.dsCurrVal = clock;
      writeVarUint(this.restEncoder, diff);
    }
    writeDsLen(len) {
      if (len === 0) {
        unexpectedCase();
      }
      writeVarUint(this.restEncoder, len - 1);
      this.dsCurrVal += len;
    }
  };
  var UpdateEncoderV2 = class extends DSEncoderV2 {
    constructor() {
      super();
      this.keyMap = /* @__PURE__ */ new Map();
      this.keyClock = 0;
      this.keyClockEncoder = new IntDiffOptRleEncoder();
      this.clientEncoder = new UintOptRleEncoder();
      this.leftClockEncoder = new IntDiffOptRleEncoder();
      this.rightClockEncoder = new IntDiffOptRleEncoder();
      this.infoEncoder = new RleEncoder(writeUint8);
      this.stringEncoder = new StringEncoder();
      this.parentInfoEncoder = new RleEncoder(writeUint8);
      this.typeRefEncoder = new UintOptRleEncoder();
      this.lenEncoder = new UintOptRleEncoder();
    }
    toUint8Array() {
      const encoder = createEncoder();
      writeVarUint(encoder, 0);
      writeVarUint8Array(encoder, this.keyClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.clientEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.leftClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.rightClockEncoder.toUint8Array());
      writeVarUint8Array(encoder, toUint8Array(this.infoEncoder));
      writeVarUint8Array(encoder, this.stringEncoder.toUint8Array());
      writeVarUint8Array(encoder, toUint8Array(this.parentInfoEncoder));
      writeVarUint8Array(encoder, this.typeRefEncoder.toUint8Array());
      writeVarUint8Array(encoder, this.lenEncoder.toUint8Array());
      writeUint8Array(encoder, toUint8Array(this.restEncoder));
      return toUint8Array(encoder);
    }
    writeLeftID(id) {
      this.clientEncoder.write(id.client);
      this.leftClockEncoder.write(id.clock);
    }
    writeRightID(id) {
      this.clientEncoder.write(id.client);
      this.rightClockEncoder.write(id.clock);
    }
    writeClient(client) {
      this.clientEncoder.write(client);
    }
    writeInfo(info) {
      this.infoEncoder.write(info);
    }
    writeString(s) {
      this.stringEncoder.write(s);
    }
    writeParentInfo(isYKey) {
      this.parentInfoEncoder.write(isYKey ? 1 : 0);
    }
    writeTypeRef(info) {
      this.typeRefEncoder.write(info);
    }
    writeLen(len) {
      this.lenEncoder.write(len);
    }
    writeAny(any2) {
      writeAny(this.restEncoder, any2);
    }
    writeBuf(buf) {
      writeVarUint8Array(this.restEncoder, buf);
    }
    writeJSON(embed) {
      writeAny(this.restEncoder, embed);
    }
    writeKey(key) {
      const clock = this.keyMap.get(key);
      if (clock === void 0) {
        this.keyClockEncoder.write(this.keyClock++);
        this.stringEncoder.write(key);
      } else {
        this.keyClockEncoder.write(clock);
      }
    }
  };
  var writeStructs = (encoder, structs, client, clock) => {
    clock = max(clock, structs[0].id.clock);
    const startNewStructs = findIndexSS(structs, clock);
    writeVarUint(encoder.restEncoder, structs.length - startNewStructs);
    encoder.writeClient(client);
    writeVarUint(encoder.restEncoder, clock);
    const firstStruct = structs[startNewStructs];
    firstStruct.write(encoder, clock - firstStruct.id.clock);
    for (let i = startNewStructs + 1; i < structs.length; i++) {
      structs[i].write(encoder, 0);
    }
  };
  var writeClientsStructs = (encoder, store, _sm) => {
    const sm = /* @__PURE__ */ new Map();
    _sm.forEach((clock, client) => {
      if (getState(store, client) > clock) {
        sm.set(client, clock);
      }
    });
    getStateVector(store).forEach((clock, client) => {
      if (!_sm.has(client)) {
        sm.set(client, 0);
      }
    });
    writeVarUint(encoder.restEncoder, sm.size);
    Array.from(sm.entries()).sort((a, b) => b[0] - a[0]).forEach(([client, clock]) => {
      writeStructs(encoder, store.clients.get(client), client, clock);
    });
  };
  var writeStructsFromTransaction = (encoder, transaction) => writeClientsStructs(encoder, transaction.doc.store, transaction.beforeState);
  var EventHandler = class {
    constructor() {
      this.l = [];
    }
  };
  var createEventHandler = () => new EventHandler();
  var addEventHandlerListener = (eventHandler, f) => eventHandler.l.push(f);
  var removeEventHandlerListener = (eventHandler, f) => {
    const l = eventHandler.l;
    const len = l.length;
    eventHandler.l = l.filter((g) => f !== g);
    if (len === eventHandler.l.length) {
      console.error("[yjs] Tried to remove event handler that doesn't exist.");
    }
  };
  var callEventHandlerListeners = (eventHandler, arg0, arg1) => callAll(eventHandler.l, [arg0, arg1]);
  var ID = class {
    constructor(client, clock) {
      this.client = client;
      this.clock = clock;
    }
  };
  var compareIDs = (a, b) => a === b || a !== null && b !== null && a.client === b.client && a.clock === b.clock;
  var createID = (client, clock) => new ID(client, clock);
  var findRootTypeKey = (type) => {
    for (const [key, value] of type.doc.share.entries()) {
      if (value === type) {
        return key;
      }
    }
    throw unexpectedCase();
  };
  var Snapshot = class {
    constructor(ds, sv) {
      this.ds = ds;
      this.sv = sv;
    }
  };
  var createSnapshot = (ds, sm) => new Snapshot(ds, sm);
  var emptySnapshot = createSnapshot(createDeleteSet(), /* @__PURE__ */ new Map());
  var isVisible = (item, snapshot) => snapshot === void 0 ? !item.deleted : snapshot.sv.has(item.id.client) && (snapshot.sv.get(item.id.client) || 0) > item.id.clock && !isDeleted(snapshot.ds, item.id);
  var splitSnapshotAffectedStructs = (transaction, snapshot) => {
    const meta = setIfUndefined(transaction.meta, splitSnapshotAffectedStructs, create2);
    const store = transaction.doc.store;
    if (!meta.has(snapshot)) {
      snapshot.sv.forEach((clock, client) => {
        if (clock < getState(store, client)) {
          getItemCleanStart(transaction, createID(client, clock));
        }
      });
      iterateDeletedStructs(transaction, snapshot.ds, (item) => {
      });
      meta.add(snapshot);
    }
  };
  var StructStore = class {
    constructor() {
      this.clients = /* @__PURE__ */ new Map();
      this.pendingStructs = null;
      this.pendingDs = null;
    }
  };
  var getStateVector = (store) => {
    const sm = /* @__PURE__ */ new Map();
    store.clients.forEach((structs, client) => {
      const struct = structs[structs.length - 1];
      sm.set(client, struct.id.clock + struct.length);
    });
    return sm;
  };
  var getState = (store, client) => {
    const structs = store.clients.get(client);
    if (structs === void 0) {
      return 0;
    }
    const lastStruct = structs[structs.length - 1];
    return lastStruct.id.clock + lastStruct.length;
  };
  var addStruct = (store, struct) => {
    let structs = store.clients.get(struct.id.client);
    if (structs === void 0) {
      structs = [];
      store.clients.set(struct.id.client, structs);
    } else {
      const lastStruct = structs[structs.length - 1];
      if (lastStruct.id.clock + lastStruct.length !== struct.id.clock) {
        throw unexpectedCase();
      }
    }
    structs.push(struct);
  };
  var findIndexSS = (structs, clock) => {
    let left = 0;
    let right = structs.length - 1;
    let mid = structs[right];
    let midclock = mid.id.clock;
    if (midclock === clock) {
      return right;
    }
    let midindex = floor(clock / (midclock + mid.length - 1) * right);
    while (left <= right) {
      mid = structs[midindex];
      midclock = mid.id.clock;
      if (midclock <= clock) {
        if (clock < midclock + mid.length) {
          return midindex;
        }
        left = midindex + 1;
      } else {
        right = midindex - 1;
      }
      midindex = floor((left + right) / 2);
    }
    throw unexpectedCase();
  };
  var find = (store, id) => {
    const structs = store.clients.get(id.client);
    return structs[findIndexSS(structs, id.clock)];
  };
  var getItem = find;
  var findIndexCleanStart = (transaction, structs, clock) => {
    const index = findIndexSS(structs, clock);
    const struct = structs[index];
    if (struct.id.clock < clock && struct instanceof Item) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, clock - struct.id.clock));
      return index + 1;
    }
    return index;
  };
  var getItemCleanStart = (transaction, id) => {
    const structs = transaction.doc.store.clients.get(id.client);
    return structs[findIndexCleanStart(transaction, structs, id.clock)];
  };
  var getItemCleanEnd = (transaction, store, id) => {
    const structs = store.clients.get(id.client);
    const index = findIndexSS(structs, id.clock);
    const struct = structs[index];
    if (id.clock !== struct.id.clock + struct.length - 1 && struct.constructor !== GC) {
      structs.splice(index + 1, 0, splitItem(transaction, struct, id.clock - struct.id.clock + 1));
    }
    return struct;
  };
  var replaceStruct = (store, struct, newStruct) => {
    const structs = store.clients.get(struct.id.client);
    structs[findIndexSS(structs, struct.id.clock)] = newStruct;
  };
  var iterateStructs = (transaction, structs, clockStart, len, f) => {
    if (len === 0) {
      return;
    }
    const clockEnd = clockStart + len;
    let index = findIndexCleanStart(transaction, structs, clockStart);
    let struct;
    do {
      struct = structs[index++];
      if (clockEnd < struct.id.clock + struct.length) {
        findIndexCleanStart(transaction, structs, clockEnd);
      }
      f(struct);
    } while (index < structs.length && structs[index].id.clock < clockEnd);
  };
  var Transaction = class {
    constructor(doc2, origin, local) {
      this.doc = doc2;
      this.deleteSet = new DeleteSet();
      this.beforeState = getStateVector(doc2.store);
      this.afterState = /* @__PURE__ */ new Map();
      this.changed = /* @__PURE__ */ new Map();
      this.changedParentTypes = /* @__PURE__ */ new Map();
      this._mergeStructs = [];
      this.origin = origin;
      this.meta = /* @__PURE__ */ new Map();
      this.local = local;
      this.subdocsAdded = /* @__PURE__ */ new Set();
      this.subdocsRemoved = /* @__PURE__ */ new Set();
      this.subdocsLoaded = /* @__PURE__ */ new Set();
    }
  };
  var writeUpdateMessageFromTransaction = (encoder, transaction) => {
    if (transaction.deleteSet.clients.size === 0 && !any(transaction.afterState, (clock, client) => transaction.beforeState.get(client) !== clock)) {
      return false;
    }
    sortAndMergeDeleteSet(transaction.deleteSet);
    writeStructsFromTransaction(encoder, transaction);
    writeDeleteSet(encoder, transaction.deleteSet);
    return true;
  };
  var addChangedTypeToTransaction = (transaction, type, parentSub) => {
    const item = type._item;
    if (item === null || item.id.clock < (transaction.beforeState.get(item.id.client) || 0) && !item.deleted) {
      setIfUndefined(transaction.changed, type, create2).add(parentSub);
    }
  };
  var tryToMergeWithLeft = (structs, pos) => {
    const left = structs[pos - 1];
    const right = structs[pos];
    if (left.deleted === right.deleted && left.constructor === right.constructor) {
      if (left.mergeWith(right)) {
        structs.splice(pos, 1);
        if (right instanceof Item && right.parentSub !== null && right.parent._map.get(right.parentSub) === right) {
          right.parent._map.set(right.parentSub, left);
        }
      }
    }
  };
  var tryGcDeleteSet = (ds, store, gcFilter) => {
    for (const [client, deleteItems] of ds.clients.entries()) {
      const structs = store.clients.get(client);
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        const endDeleteItemClock = deleteItem.clock + deleteItem.len;
        for (let si = findIndexSS(structs, deleteItem.clock), struct = structs[si]; si < structs.length && struct.id.clock < endDeleteItemClock; struct = structs[++si]) {
          const struct2 = structs[si];
          if (deleteItem.clock + deleteItem.len <= struct2.id.clock) {
            break;
          }
          if (struct2 instanceof Item && struct2.deleted && !struct2.keep && gcFilter(struct2)) {
            struct2.gc(store, false);
          }
        }
      }
    }
  };
  var tryMergeDeleteSet = (ds, store) => {
    ds.clients.forEach((deleteItems, client) => {
      const structs = store.clients.get(client);
      for (let di = deleteItems.length - 1; di >= 0; di--) {
        const deleteItem = deleteItems[di];
        const mostRightIndexToCheck = min(structs.length - 1, 1 + findIndexSS(structs, deleteItem.clock + deleteItem.len - 1));
        for (let si = mostRightIndexToCheck, struct = structs[si]; si > 0 && struct.id.clock >= deleteItem.clock; struct = structs[--si]) {
          tryToMergeWithLeft(structs, si);
        }
      }
    });
  };
  var cleanupTransactions = (transactionCleanups, i) => {
    if (i < transactionCleanups.length) {
      const transaction = transactionCleanups[i];
      const doc2 = transaction.doc;
      const store = doc2.store;
      const ds = transaction.deleteSet;
      const mergeStructs = transaction._mergeStructs;
      try {
        sortAndMergeDeleteSet(ds);
        transaction.afterState = getStateVector(transaction.doc.store);
        doc2._transaction = null;
        doc2.emit("beforeObserverCalls", [transaction, doc2]);
        const fs = [];
        transaction.changed.forEach((subs, itemtype) => fs.push(() => {
          if (itemtype._item === null || !itemtype._item.deleted) {
            itemtype._callObserver(transaction, subs);
          }
        }));
        fs.push(() => {
          transaction.changedParentTypes.forEach((events, type) => fs.push(() => {
            if (type._item === null || !type._item.deleted) {
              events = events.filter((event) => event.target._item === null || !event.target._item.deleted);
              events.forEach((event) => {
                event.currentTarget = type;
              });
              events.sort((event1, event2) => event1.path.length - event2.path.length);
              callEventHandlerListeners(type._dEH, events, transaction);
            }
          }));
          fs.push(() => doc2.emit("afterTransaction", [transaction, doc2]));
        });
        callAll(fs, []);
      } finally {
        if (doc2.gc) {
          tryGcDeleteSet(ds, store, doc2.gcFilter);
        }
        tryMergeDeleteSet(ds, store);
        transaction.afterState.forEach((clock, client) => {
          const beforeClock = transaction.beforeState.get(client) || 0;
          if (beforeClock !== clock) {
            const structs = store.clients.get(client);
            const firstChangePos = max(findIndexSS(structs, beforeClock), 1);
            for (let i2 = structs.length - 1; i2 >= firstChangePos; i2--) {
              tryToMergeWithLeft(structs, i2);
            }
          }
        });
        for (let i2 = 0; i2 < mergeStructs.length; i2++) {
          const { client, clock } = mergeStructs[i2].id;
          const structs = store.clients.get(client);
          const replacedStructPos = findIndexSS(structs, clock);
          if (replacedStructPos + 1 < structs.length) {
            tryToMergeWithLeft(structs, replacedStructPos + 1);
          }
          if (replacedStructPos > 0) {
            tryToMergeWithLeft(structs, replacedStructPos);
          }
        }
        if (!transaction.local && transaction.afterState.get(doc2.clientID) !== transaction.beforeState.get(doc2.clientID)) {
          print(ORANGE, BOLD, "[yjs] ", UNBOLD, RED, "Changed the client-id because another client seems to be using it.");
          doc2.clientID = generateNewClientId();
        }
        doc2.emit("afterTransactionCleanup", [transaction, doc2]);
        if (doc2._observers.has("update")) {
          const encoder = new UpdateEncoderV1();
          const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
          if (hasContent) {
            doc2.emit("update", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
          }
        }
        if (doc2._observers.has("updateV2")) {
          const encoder = new UpdateEncoderV2();
          const hasContent = writeUpdateMessageFromTransaction(encoder, transaction);
          if (hasContent) {
            doc2.emit("updateV2", [encoder.toUint8Array(), transaction.origin, doc2, transaction]);
          }
        }
        const { subdocsAdded, subdocsLoaded, subdocsRemoved } = transaction;
        if (subdocsAdded.size > 0 || subdocsRemoved.size > 0 || subdocsLoaded.size > 0) {
          subdocsAdded.forEach((subdoc) => {
            subdoc.clientID = doc2.clientID;
            if (subdoc.collectionid == null) {
              subdoc.collectionid = doc2.collectionid;
            }
            doc2.subdocs.add(subdoc);
          });
          subdocsRemoved.forEach((subdoc) => doc2.subdocs.delete(subdoc));
          doc2.emit("subdocs", [{ loaded: subdocsLoaded, added: subdocsAdded, removed: subdocsRemoved }, doc2, transaction]);
          subdocsRemoved.forEach((subdoc) => subdoc.destroy());
        }
        if (transactionCleanups.length <= i + 1) {
          doc2._transactionCleanups = [];
          doc2.emit("afterAllTransactions", [doc2, transactionCleanups]);
        } else {
          cleanupTransactions(transactionCleanups, i + 1);
        }
      }
    }
  };
  var transact = (doc2, f, origin = null, local = true) => {
    const transactionCleanups = doc2._transactionCleanups;
    let initialCall = false;
    if (doc2._transaction === null) {
      initialCall = true;
      doc2._transaction = new Transaction(doc2, origin, local);
      transactionCleanups.push(doc2._transaction);
      if (transactionCleanups.length === 1) {
        doc2.emit("beforeAllTransactions", [doc2]);
      }
      doc2.emit("beforeTransaction", [doc2._transaction, doc2]);
    }
    try {
      f(doc2._transaction);
    } finally {
      if (initialCall && transactionCleanups[0] === doc2._transaction) {
        cleanupTransactions(transactionCleanups, 0);
      }
    }
  };
  var YEvent = class {
    constructor(target, transaction) {
      this.target = target;
      this.currentTarget = target;
      this.transaction = transaction;
      this._changes = null;
      this._keys = null;
      this._delta = null;
    }
    get path() {
      return getPathTo(this.currentTarget, this.target);
    }
    deletes(struct) {
      return isDeleted(this.transaction.deleteSet, struct.id);
    }
    get keys() {
      if (this._keys === null) {
        const keys2 = /* @__PURE__ */ new Map();
        const target = this.target;
        const changed = this.transaction.changed.get(target);
        changed.forEach((key) => {
          if (key !== null) {
            const item = target._map.get(key);
            let action;
            let oldValue;
            if (this.adds(item)) {
              let prev = item.left;
              while (prev !== null && this.adds(prev)) {
                prev = prev.left;
              }
              if (this.deletes(item)) {
                if (prev !== null && this.deletes(prev)) {
                  action = "delete";
                  oldValue = last(prev.content.getContent());
                } else {
                  return;
                }
              } else {
                if (prev !== null && this.deletes(prev)) {
                  action = "update";
                  oldValue = last(prev.content.getContent());
                } else {
                  action = "add";
                  oldValue = void 0;
                }
              }
            } else {
              if (this.deletes(item)) {
                action = "delete";
                oldValue = last(item.content.getContent());
              } else {
                return;
              }
            }
            keys2.set(key, { action, oldValue });
          }
        });
        this._keys = keys2;
      }
      return this._keys;
    }
    get delta() {
      return this.changes.delta;
    }
    adds(struct) {
      return struct.id.clock >= (this.transaction.beforeState.get(struct.id.client) || 0);
    }
    get changes() {
      let changes = this._changes;
      if (changes === null) {
        const target = this.target;
        const added = create2();
        const deleted = create2();
        const delta = [];
        changes = {
          added,
          deleted,
          delta,
          keys: this.keys
        };
        const changed = this.transaction.changed.get(target);
        if (changed.has(null)) {
          let lastOp = null;
          const packOp = () => {
            if (lastOp) {
              delta.push(lastOp);
            }
          };
          for (let item = target._start; item !== null; item = item.right) {
            if (item.deleted) {
              if (this.deletes(item) && !this.adds(item)) {
                if (lastOp === null || lastOp.delete === void 0) {
                  packOp();
                  lastOp = { delete: 0 };
                }
                lastOp.delete += item.length;
                deleted.add(item);
              }
            } else {
              if (this.adds(item)) {
                if (lastOp === null || lastOp.insert === void 0) {
                  packOp();
                  lastOp = { insert: [] };
                }
                lastOp.insert = lastOp.insert.concat(item.content.getContent());
                added.add(item);
              } else {
                if (lastOp === null || lastOp.retain === void 0) {
                  packOp();
                  lastOp = { retain: 0 };
                }
                lastOp.retain += item.length;
              }
            }
          }
          if (lastOp !== null && lastOp.retain === void 0) {
            packOp();
          }
        }
        this._changes = changes;
      }
      return changes;
    }
  };
  var getPathTo = (parent, child) => {
    const path = [];
    while (child._item !== null && child !== parent) {
      if (child._item.parentSub !== null) {
        path.unshift(child._item.parentSub);
      } else {
        let i = 0;
        let c = child._item.parent._start;
        while (c !== child._item && c !== null) {
          if (!c.deleted) {
            i++;
          }
          c = c.right;
        }
        path.unshift(i);
      }
      child = child._item.parent;
    }
    return path;
  };
  var maxSearchMarker = 80;
  var globalSearchMarkerTimestamp = 0;
  var ArraySearchMarker = class {
    constructor(p, index) {
      p.marker = true;
      this.p = p;
      this.index = index;
      this.timestamp = globalSearchMarkerTimestamp++;
    }
  };
  var refreshMarkerTimestamp = (marker) => {
    marker.timestamp = globalSearchMarkerTimestamp++;
  };
  var overwriteMarker = (marker, p, index) => {
    marker.p.marker = false;
    marker.p = p;
    p.marker = true;
    marker.index = index;
    marker.timestamp = globalSearchMarkerTimestamp++;
  };
  var markPosition = (searchMarker, p, index) => {
    if (searchMarker.length >= maxSearchMarker) {
      const marker = searchMarker.reduce((a, b) => a.timestamp < b.timestamp ? a : b);
      overwriteMarker(marker, p, index);
      return marker;
    } else {
      const pm = new ArraySearchMarker(p, index);
      searchMarker.push(pm);
      return pm;
    }
  };
  var findMarker = (yarray, index) => {
    if (yarray._start === null || index === 0 || yarray._searchMarker === null) {
      return null;
    }
    const marker = yarray._searchMarker.length === 0 ? null : yarray._searchMarker.reduce((a, b) => abs(index - a.index) < abs(index - b.index) ? a : b);
    let p = yarray._start;
    let pindex = 0;
    if (marker !== null) {
      p = marker.p;
      pindex = marker.index;
      refreshMarkerTimestamp(marker);
    }
    while (p.right !== null && pindex < index) {
      if (!p.deleted && p.countable) {
        if (index < pindex + p.length) {
          break;
        }
        pindex += p.length;
      }
      p = p.right;
    }
    while (p.left !== null && pindex > index) {
      p = p.left;
      if (!p.deleted && p.countable) {
        pindex -= p.length;
      }
    }
    while (p.left !== null && p.left.id.client === p.id.client && p.left.id.clock + p.left.length === p.id.clock) {
      p = p.left;
      if (!p.deleted && p.countable) {
        pindex -= p.length;
      }
    }
    if (marker !== null && abs(marker.index - pindex) < p.parent.length / maxSearchMarker) {
      overwriteMarker(marker, p, pindex);
      return marker;
    } else {
      return markPosition(yarray._searchMarker, p, pindex);
    }
  };
  var updateMarkerChanges = (searchMarker, index, len) => {
    for (let i = searchMarker.length - 1; i >= 0; i--) {
      const m = searchMarker[i];
      if (len > 0) {
        let p = m.p;
        p.marker = false;
        while (p && (p.deleted || !p.countable)) {
          p = p.left;
          if (p && !p.deleted && p.countable) {
            m.index -= p.length;
          }
        }
        if (p === null || p.marker === true) {
          searchMarker.splice(i, 1);
          continue;
        }
        m.p = p;
        p.marker = true;
      }
      if (index < m.index || len > 0 && index === m.index) {
        m.index = max(index, m.index + len);
      }
    }
  };
  var callTypeObservers = (type, transaction, event) => {
    const changedType = type;
    const changedParentTypes = transaction.changedParentTypes;
    while (true) {
      setIfUndefined(changedParentTypes, type, () => []).push(event);
      if (type._item === null) {
        break;
      }
      type = type._item.parent;
    }
    callEventHandlerListeners(changedType._eH, event, transaction);
  };
  var AbstractType = class {
    constructor() {
      this._item = null;
      this._map = /* @__PURE__ */ new Map();
      this._start = null;
      this.doc = null;
      this._length = 0;
      this._eH = createEventHandler();
      this._dEH = createEventHandler();
      this._searchMarker = null;
    }
    get parent() {
      return this._item ? this._item.parent : null;
    }
    _integrate(y, item) {
      this.doc = y;
      this._item = item;
    }
    _copy() {
      throw methodUnimplemented();
    }
    clone() {
      throw methodUnimplemented();
    }
    _write(encoder) {
    }
    get _first() {
      let n = this._start;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n;
    }
    _callObserver(transaction, parentSubs) {
      if (!transaction.local && this._searchMarker) {
        this._searchMarker.length = 0;
      }
    }
    observe(f) {
      addEventHandlerListener(this._eH, f);
    }
    observeDeep(f) {
      addEventHandlerListener(this._dEH, f);
    }
    unobserve(f) {
      removeEventHandlerListener(this._eH, f);
    }
    unobserveDeep(f) {
      removeEventHandlerListener(this._dEH, f);
    }
    toJSON() {
    }
  };
  var typeListSlice = (type, start, end) => {
    if (start < 0) {
      start = type._length + start;
    }
    if (end < 0) {
      end = type._length + end;
    }
    let len = end - start;
    const cs = [];
    let n = type._start;
    while (n !== null && len > 0) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        if (c.length <= start) {
          start -= c.length;
        } else {
          for (let i = start; i < c.length && len > 0; i++) {
            cs.push(c[i]);
            len--;
          }
          start = 0;
        }
      }
      n = n.right;
    }
    return cs;
  };
  var typeListToArray = (type) => {
    const cs = [];
    let n = type._start;
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          cs.push(c[i]);
        }
      }
      n = n.right;
    }
    return cs;
  };
  var typeListForEach = (type, f) => {
    let index = 0;
    let n = type._start;
    while (n !== null) {
      if (n.countable && !n.deleted) {
        const c = n.content.getContent();
        for (let i = 0; i < c.length; i++) {
          f(c[i], index++, type);
        }
      }
      n = n.right;
    }
  };
  var typeListMap = (type, f) => {
    const result = [];
    typeListForEach(type, (c, i) => {
      result.push(f(c, i, type));
    });
    return result;
  };
  var typeListCreateIterator = (type) => {
    let n = type._start;
    let currentContent = null;
    let currentContentIndex = 0;
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        if (currentContent === null) {
          while (n !== null && n.deleted) {
            n = n.right;
          }
          if (n === null) {
            return {
              done: true,
              value: void 0
            };
          }
          currentContent = n.content.getContent();
          currentContentIndex = 0;
          n = n.right;
        }
        const value = currentContent[currentContentIndex++];
        if (currentContent.length <= currentContentIndex) {
          currentContent = null;
        }
        return {
          done: false,
          value
        };
      }
    };
  };
  var typeListGet = (type, index) => {
    const marker = findMarker(type, index);
    let n = type._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
    }
    for (; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          return n.content.getContent()[index];
        }
        index -= n.length;
      }
    }
  };
  var typeListInsertGenericsAfter = (transaction, parent, referenceItem, content) => {
    let left = referenceItem;
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    const store = doc2.store;
    const right = referenceItem === null ? parent._start : referenceItem.right;
    let jsonContent = [];
    const packJsonContent = () => {
      if (jsonContent.length > 0) {
        left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentAny(jsonContent));
        left.integrate(transaction, 0);
        jsonContent = [];
      }
    };
    content.forEach((c) => {
      if (c === null) {
        jsonContent.push(c);
      } else {
        switch (c.constructor) {
          case Number:
          case Object:
          case Boolean:
          case Array:
          case String:
            jsonContent.push(c);
            break;
          default:
            packJsonContent();
            switch (c.constructor) {
              case Uint8Array:
              case ArrayBuffer:
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentBinary(new Uint8Array(c)));
                left.integrate(transaction, 0);
                break;
              case Doc:
                left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentDoc(c));
                left.integrate(transaction, 0);
                break;
              default:
                if (c instanceof AbstractType) {
                  left = new Item(createID(ownClientId, getState(store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentType(c));
                  left.integrate(transaction, 0);
                } else {
                  throw new Error("Unexpected content type in insert operation");
                }
            }
        }
      }
    });
    packJsonContent();
  };
  var lengthExceeded = create4("Length exceeded!");
  var typeListInsertGenerics = (transaction, parent, index, content) => {
    if (index > parent._length) {
      throw lengthExceeded;
    }
    if (index === 0) {
      if (parent._searchMarker) {
        updateMarkerChanges(parent._searchMarker, index, content.length);
      }
      return typeListInsertGenericsAfter(transaction, parent, null, content);
    }
    const startIndex = index;
    const marker = findMarker(parent, index);
    let n = parent._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
      if (index === 0) {
        n = n.prev;
        index += n && n.countable && !n.deleted ? n.length : 0;
      }
    }
    for (; n !== null; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index <= n.length) {
          if (index < n.length) {
            getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
          }
          break;
        }
        index -= n.length;
      }
    }
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, startIndex, content.length);
    }
    return typeListInsertGenericsAfter(transaction, parent, n, content);
  };
  var typeListPushGenerics = (transaction, parent, content) => {
    const marker = (parent._searchMarker || []).reduce((maxMarker, currMarker) => currMarker.index > maxMarker.index ? currMarker : maxMarker, { index: 0, p: parent._start });
    let n = marker.p;
    if (n) {
      while (n.right) {
        n = n.right;
      }
    }
    return typeListInsertGenericsAfter(transaction, parent, n, content);
  };
  var typeListDelete = (transaction, parent, index, length3) => {
    if (length3 === 0) {
      return;
    }
    const startIndex = index;
    const startLength = length3;
    const marker = findMarker(parent, index);
    let n = parent._start;
    if (marker !== null) {
      n = marker.p;
      index -= marker.index;
    }
    for (; n !== null && index > 0; n = n.right) {
      if (!n.deleted && n.countable) {
        if (index < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + index));
        }
        index -= n.length;
      }
    }
    while (length3 > 0 && n !== null) {
      if (!n.deleted) {
        if (length3 < n.length) {
          getItemCleanStart(transaction, createID(n.id.client, n.id.clock + length3));
        }
        n.delete(transaction);
        length3 -= n.length;
      }
      n = n.right;
    }
    if (length3 > 0) {
      throw lengthExceeded;
    }
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, startIndex, -startLength + length3);
    }
  };
  var typeMapDelete = (transaction, parent, key) => {
    const c = parent._map.get(key);
    if (c !== void 0) {
      c.delete(transaction);
    }
  };
  var typeMapSet = (transaction, parent, key, value) => {
    const left = parent._map.get(key) || null;
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    let content;
    if (value == null) {
      content = new ContentAny([value]);
    } else {
      switch (value.constructor) {
        case Number:
        case Object:
        case Boolean:
        case Array:
        case String:
          content = new ContentAny([value]);
          break;
        case Uint8Array:
          content = new ContentBinary(value);
          break;
        case Doc:
          content = new ContentDoc(value);
          break;
        default:
          if (value instanceof AbstractType) {
            content = new ContentType(value);
          } else {
            throw new Error("Unexpected content type");
          }
      }
    }
    new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, null, null, parent, key, content).integrate(transaction, 0);
  };
  var typeMapGet = (parent, key) => {
    const val = parent._map.get(key);
    return val !== void 0 && !val.deleted ? val.content.getContent()[val.length - 1] : void 0;
  };
  var typeMapGetAll = (parent) => {
    const res = {};
    parent._map.forEach((value, key) => {
      if (!value.deleted) {
        res[key] = value.content.getContent()[value.length - 1];
      }
    });
    return res;
  };
  var typeMapHas = (parent, key) => {
    const val = parent._map.get(key);
    return val !== void 0 && !val.deleted;
  };
  var createMapIterator = (map2) => iteratorFilter(map2.entries(), (entry) => !entry[1].deleted);
  var YArrayEvent = class extends YEvent {
    constructor(yarray, transaction) {
      super(yarray, transaction);
      this._transaction = transaction;
    }
  };
  var YArray = class extends AbstractType {
    constructor() {
      super();
      this._prelimContent = [];
      this._searchMarker = [];
    }
    static from(items) {
      const a = new YArray();
      a.push(items);
      return a;
    }
    _integrate(y, item) {
      super._integrate(y, item);
      this.insert(0, this._prelimContent);
      this._prelimContent = null;
    }
    _copy() {
      return new YArray();
    }
    clone() {
      const arr = new YArray();
      arr.insert(0, this.toArray().map((el) => el instanceof AbstractType ? el.clone() : el));
      return arr;
    }
    get length() {
      return this._prelimContent === null ? this._length : this._prelimContent.length;
    }
    _callObserver(transaction, parentSubs) {
      super._callObserver(transaction, parentSubs);
      callTypeObservers(this, transaction, new YArrayEvent(this, transaction));
    }
    insert(index, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListInsertGenerics(transaction, this, index, content);
        });
      } else {
        this._prelimContent.splice(index, 0, ...content);
      }
    }
    push(content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListPushGenerics(transaction, this, content);
        });
      } else {
        this._prelimContent.push(...content);
      }
    }
    unshift(content) {
      this.insert(0, content);
    }
    delete(index, length3 = 1) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListDelete(transaction, this, index, length3);
        });
      } else {
        this._prelimContent.splice(index, length3);
      }
    }
    get(index) {
      return typeListGet(this, index);
    }
    toArray() {
      return typeListToArray(this);
    }
    slice(start = 0, end = this.length) {
      return typeListSlice(this, start, end);
    }
    toJSON() {
      return this.map((c) => c instanceof AbstractType ? c.toJSON() : c);
    }
    map(f) {
      return typeListMap(this, f);
    }
    forEach(f) {
      typeListForEach(this, f);
    }
    [Symbol.iterator]() {
      return typeListCreateIterator(this);
    }
    _write(encoder) {
      encoder.writeTypeRef(YArrayRefID);
    }
  };
  var YMapEvent = class extends YEvent {
    constructor(ymap, transaction, subs) {
      super(ymap, transaction);
      this.keysChanged = subs;
    }
  };
  var YMap = class extends AbstractType {
    constructor(entries) {
      super();
      this._prelimContent = null;
      if (entries === void 0) {
        this._prelimContent = /* @__PURE__ */ new Map();
      } else {
        this._prelimContent = new Map(entries);
      }
    }
    _integrate(y, item) {
      super._integrate(y, item);
      this._prelimContent.forEach((value, key) => {
        this.set(key, value);
      });
      this._prelimContent = null;
    }
    _copy() {
      return new YMap();
    }
    clone() {
      const map2 = new YMap();
      this.forEach((value, key) => {
        map2.set(key, value instanceof AbstractType ? value.clone() : value);
      });
      return map2;
    }
    _callObserver(transaction, parentSubs) {
      callTypeObservers(this, transaction, new YMapEvent(this, transaction, parentSubs));
    }
    toJSON() {
      const map2 = {};
      this._map.forEach((item, key) => {
        if (!item.deleted) {
          const v = item.content.getContent()[item.length - 1];
          map2[key] = v instanceof AbstractType ? v.toJSON() : v;
        }
      });
      return map2;
    }
    get size() {
      return [...createMapIterator(this._map)].length;
    }
    keys() {
      return iteratorMap(createMapIterator(this._map), (v) => v[0]);
    }
    values() {
      return iteratorMap(createMapIterator(this._map), (v) => v[1].content.getContent()[v[1].length - 1]);
    }
    entries() {
      return iteratorMap(createMapIterator(this._map), (v) => [v[0], v[1].content.getContent()[v[1].length - 1]]);
    }
    forEach(f) {
      const map2 = {};
      this._map.forEach((item, key) => {
        if (!item.deleted) {
          f(item.content.getContent()[item.length - 1], key, this);
        }
      });
      return map2;
    }
    [Symbol.iterator]() {
      return this.entries();
    }
    delete(key) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, key);
        });
      } else {
        this._prelimContent.delete(key);
      }
    }
    set(key, value) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(transaction, this, key, value);
        });
      } else {
        this._prelimContent.set(key, value);
      }
      return value;
    }
    get(key) {
      return typeMapGet(this, key);
    }
    has(key) {
      return typeMapHas(this, key);
    }
    clear() {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          this.forEach(function(value, key, map2) {
            typeMapDelete(transaction, map2, key);
          });
        });
      } else {
        this._prelimContent.clear();
      }
    }
    _write(encoder) {
      encoder.writeTypeRef(YMapRefID);
    }
  };
  var equalAttrs = (a, b) => a === b || typeof a === "object" && typeof b === "object" && a && b && equalFlat(a, b);
  var ItemTextListPosition = class {
    constructor(left, right, index, currentAttributes) {
      this.left = left;
      this.right = right;
      this.index = index;
      this.currentAttributes = currentAttributes;
    }
    forward() {
      if (this.right === null) {
        unexpectedCase();
      }
      switch (this.right.content.constructor) {
        case ContentFormat:
          if (!this.right.deleted) {
            updateCurrentAttributes(this.currentAttributes, this.right.content);
          }
          break;
        default:
          if (!this.right.deleted) {
            this.index += this.right.length;
          }
          break;
      }
      this.left = this.right;
      this.right = this.right.right;
    }
  };
  var findNextPosition = (transaction, pos, count) => {
    while (pos.right !== null && count > 0) {
      switch (pos.right.content.constructor) {
        case ContentFormat:
          if (!pos.right.deleted) {
            updateCurrentAttributes(pos.currentAttributes, pos.right.content);
          }
          break;
        default:
          if (!pos.right.deleted) {
            if (count < pos.right.length) {
              getItemCleanStart(transaction, createID(pos.right.id.client, pos.right.id.clock + count));
            }
            pos.index += pos.right.length;
            count -= pos.right.length;
          }
          break;
      }
      pos.left = pos.right;
      pos.right = pos.right.right;
    }
    return pos;
  };
  var findPosition = (transaction, parent, index) => {
    const currentAttributes = /* @__PURE__ */ new Map();
    const marker = findMarker(parent, index);
    if (marker) {
      const pos = new ItemTextListPosition(marker.p.left, marker.p, marker.index, currentAttributes);
      return findNextPosition(transaction, pos, index - marker.index);
    } else {
      const pos = new ItemTextListPosition(null, parent._start, 0, currentAttributes);
      return findNextPosition(transaction, pos, index);
    }
  };
  var insertNegatedAttributes = (transaction, parent, currPos, negatedAttributes) => {
    while (currPos.right !== null && (currPos.right.deleted === true || currPos.right.content.constructor === ContentFormat && equalAttrs(negatedAttributes.get(currPos.right.content.key), currPos.right.content.value))) {
      if (!currPos.right.deleted) {
        negatedAttributes.delete(currPos.right.content.key);
      }
      currPos.forward();
    }
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    negatedAttributes.forEach((val, key) => {
      const left = currPos.left;
      const right = currPos.right;
      const nextFormat = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
      nextFormat.integrate(transaction, 0);
      currPos.right = nextFormat;
      currPos.forward();
    });
  };
  var updateCurrentAttributes = (currentAttributes, format) => {
    const { key, value } = format;
    if (value === null) {
      currentAttributes.delete(key);
    } else {
      currentAttributes.set(key, value);
    }
  };
  var minimizeAttributeChanges = (currPos, attributes) => {
    while (true) {
      if (currPos.right === null) {
        break;
      } else if (currPos.right.deleted || currPos.right.content.constructor === ContentFormat && equalAttrs(attributes[currPos.right.content.key] || null, currPos.right.content.value))
        ;
      else {
        break;
      }
      currPos.forward();
    }
  };
  var insertAttributes = (transaction, parent, currPos, attributes) => {
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    const negatedAttributes = /* @__PURE__ */ new Map();
    for (const key in attributes) {
      const val = attributes[key];
      const currentVal = currPos.currentAttributes.get(key) || null;
      if (!equalAttrs(currentVal, val)) {
        negatedAttributes.set(key, currentVal);
        const { left, right } = currPos;
        currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, new ContentFormat(key, val));
        currPos.right.integrate(transaction, 0);
        currPos.forward();
      }
    }
    return negatedAttributes;
  };
  var insertText = (transaction, parent, currPos, text2, attributes) => {
    currPos.currentAttributes.forEach((val, key) => {
      if (attributes[key] === void 0) {
        attributes[key] = null;
      }
    });
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    minimizeAttributeChanges(currPos, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
    const content = text2.constructor === String ? new ContentString(text2) : text2 instanceof AbstractType ? new ContentType(text2) : new ContentEmbed(text2);
    let { left, right, index } = currPos;
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, currPos.index, content.getLength());
    }
    right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), left, left && left.lastId, right, right && right.id, parent, null, content);
    right.integrate(transaction, 0);
    currPos.right = right;
    currPos.index = index;
    currPos.forward();
    insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
  };
  var formatText = (transaction, parent, currPos, length3, attributes) => {
    const doc2 = transaction.doc;
    const ownClientId = doc2.clientID;
    minimizeAttributeChanges(currPos, attributes);
    const negatedAttributes = insertAttributes(transaction, parent, currPos, attributes);
    iterationLoop:
      while (currPos.right !== null && (length3 > 0 || negatedAttributes.size > 0 && (currPos.right.deleted || currPos.right.content.constructor === ContentFormat))) {
        if (!currPos.right.deleted) {
          switch (currPos.right.content.constructor) {
            case ContentFormat: {
              const { key, value } = currPos.right.content;
              const attr = attributes[key];
              if (attr !== void 0) {
                if (equalAttrs(attr, value)) {
                  negatedAttributes.delete(key);
                } else {
                  if (length3 === 0) {
                    break iterationLoop;
                  }
                  negatedAttributes.set(key, value);
                }
                currPos.right.delete(transaction);
              } else {
                currPos.currentAttributes.set(key, value);
              }
              break;
            }
            default:
              if (length3 < currPos.right.length) {
                getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length3));
              }
              length3 -= currPos.right.length;
              break;
          }
        }
        currPos.forward();
      }
    if (length3 > 0) {
      let newlines = "";
      for (; length3 > 0; length3--) {
        newlines += "\n";
      }
      currPos.right = new Item(createID(ownClientId, getState(doc2.store, ownClientId)), currPos.left, currPos.left && currPos.left.lastId, currPos.right, currPos.right && currPos.right.id, parent, null, new ContentString(newlines));
      currPos.right.integrate(transaction, 0);
      currPos.forward();
    }
    insertNegatedAttributes(transaction, parent, currPos, negatedAttributes);
  };
  var cleanupFormattingGap = (transaction, start, curr, startAttributes, currAttributes) => {
    let end = curr;
    const endAttributes = copy(currAttributes);
    while (end && (!end.countable || end.deleted)) {
      if (!end.deleted && end.content.constructor === ContentFormat) {
        updateCurrentAttributes(endAttributes, end.content);
      }
      end = end.right;
    }
    let cleanups = 0;
    let reachedEndOfCurr = false;
    while (start !== end) {
      if (curr === start) {
        reachedEndOfCurr = true;
      }
      if (!start.deleted) {
        const content = start.content;
        switch (content.constructor) {
          case ContentFormat: {
            const { key, value } = content;
            if ((endAttributes.get(key) || null) !== value || (startAttributes.get(key) || null) === value) {
              start.delete(transaction);
              cleanups++;
              if (!reachedEndOfCurr && (currAttributes.get(key) || null) === value && (startAttributes.get(key) || null) !== value) {
                currAttributes.delete(key);
              }
            }
            break;
          }
        }
      }
      start = start.right;
    }
    return cleanups;
  };
  var cleanupContextlessFormattingGap = (transaction, item) => {
    while (item && item.right && (item.right.deleted || !item.right.countable)) {
      item = item.right;
    }
    const attrs = /* @__PURE__ */ new Set();
    while (item && (item.deleted || !item.countable)) {
      if (!item.deleted && item.content.constructor === ContentFormat) {
        const key = item.content.key;
        if (attrs.has(key)) {
          item.delete(transaction);
        } else {
          attrs.add(key);
        }
      }
      item = item.left;
    }
  };
  var cleanupYTextFormatting = (type) => {
    let res = 0;
    transact(type.doc, (transaction) => {
      let start = type._start;
      let end = type._start;
      let startAttributes = create();
      const currentAttributes = copy(startAttributes);
      while (end) {
        if (end.deleted === false) {
          switch (end.content.constructor) {
            case ContentFormat:
              updateCurrentAttributes(currentAttributes, end.content);
              break;
            default:
              res += cleanupFormattingGap(transaction, start, end, startAttributes, currentAttributes);
              startAttributes = copy(currentAttributes);
              start = end;
              break;
          }
        }
        end = end.right;
      }
    });
    return res;
  };
  var deleteText = (transaction, currPos, length3) => {
    const startLength = length3;
    const startAttrs = copy(currPos.currentAttributes);
    const start = currPos.right;
    while (length3 > 0 && currPos.right !== null) {
      if (currPos.right.deleted === false) {
        switch (currPos.right.content.constructor) {
          case ContentType:
          case ContentEmbed:
          case ContentString:
            if (length3 < currPos.right.length) {
              getItemCleanStart(transaction, createID(currPos.right.id.client, currPos.right.id.clock + length3));
            }
            length3 -= currPos.right.length;
            currPos.right.delete(transaction);
            break;
        }
      }
      currPos.forward();
    }
    if (start) {
      cleanupFormattingGap(transaction, start, currPos.right, startAttrs, currPos.currentAttributes);
    }
    const parent = (currPos.left || currPos.right).parent;
    if (parent._searchMarker) {
      updateMarkerChanges(parent._searchMarker, currPos.index, -startLength + length3);
    }
    return currPos;
  };
  var YTextEvent = class extends YEvent {
    constructor(ytext, transaction, subs) {
      super(ytext, transaction);
      this.childListChanged = false;
      this.keysChanged = /* @__PURE__ */ new Set();
      subs.forEach((sub) => {
        if (sub === null) {
          this.childListChanged = true;
        } else {
          this.keysChanged.add(sub);
        }
      });
    }
    get changes() {
      if (this._changes === null) {
        const changes = {
          keys: this.keys,
          delta: this.delta,
          added: /* @__PURE__ */ new Set(),
          deleted: /* @__PURE__ */ new Set()
        };
        this._changes = changes;
      }
      return this._changes;
    }
    get delta() {
      if (this._delta === null) {
        const y = this.target.doc;
        const delta = [];
        transact(y, (transaction) => {
          const currentAttributes = /* @__PURE__ */ new Map();
          const oldAttributes = /* @__PURE__ */ new Map();
          let item = this.target._start;
          let action = null;
          const attributes = {};
          let insert = "";
          let retain = 0;
          let deleteLen = 0;
          const addOp = () => {
            if (action !== null) {
              let op;
              switch (action) {
                case "delete":
                  op = { delete: deleteLen };
                  deleteLen = 0;
                  break;
                case "insert":
                  op = { insert };
                  if (currentAttributes.size > 0) {
                    op.attributes = {};
                    currentAttributes.forEach((value, key) => {
                      if (value !== null) {
                        op.attributes[key] = value;
                      }
                    });
                  }
                  insert = "";
                  break;
                case "retain":
                  op = { retain };
                  if (Object.keys(attributes).length > 0) {
                    op.attributes = {};
                    for (const key in attributes) {
                      op.attributes[key] = attributes[key];
                    }
                  }
                  retain = 0;
                  break;
              }
              delta.push(op);
              action = null;
            }
          };
          while (item !== null) {
            switch (item.content.constructor) {
              case ContentType:
              case ContentEmbed:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    addOp();
                    action = "insert";
                    insert = item.content.getContent()[0];
                    addOp();
                  }
                } else if (this.deletes(item)) {
                  if (action !== "delete") {
                    addOp();
                    action = "delete";
                  }
                  deleteLen += 1;
                } else if (!item.deleted) {
                  if (action !== "retain") {
                    addOp();
                    action = "retain";
                  }
                  retain += 1;
                }
                break;
              case ContentString:
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    if (action !== "insert") {
                      addOp();
                      action = "insert";
                    }
                    insert += item.content.str;
                  }
                } else if (this.deletes(item)) {
                  if (action !== "delete") {
                    addOp();
                    action = "delete";
                  }
                  deleteLen += item.length;
                } else if (!item.deleted) {
                  if (action !== "retain") {
                    addOp();
                    action = "retain";
                  }
                  retain += item.length;
                }
                break;
              case ContentFormat: {
                const { key, value } = item.content;
                if (this.adds(item)) {
                  if (!this.deletes(item)) {
                    const curVal = currentAttributes.get(key) || null;
                    if (!equalAttrs(curVal, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      if (equalAttrs(value, oldAttributes.get(key) || null)) {
                        delete attributes[key];
                      } else {
                        attributes[key] = value;
                      }
                    } else if (value !== null) {
                      item.delete(transaction);
                    }
                  }
                } else if (this.deletes(item)) {
                  oldAttributes.set(key, value);
                  const curVal = currentAttributes.get(key) || null;
                  if (!equalAttrs(curVal, value)) {
                    if (action === "retain") {
                      addOp();
                    }
                    attributes[key] = curVal;
                  }
                } else if (!item.deleted) {
                  oldAttributes.set(key, value);
                  const attr = attributes[key];
                  if (attr !== void 0) {
                    if (!equalAttrs(attr, value)) {
                      if (action === "retain") {
                        addOp();
                      }
                      if (value === null) {
                        delete attributes[key];
                      } else {
                        attributes[key] = value;
                      }
                    } else if (attr !== null) {
                      item.delete(transaction);
                    }
                  }
                }
                if (!item.deleted) {
                  if (action === "insert") {
                    addOp();
                  }
                  updateCurrentAttributes(currentAttributes, item.content);
                }
                break;
              }
            }
            item = item.right;
          }
          addOp();
          while (delta.length > 0) {
            const lastOp = delta[delta.length - 1];
            if (lastOp.retain !== void 0 && lastOp.attributes === void 0) {
              delta.pop();
            } else {
              break;
            }
          }
        });
        this._delta = delta;
      }
      return this._delta;
    }
  };
  var YText = class extends AbstractType {
    constructor(string) {
      super();
      this._pending = string !== void 0 ? [() => this.insert(0, string)] : [];
      this._searchMarker = [];
    }
    get length() {
      return this._length;
    }
    _integrate(y, item) {
      super._integrate(y, item);
      try {
        this._pending.forEach((f) => f());
      } catch (e) {
        console.error(e);
      }
      this._pending = null;
    }
    _copy() {
      return new YText();
    }
    clone() {
      const text2 = new YText();
      text2.applyDelta(this.toDelta());
      return text2;
    }
    _callObserver(transaction, parentSubs) {
      super._callObserver(transaction, parentSubs);
      const event = new YTextEvent(this, transaction, parentSubs);
      const doc2 = transaction.doc;
      callTypeObservers(this, transaction, event);
      if (!transaction.local) {
        let foundFormattingItem = false;
        for (const [client, afterClock] of transaction.afterState.entries()) {
          const clock = transaction.beforeState.get(client) || 0;
          if (afterClock === clock) {
            continue;
          }
          iterateStructs(transaction, doc2.store.clients.get(client), clock, afterClock, (item) => {
            if (!item.deleted && item.content.constructor === ContentFormat) {
              foundFormattingItem = true;
            }
          });
          if (foundFormattingItem) {
            break;
          }
        }
        if (!foundFormattingItem) {
          iterateDeletedStructs(transaction, transaction.deleteSet, (item) => {
            if (item instanceof GC || foundFormattingItem) {
              return;
            }
            if (item.parent === this && item.content.constructor === ContentFormat) {
              foundFormattingItem = true;
            }
          });
        }
        transact(doc2, (t) => {
          if (foundFormattingItem) {
            cleanupYTextFormatting(this);
          } else {
            iterateDeletedStructs(t, t.deleteSet, (item) => {
              if (item instanceof GC) {
                return;
              }
              if (item.parent === this) {
                cleanupContextlessFormattingGap(t, item);
              }
            });
          }
        });
      }
    }
    toString() {
      let str = "";
      let n = this._start;
      while (n !== null) {
        if (!n.deleted && n.countable && n.content.constructor === ContentString) {
          str += n.content.str;
        }
        n = n.right;
      }
      return str;
    }
    toJSON() {
      return this.toString();
    }
    applyDelta(delta, { sanitize = true } = {}) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          const currPos = new ItemTextListPosition(null, this._start, 0, /* @__PURE__ */ new Map());
          for (let i = 0; i < delta.length; i++) {
            const op = delta[i];
            if (op.insert !== void 0) {
              const ins = !sanitize && typeof op.insert === "string" && i === delta.length - 1 && currPos.right === null && op.insert.slice(-1) === "\n" ? op.insert.slice(0, -1) : op.insert;
              if (typeof ins !== "string" || ins.length > 0) {
                insertText(transaction, this, currPos, ins, op.attributes || {});
              }
            } else if (op.retain !== void 0) {
              formatText(transaction, this, currPos, op.retain, op.attributes || {});
            } else if (op.delete !== void 0) {
              deleteText(transaction, currPos, op.delete);
            }
          }
        });
      } else {
        this._pending.push(() => this.applyDelta(delta));
      }
    }
    toDelta(snapshot, prevSnapshot, computeYChange) {
      const ops = [];
      const currentAttributes = /* @__PURE__ */ new Map();
      const doc2 = this.doc;
      let str = "";
      let n = this._start;
      function packStr() {
        if (str.length > 0) {
          const attributes = {};
          let addAttributes = false;
          currentAttributes.forEach((value, key) => {
            addAttributes = true;
            attributes[key] = value;
          });
          const op = { insert: str };
          if (addAttributes) {
            op.attributes = attributes;
          }
          ops.push(op);
          str = "";
        }
      }
      transact(doc2, (transaction) => {
        if (snapshot) {
          splitSnapshotAffectedStructs(transaction, snapshot);
        }
        if (prevSnapshot) {
          splitSnapshotAffectedStructs(transaction, prevSnapshot);
        }
        while (n !== null) {
          if (isVisible(n, snapshot) || prevSnapshot !== void 0 && isVisible(n, prevSnapshot)) {
            switch (n.content.constructor) {
              case ContentString: {
                const cur = currentAttributes.get("ychange");
                if (snapshot !== void 0 && !isVisible(n, snapshot)) {
                  if (cur === void 0 || cur.user !== n.id.client || cur.state !== "removed") {
                    packStr();
                    currentAttributes.set("ychange", computeYChange ? computeYChange("removed", n.id) : { type: "removed" });
                  }
                } else if (prevSnapshot !== void 0 && !isVisible(n, prevSnapshot)) {
                  if (cur === void 0 || cur.user !== n.id.client || cur.state !== "added") {
                    packStr();
                    currentAttributes.set("ychange", computeYChange ? computeYChange("added", n.id) : { type: "added" });
                  }
                } else if (cur !== void 0) {
                  packStr();
                  currentAttributes.delete("ychange");
                }
                str += n.content.str;
                break;
              }
              case ContentType:
              case ContentEmbed: {
                packStr();
                const op = {
                  insert: n.content.getContent()[0]
                };
                if (currentAttributes.size > 0) {
                  const attrs = {};
                  op.attributes = attrs;
                  currentAttributes.forEach((value, key) => {
                    attrs[key] = value;
                  });
                }
                ops.push(op);
                break;
              }
              case ContentFormat:
                if (isVisible(n, snapshot)) {
                  packStr();
                  updateCurrentAttributes(currentAttributes, n.content);
                }
                break;
            }
          }
          n = n.right;
        }
        packStr();
      }, splitSnapshotAffectedStructs);
      return ops;
    }
    insert(index, text2, attributes) {
      if (text2.length <= 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index);
          if (!attributes) {
            attributes = {};
            pos.currentAttributes.forEach((v, k) => {
              attributes[k] = v;
            });
          }
          insertText(transaction, this, pos, text2, attributes);
        });
      } else {
        this._pending.push(() => this.insert(index, text2, attributes));
      }
    }
    insertEmbed(index, embed, attributes = {}) {
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index);
          insertText(transaction, this, pos, embed, attributes);
        });
      } else {
        this._pending.push(() => this.insertEmbed(index, embed, attributes));
      }
    }
    delete(index, length3) {
      if (length3 === 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          deleteText(transaction, findPosition(transaction, this, index), length3);
        });
      } else {
        this._pending.push(() => this.delete(index, length3));
      }
    }
    format(index, length3, attributes) {
      if (length3 === 0) {
        return;
      }
      const y = this.doc;
      if (y !== null) {
        transact(y, (transaction) => {
          const pos = findPosition(transaction, this, index);
          if (pos.right === null) {
            return;
          }
          formatText(transaction, this, pos, length3, attributes);
        });
      } else {
        this._pending.push(() => this.format(index, length3, attributes));
      }
    }
    removeAttribute(attributeName) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, attributeName);
        });
      } else {
        this._pending.push(() => this.removeAttribute(attributeName));
      }
    }
    setAttribute(attributeName, attributeValue) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(transaction, this, attributeName, attributeValue);
        });
      } else {
        this._pending.push(() => this.setAttribute(attributeName, attributeValue));
      }
    }
    getAttribute(attributeName) {
      return typeMapGet(this, attributeName);
    }
    getAttributes(snapshot) {
      return typeMapGetAll(this);
    }
    _write(encoder) {
      encoder.writeTypeRef(YTextRefID);
    }
  };
  var YXmlTreeWalker = class {
    constructor(root, f = () => true) {
      this._filter = f;
      this._root = root;
      this._currentNode = root._start;
      this._firstCall = true;
    }
    [Symbol.iterator]() {
      return this;
    }
    next() {
      let n = this._currentNode;
      let type = n && n.content && n.content.type;
      if (n !== null && (!this._firstCall || n.deleted || !this._filter(type))) {
        do {
          type = n.content.type;
          if (!n.deleted && (type.constructor === YXmlElement || type.constructor === YXmlFragment) && type._start !== null) {
            n = type._start;
          } else {
            while (n !== null) {
              if (n.right !== null) {
                n = n.right;
                break;
              } else if (n.parent === this._root) {
                n = null;
              } else {
                n = n.parent._item;
              }
            }
          }
        } while (n !== null && (n.deleted || !this._filter(n.content.type)));
      }
      this._firstCall = false;
      if (n === null) {
        return { value: void 0, done: true };
      }
      this._currentNode = n;
      return { value: n.content.type, done: false };
    }
  };
  var YXmlFragment = class extends AbstractType {
    constructor() {
      super();
      this._prelimContent = [];
    }
    get firstChild() {
      const first = this._first;
      return first ? first.content.getContent()[0] : null;
    }
    _integrate(y, item) {
      super._integrate(y, item);
      this.insert(0, this._prelimContent);
      this._prelimContent = null;
    }
    _copy() {
      return new YXmlFragment();
    }
    clone() {
      const el = new YXmlFragment();
      el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
      return el;
    }
    get length() {
      return this._prelimContent === null ? this._length : this._prelimContent.length;
    }
    createTreeWalker(filter) {
      return new YXmlTreeWalker(this, filter);
    }
    querySelector(query) {
      query = query.toUpperCase();
      const iterator = new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query);
      const next = iterator.next();
      if (next.done) {
        return null;
      } else {
        return next.value;
      }
    }
    querySelectorAll(query) {
      query = query.toUpperCase();
      return Array.from(new YXmlTreeWalker(this, (element2) => element2.nodeName && element2.nodeName.toUpperCase() === query));
    }
    _callObserver(transaction, parentSubs) {
      callTypeObservers(this, transaction, new YXmlEvent(this, parentSubs, transaction));
    }
    toString() {
      return typeListMap(this, (xml) => xml.toString()).join("");
    }
    toJSON() {
      return this.toString();
    }
    toDOM(_document = document, hooks = {}, binding) {
      const fragment = _document.createDocumentFragment();
      if (binding !== void 0) {
        binding._createAssociation(fragment, this);
      }
      typeListForEach(this, (xmlType) => {
        fragment.insertBefore(xmlType.toDOM(_document, hooks, binding), null);
      });
      return fragment;
    }
    insert(index, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListInsertGenerics(transaction, this, index, content);
        });
      } else {
        this._prelimContent.splice(index, 0, ...content);
      }
    }
    insertAfter(ref, content) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          const refItem = ref && ref instanceof AbstractType ? ref._item : ref;
          typeListInsertGenericsAfter(transaction, this, refItem, content);
        });
      } else {
        const pc = this._prelimContent;
        const index = ref === null ? 0 : pc.findIndex((el) => el === ref) + 1;
        if (index === 0 && ref !== null) {
          throw create4("Reference item not found");
        }
        pc.splice(index, 0, ...content);
      }
    }
    delete(index, length3 = 1) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeListDelete(transaction, this, index, length3);
        });
      } else {
        this._prelimContent.splice(index, length3);
      }
    }
    toArray() {
      return typeListToArray(this);
    }
    push(content) {
      this.insert(this.length, content);
    }
    unshift(content) {
      this.insert(0, content);
    }
    get(index) {
      return typeListGet(this, index);
    }
    slice(start = 0, end = this.length) {
      return typeListSlice(this, start, end);
    }
    forEach(f) {
      typeListForEach(this, f);
    }
    _write(encoder) {
      encoder.writeTypeRef(YXmlFragmentRefID);
    }
  };
  var YXmlElement = class extends YXmlFragment {
    constructor(nodeName = "UNDEFINED") {
      super();
      this.nodeName = nodeName;
      this._prelimAttrs = /* @__PURE__ */ new Map();
    }
    get nextSibling() {
      const n = this._item ? this._item.next : null;
      return n ? n.content.type : null;
    }
    get prevSibling() {
      const n = this._item ? this._item.prev : null;
      return n ? n.content.type : null;
    }
    _integrate(y, item) {
      super._integrate(y, item);
      this._prelimAttrs.forEach((value, key) => {
        this.setAttribute(key, value);
      });
      this._prelimAttrs = null;
    }
    _copy() {
      return new YXmlElement(this.nodeName);
    }
    clone() {
      const el = new YXmlElement(this.nodeName);
      const attrs = this.getAttributes();
      for (const key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
      el.insert(0, this.toArray().map((item) => item instanceof AbstractType ? item.clone() : item));
      return el;
    }
    toString() {
      const attrs = this.getAttributes();
      const stringBuilder = [];
      const keys2 = [];
      for (const key in attrs) {
        keys2.push(key);
      }
      keys2.sort();
      const keysLen = keys2.length;
      for (let i = 0; i < keysLen; i++) {
        const key = keys2[i];
        stringBuilder.push(key + '="' + attrs[key] + '"');
      }
      const nodeName = this.nodeName.toLocaleLowerCase();
      const attrsString = stringBuilder.length > 0 ? " " + stringBuilder.join(" ") : "";
      return `<${nodeName}${attrsString}>${super.toString()}</${nodeName}>`;
    }
    removeAttribute(attributeName) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapDelete(transaction, this, attributeName);
        });
      } else {
        this._prelimAttrs.delete(attributeName);
      }
    }
    setAttribute(attributeName, attributeValue) {
      if (this.doc !== null) {
        transact(this.doc, (transaction) => {
          typeMapSet(transaction, this, attributeName, attributeValue);
        });
      } else {
        this._prelimAttrs.set(attributeName, attributeValue);
      }
    }
    getAttribute(attributeName) {
      return typeMapGet(this, attributeName);
    }
    hasAttribute(attributeName) {
      return typeMapHas(this, attributeName);
    }
    getAttributes(snapshot) {
      return typeMapGetAll(this);
    }
    toDOM(_document = document, hooks = {}, binding) {
      const dom = _document.createElement(this.nodeName);
      const attrs = this.getAttributes();
      for (const key in attrs) {
        dom.setAttribute(key, attrs[key]);
      }
      typeListForEach(this, (yxml) => {
        dom.appendChild(yxml.toDOM(_document, hooks, binding));
      });
      if (binding !== void 0) {
        binding._createAssociation(dom, this);
      }
      return dom;
    }
    _write(encoder) {
      encoder.writeTypeRef(YXmlElementRefID);
      encoder.writeKey(this.nodeName);
    }
  };
  var YXmlEvent = class extends YEvent {
    constructor(target, subs, transaction) {
      super(target, transaction);
      this.childListChanged = false;
      this.attributesChanged = /* @__PURE__ */ new Set();
      subs.forEach((sub) => {
        if (sub === null) {
          this.childListChanged = true;
        } else {
          this.attributesChanged.add(sub);
        }
      });
    }
  };
  var AbstractStruct = class {
    constructor(id, length3) {
      this.id = id;
      this.length = length3;
    }
    get deleted() {
      throw methodUnimplemented();
    }
    mergeWith(right) {
      return false;
    }
    write(encoder, offset, encodingRef) {
      throw methodUnimplemented();
    }
    integrate(transaction, offset) {
      throw methodUnimplemented();
    }
  };
  var structGCRefNumber = 0;
  var GC = class extends AbstractStruct {
    get deleted() {
      return true;
    }
    delete() {
    }
    mergeWith(right) {
      if (this.constructor !== right.constructor) {
        return false;
      }
      this.length += right.length;
      return true;
    }
    integrate(transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.length -= offset;
      }
      addStruct(transaction.doc.store, this);
    }
    write(encoder, offset) {
      encoder.writeInfo(structGCRefNumber);
      encoder.writeLen(this.length - offset);
    }
    getMissing(transaction, store) {
      return null;
    }
  };
  var ContentBinary = class {
    constructor(content) {
      this.content = content;
    }
    getLength() {
      return 1;
    }
    getContent() {
      return [this.content];
    }
    isCountable() {
      return true;
    }
    copy() {
      return new ContentBinary(this.content);
    }
    splice(offset) {
      throw methodUnimplemented();
    }
    mergeWith(right) {
      return false;
    }
    integrate(transaction, item) {
    }
    delete(transaction) {
    }
    gc(store) {
    }
    write(encoder, offset) {
      encoder.writeBuf(this.content);
    }
    getRef() {
      return 3;
    }
  };
  var ContentDeleted = class {
    constructor(len) {
      this.len = len;
    }
    getLength() {
      return this.len;
    }
    getContent() {
      return [];
    }
    isCountable() {
      return false;
    }
    copy() {
      return new ContentDeleted(this.len);
    }
    splice(offset) {
      const right = new ContentDeleted(this.len - offset);
      this.len = offset;
      return right;
    }
    mergeWith(right) {
      this.len += right.len;
      return true;
    }
    integrate(transaction, item) {
      addToDeleteSet(transaction.deleteSet, item.id.client, item.id.clock, this.len);
      item.markDeleted();
    }
    delete(transaction) {
    }
    gc(store) {
    }
    write(encoder, offset) {
      encoder.writeLen(this.len - offset);
    }
    getRef() {
      return 1;
    }
  };
  var createDocFromOpts = (guid, opts) => new Doc(__spreadProps(__spreadValues({ guid }, opts), { shouldLoad: opts.shouldLoad || opts.autoLoad || false }));
  var ContentDoc = class {
    constructor(doc2) {
      if (doc2._item) {
        console.error("This document was already integrated as a sub-document. You should create a second instance instead with the same guid.");
      }
      this.doc = doc2;
      const opts = {};
      this.opts = opts;
      if (!doc2.gc) {
        opts.gc = false;
      }
      if (doc2.autoLoad) {
        opts.autoLoad = true;
      }
      if (doc2.meta !== null) {
        opts.meta = doc2.meta;
      }
    }
    getLength() {
      return 1;
    }
    getContent() {
      return [this.doc];
    }
    isCountable() {
      return true;
    }
    copy() {
      return new ContentDoc(createDocFromOpts(this.doc.guid, this.opts));
    }
    splice(offset) {
      throw methodUnimplemented();
    }
    mergeWith(right) {
      return false;
    }
    integrate(transaction, item) {
      this.doc._item = item;
      transaction.subdocsAdded.add(this.doc);
      if (this.doc.shouldLoad) {
        transaction.subdocsLoaded.add(this.doc);
      }
    }
    delete(transaction) {
      if (transaction.subdocsAdded.has(this.doc)) {
        transaction.subdocsAdded.delete(this.doc);
      } else {
        transaction.subdocsRemoved.add(this.doc);
      }
    }
    gc(store) {
    }
    write(encoder, offset) {
      encoder.writeString(this.doc.guid);
      encoder.writeAny(this.opts);
    }
    getRef() {
      return 9;
    }
  };
  var ContentEmbed = class {
    constructor(embed) {
      this.embed = embed;
    }
    getLength() {
      return 1;
    }
    getContent() {
      return [this.embed];
    }
    isCountable() {
      return true;
    }
    copy() {
      return new ContentEmbed(this.embed);
    }
    splice(offset) {
      throw methodUnimplemented();
    }
    mergeWith(right) {
      return false;
    }
    integrate(transaction, item) {
    }
    delete(transaction) {
    }
    gc(store) {
    }
    write(encoder, offset) {
      encoder.writeJSON(this.embed);
    }
    getRef() {
      return 5;
    }
  };
  var ContentFormat = class {
    constructor(key, value) {
      this.key = key;
      this.value = value;
    }
    getLength() {
      return 1;
    }
    getContent() {
      return [];
    }
    isCountable() {
      return false;
    }
    copy() {
      return new ContentFormat(this.key, this.value);
    }
    splice(offset) {
      throw methodUnimplemented();
    }
    mergeWith(right) {
      return false;
    }
    integrate(transaction, item) {
      item.parent._searchMarker = null;
    }
    delete(transaction) {
    }
    gc(store) {
    }
    write(encoder, offset) {
      encoder.writeKey(this.key);
      encoder.writeJSON(this.value);
    }
    getRef() {
      return 6;
    }
  };
  var ContentAny = class {
    constructor(arr) {
      this.arr = arr;
    }
    getLength() {
      return this.arr.length;
    }
    getContent() {
      return this.arr;
    }
    isCountable() {
      return true;
    }
    copy() {
      return new ContentAny(this.arr);
    }
    splice(offset) {
      const right = new ContentAny(this.arr.slice(offset));
      this.arr = this.arr.slice(0, offset);
      return right;
    }
    mergeWith(right) {
      this.arr = this.arr.concat(right.arr);
      return true;
    }
    integrate(transaction, item) {
    }
    delete(transaction) {
    }
    gc(store) {
    }
    write(encoder, offset) {
      const len = this.arr.length;
      encoder.writeLen(len - offset);
      for (let i = offset; i < len; i++) {
        const c = this.arr[i];
        encoder.writeAny(c);
      }
    }
    getRef() {
      return 8;
    }
  };
  var ContentString = class {
    constructor(str) {
      this.str = str;
    }
    getLength() {
      return this.str.length;
    }
    getContent() {
      return this.str.split("");
    }
    isCountable() {
      return true;
    }
    copy() {
      return new ContentString(this.str);
    }
    splice(offset) {
      const right = new ContentString(this.str.slice(offset));
      this.str = this.str.slice(0, offset);
      const firstCharCode = this.str.charCodeAt(offset - 1);
      if (firstCharCode >= 55296 && firstCharCode <= 56319) {
        this.str = this.str.slice(0, offset - 1) + "\uFFFD";
        right.str = "\uFFFD" + right.str.slice(1);
      }
      return right;
    }
    mergeWith(right) {
      this.str += right.str;
      return true;
    }
    integrate(transaction, item) {
    }
    delete(transaction) {
    }
    gc(store) {
    }
    write(encoder, offset) {
      encoder.writeString(offset === 0 ? this.str : this.str.slice(offset));
    }
    getRef() {
      return 4;
    }
  };
  var YArrayRefID = 0;
  var YMapRefID = 1;
  var YTextRefID = 2;
  var YXmlElementRefID = 3;
  var YXmlFragmentRefID = 4;
  var ContentType = class {
    constructor(type) {
      this.type = type;
    }
    getLength() {
      return 1;
    }
    getContent() {
      return [this.type];
    }
    isCountable() {
      return true;
    }
    copy() {
      return new ContentType(this.type._copy());
    }
    splice(offset) {
      throw methodUnimplemented();
    }
    mergeWith(right) {
      return false;
    }
    integrate(transaction, item) {
      this.type._integrate(transaction.doc, item);
    }
    delete(transaction) {
      let item = this.type._start;
      while (item !== null) {
        if (!item.deleted) {
          item.delete(transaction);
        } else {
          transaction._mergeStructs.push(item);
        }
        item = item.right;
      }
      this.type._map.forEach((item2) => {
        if (!item2.deleted) {
          item2.delete(transaction);
        } else {
          transaction._mergeStructs.push(item2);
        }
      });
      transaction.changed.delete(this.type);
    }
    gc(store) {
      let item = this.type._start;
      while (item !== null) {
        item.gc(store, true);
        item = item.right;
      }
      this.type._start = null;
      this.type._map.forEach((item2) => {
        while (item2 !== null) {
          item2.gc(store, true);
          item2 = item2.left;
        }
      });
      this.type._map = /* @__PURE__ */ new Map();
    }
    write(encoder, offset) {
      this.type._write(encoder);
    }
    getRef() {
      return 7;
    }
  };
  var splitItem = (transaction, leftItem, diff) => {
    const { client, clock } = leftItem.id;
    const rightItem = new Item(createID(client, clock + diff), leftItem, createID(client, clock + diff - 1), leftItem.right, leftItem.rightOrigin, leftItem.parent, leftItem.parentSub, leftItem.content.splice(diff));
    if (leftItem.deleted) {
      rightItem.markDeleted();
    }
    if (leftItem.keep) {
      rightItem.keep = true;
    }
    if (leftItem.redone !== null) {
      rightItem.redone = createID(leftItem.redone.client, leftItem.redone.clock + diff);
    }
    leftItem.right = rightItem;
    if (rightItem.right !== null) {
      rightItem.right.left = rightItem;
    }
    transaction._mergeStructs.push(rightItem);
    if (rightItem.parentSub !== null && rightItem.right === null) {
      rightItem.parent._map.set(rightItem.parentSub, rightItem);
    }
    leftItem.length = diff;
    return rightItem;
  };
  var Item = class extends AbstractStruct {
    constructor(id, left, origin, right, rightOrigin, parent, parentSub, content) {
      super(id, content.getLength());
      this.origin = origin;
      this.left = left;
      this.right = right;
      this.rightOrigin = rightOrigin;
      this.parent = parent;
      this.parentSub = parentSub;
      this.redone = null;
      this.content = content;
      this.info = this.content.isCountable() ? BIT2 : 0;
    }
    set marker(isMarked) {
      if ((this.info & BIT4) > 0 !== isMarked) {
        this.info ^= BIT4;
      }
    }
    get marker() {
      return (this.info & BIT4) > 0;
    }
    get keep() {
      return (this.info & BIT1) > 0;
    }
    set keep(doKeep) {
      if (this.keep !== doKeep) {
        this.info ^= BIT1;
      }
    }
    get countable() {
      return (this.info & BIT2) > 0;
    }
    get deleted() {
      return (this.info & BIT3) > 0;
    }
    set deleted(doDelete) {
      if (this.deleted !== doDelete) {
        this.info ^= BIT3;
      }
    }
    markDeleted() {
      this.info |= BIT3;
    }
    getMissing(transaction, store) {
      if (this.origin && this.origin.client !== this.id.client && this.origin.clock >= getState(store, this.origin.client)) {
        return this.origin.client;
      }
      if (this.rightOrigin && this.rightOrigin.client !== this.id.client && this.rightOrigin.clock >= getState(store, this.rightOrigin.client)) {
        return this.rightOrigin.client;
      }
      if (this.parent && this.parent.constructor === ID && this.id.client !== this.parent.client && this.parent.clock >= getState(store, this.parent.client)) {
        return this.parent.client;
      }
      if (this.origin) {
        this.left = getItemCleanEnd(transaction, store, this.origin);
        this.origin = this.left.lastId;
      }
      if (this.rightOrigin) {
        this.right = getItemCleanStart(transaction, this.rightOrigin);
        this.rightOrigin = this.right.id;
      }
      if (this.left && this.left.constructor === GC || this.right && this.right.constructor === GC) {
        this.parent = null;
      }
      if (!this.parent) {
        if (this.left && this.left.constructor === Item) {
          this.parent = this.left.parent;
          this.parentSub = this.left.parentSub;
        }
        if (this.right && this.right.constructor === Item) {
          this.parent = this.right.parent;
          this.parentSub = this.right.parentSub;
        }
      } else if (this.parent.constructor === ID) {
        const parentItem = getItem(store, this.parent);
        if (parentItem.constructor === GC) {
          this.parent = null;
        } else {
          this.parent = parentItem.content.type;
        }
      }
      return null;
    }
    integrate(transaction, offset) {
      if (offset > 0) {
        this.id.clock += offset;
        this.left = getItemCleanEnd(transaction, transaction.doc.store, createID(this.id.client, this.id.clock - 1));
        this.origin = this.left.lastId;
        this.content = this.content.splice(offset);
        this.length -= offset;
      }
      if (this.parent) {
        if (!this.left && (!this.right || this.right.left !== null) || this.left && this.left.right !== this.right) {
          let left = this.left;
          let o;
          if (left !== null) {
            o = left.right;
          } else if (this.parentSub !== null) {
            o = this.parent._map.get(this.parentSub) || null;
            while (o !== null && o.left !== null) {
              o = o.left;
            }
          } else {
            o = this.parent._start;
          }
          const conflictingItems = /* @__PURE__ */ new Set();
          const itemsBeforeOrigin = /* @__PURE__ */ new Set();
          while (o !== null && o !== this.right) {
            itemsBeforeOrigin.add(o);
            conflictingItems.add(o);
            if (compareIDs(this.origin, o.origin)) {
              if (o.id.client < this.id.client) {
                left = o;
                conflictingItems.clear();
              } else if (compareIDs(this.rightOrigin, o.rightOrigin)) {
                break;
              }
            } else if (o.origin !== null && itemsBeforeOrigin.has(getItem(transaction.doc.store, o.origin))) {
              if (!conflictingItems.has(getItem(transaction.doc.store, o.origin))) {
                left = o;
                conflictingItems.clear();
              }
            } else {
              break;
            }
            o = o.right;
          }
          this.left = left;
        }
        if (this.left !== null) {
          const right = this.left.right;
          this.right = right;
          this.left.right = this;
        } else {
          let r;
          if (this.parentSub !== null) {
            r = this.parent._map.get(this.parentSub) || null;
            while (r !== null && r.left !== null) {
              r = r.left;
            }
          } else {
            r = this.parent._start;
            this.parent._start = this;
          }
          this.right = r;
        }
        if (this.right !== null) {
          this.right.left = this;
        } else if (this.parentSub !== null) {
          this.parent._map.set(this.parentSub, this);
          if (this.left !== null) {
            this.left.delete(transaction);
          }
        }
        if (this.parentSub === null && this.countable && !this.deleted) {
          this.parent._length += this.length;
        }
        addStruct(transaction.doc.store, this);
        this.content.integrate(transaction, this);
        addChangedTypeToTransaction(transaction, this.parent, this.parentSub);
        if (this.parent._item !== null && this.parent._item.deleted || this.parentSub !== null && this.right !== null) {
          this.delete(transaction);
        }
      } else {
        new GC(this.id, this.length).integrate(transaction, 0);
      }
    }
    get next() {
      let n = this.right;
      while (n !== null && n.deleted) {
        n = n.right;
      }
      return n;
    }
    get prev() {
      let n = this.left;
      while (n !== null && n.deleted) {
        n = n.left;
      }
      return n;
    }
    get lastId() {
      return this.length === 1 ? this.id : createID(this.id.client, this.id.clock + this.length - 1);
    }
    mergeWith(right) {
      if (this.constructor === right.constructor && compareIDs(right.origin, this.lastId) && this.right === right && compareIDs(this.rightOrigin, right.rightOrigin) && this.id.client === right.id.client && this.id.clock + this.length === right.id.clock && this.deleted === right.deleted && this.redone === null && right.redone === null && this.content.constructor === right.content.constructor && this.content.mergeWith(right.content)) {
        const searchMarker = this.parent._searchMarker;
        if (searchMarker) {
          searchMarker.forEach((marker) => {
            if (marker.p === right) {
              marker.p = this;
              if (!this.deleted && this.countable) {
                marker.index -= this.length;
              }
            }
          });
        }
        if (right.keep) {
          this.keep = true;
        }
        this.right = right.right;
        if (this.right !== null) {
          this.right.left = this;
        }
        this.length += right.length;
        return true;
      }
      return false;
    }
    delete(transaction) {
      if (!this.deleted) {
        const parent = this.parent;
        if (this.countable && this.parentSub === null) {
          parent._length -= this.length;
        }
        this.markDeleted();
        addToDeleteSet(transaction.deleteSet, this.id.client, this.id.clock, this.length);
        addChangedTypeToTransaction(transaction, parent, this.parentSub);
        this.content.delete(transaction);
      }
    }
    gc(store, parentGCd) {
      if (!this.deleted) {
        throw unexpectedCase();
      }
      this.content.gc(store);
      if (parentGCd) {
        replaceStruct(store, this, new GC(this.id, this.length));
      } else {
        this.content = new ContentDeleted(this.length);
      }
    }
    write(encoder, offset) {
      const origin = offset > 0 ? createID(this.id.client, this.id.clock + offset - 1) : this.origin;
      const rightOrigin = this.rightOrigin;
      const parentSub = this.parentSub;
      const info = this.content.getRef() & BITS5 | (origin === null ? 0 : BIT8) | (rightOrigin === null ? 0 : BIT7) | (parentSub === null ? 0 : BIT6);
      encoder.writeInfo(info);
      if (origin !== null) {
        encoder.writeLeftID(origin);
      }
      if (rightOrigin !== null) {
        encoder.writeRightID(rightOrigin);
      }
      if (origin === null && rightOrigin === null) {
        const parent = this.parent;
        if (parent._item !== void 0) {
          const parentItem = parent._item;
          if (parentItem === null) {
            const ykey = findRootTypeKey(parent);
            encoder.writeParentInfo(true);
            encoder.writeString(ykey);
          } else {
            encoder.writeParentInfo(false);
            encoder.writeLeftID(parentItem.id);
          }
        } else if (parent.constructor === String) {
          encoder.writeParentInfo(true);
          encoder.writeString(parent);
        } else if (parent.constructor === ID) {
          encoder.writeParentInfo(false);
          encoder.writeLeftID(parent);
        } else {
          unexpectedCase();
        }
        if (parentSub !== null) {
          encoder.writeString(parentSub);
        }
      }
      this.content.write(encoder, offset);
    }
  };
  var glo = typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  var importIdentifier = "__ $YJS$ __";
  if (glo[importIdentifier] === true) {
    console.error("Yjs was already imported. This breaks constructor checks and will lead to isssues!");
  }
  glo[importIdentifier] = true;

  // input.ts
  function createDoc(x) {
    const doc2 = new Doc();
    doc2.getArray("list").push([x]);
    return x;
  }
  return __toCommonJS(input_exports);
})();

return plv8ify.createDoc(x)

$_$;


ALTER FUNCTION public.plv8ify_createdoc(x double precision) OWNER TO postgres;

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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: supabase_storage_admin
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


ALTER FUNCTION storage.update_updated_at_column() OWNER TO supabase_storage_admin;

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: supabase_auth_admin
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
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
-- Name: boulders_copy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.boulders_copy (
    id uuid,
    location extensions.geometry(Point),
    name character varying(500),
    "isHighball" boolean,
    "mustSee" boolean,
    "dangerousDescent" boolean,
    images public.img[],
    "topoId" uuid
);


ALTER TABLE public.boulders_copy OWNER TO postgres;

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
    users integer NOT NULL,
    ratio double precision NOT NULL,
    placeholder text
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
-- Name: topo_accesses_copy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topo_accesses_copy (
    id uuid,
    danger character varying(5000),
    difficulty smallint,
    duration integer,
    steps public.topo_access_step[],
    "topoId" uuid
);


ALTER TABLE public.topo_accesses_copy OWNER TO postgres;

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
-- Name: accounts check_user_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_user_update BEFORE UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION internal.check_user_update();


--
-- Name: topo_accesses delete_images; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_images AFTER DELETE ON public.topo_accesses FOR EACH ROW EXECUTE FUNCTION internal.on_access_delete();


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
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: supabase_admin
--

CREATE TRIGGER tr_check_filters BEFORE INSERT OR UPDATE ON realtime.subscription FOR EACH ROW EXECUTE FUNCTION realtime.subscription_check_filters();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: supabase_storage_admin
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


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

CREATE POLICY "Draft topos can be modified by contributors" ON public.topos FOR UPDATE USING (public.can_edit_topo(id)) WITH CHECK (public.can_edit_topo(id));


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

CREATE POLICY "Topo visibility" ON public.topos FOR SELECT USING (true);


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
-- Name: accounts Users can see their own account; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can see their own account" ON public.accounts FOR SELECT USING ((id = auth.uid()));


--
-- Name: accounts Users can update their own account; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Users can update their own account" ON public.accounts FOR UPDATE USING ((id = auth.uid()));


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
-- Name: SCHEMA graphql_public; Type: ACL; Schema: -; Owner: supabase_admin
--

GRANT USAGE ON SCHEMA graphql_public TO postgres;
GRANT USAGE ON SCHEMA graphql_public TO anon;
GRANT USAGE ON SCHEMA graphql_public TO authenticated;
GRANT USAGE ON SCHEMA graphql_public TO service_role;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


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
-- Name: FUNCTION get_contributor_topos(_user_id uuid); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.get_contributor_topos(_user_id uuid) TO anon;
GRANT ALL ON FUNCTION public.get_contributor_topos(_user_id uuid) TO authenticated;
GRANT ALL ON FUNCTION public.get_contributor_topos(_user_id uuid) TO service_role;


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
-- Name: FUNCTION plv8ify_createdoc(x double precision); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.plv8ify_createdoc(x double precision) TO anon;
GRANT ALL ON FUNCTION public.plv8ify_createdoc(x double precision) TO authenticated;
GRANT ALL ON FUNCTION public.plv8ify_createdoc(x double precision) TO service_role;


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
-- Name: TABLE boulders_copy; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.boulders_copy TO anon;
GRANT ALL ON TABLE public.boulders_copy TO authenticated;
GRANT ALL ON TABLE public.boulders_copy TO service_role;


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
-- Name: TABLE topo_accesses_copy; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.topo_accesses_copy TO anon;
GRANT ALL ON TABLE public.topo_accesses_copy TO authenticated;
GRANT ALL ON TABLE public.topo_accesses_copy TO service_role;


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

