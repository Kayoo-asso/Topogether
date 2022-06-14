# Topogether
[Topogether](https://topogether.com/) is an outdoor climbing app, providing interactive maps of climbing spots and tools for collaborative cartography.

Currently only available in French, sorry!

## Tech stack
- **React** + **Next.js**
- **Tailwind CSS**
- **Google Maps**
- **Vercel** for hosting the app and API routes
- **Supabase**, for authentication and a CRUD REST API directly integrated with Postgres
- **Postgres** as our database, leveraging its awesome authorization and text search features
- **PostGIS** for geospatial data
- **Cloudflare Images** for hosting & serving user-uploaded images

## Ongoing work
### Content and features
- Add topos, both by ourselves & by bringing in more contributors on the platform.
- Get more users to go climbing outdoors with the app (especially when topo downloads become available).
- Work on the offline UI, so it's clear about what is possible or not, based on online / offline status
- Enable the creation of "community tracks" on published boulders.
- Add up/down-voting for grading tracks.
- Add track ratings and comments.

### Infrastructure
- **Moving from Quarky**, our awesome handmade reactive system, to [`react-easy-state`](https://github.com/RisingStack/react-easy-state) for state management. Quarky will be rewritten using proxies when we start implementing offline collaboration.
- **Convert the app to use [Remix](https://remix.run/)** instead of [Next.js](https://nextjs.org/), to benefit from nested routing. This will be essential to give each menu a distinct URL, so that the back button works as expected of a native app on mobile.
- **Replace Google Maps with [Mapbox](https://www.mapbox.com/)** and [MapLibre](https://maplibre.org/). OpenStreetMap data is generally better and the open standard for (x,y,z) tiles enables reliable download for offline use and flexibility in our tool choice.
- **Deploy as a Node.js app + Postgres database on [Fly.io](https://fly.io/).** Subgoals:
    - Build our authentication with [Passport.js](https://www.passportjs.org/) and [`express-session`](https://github.com/expressjs/session), to enable long offline sessions.
    - Port our current Postgres database to a self-hosted setup.
    - Use [Postgraphile](https://www.graphile.org/postgraphile/) to generate a GraphQL API from Postgres.
    - Completely remove Supabase.
- **Implement single-player offline mode**, with topo downloads and offline work. This will be done by hand, just storing full topos in IndexedDB, alongside a "diff tree" to extract exactly the entities that have been created / update / deleted when syncing.
- Start working on [**offline + collaborative** using conflict-free replicated data types](https://erwinkn.com/getting-crdts-to-production/).

### Steps to migrate out of Supabase client
- Setup auth endpoints that set the Supabase JWT into a cookie and then give it back to the DB
- Convert all Supabase client DB queries into plain SQL (especially getTopo), using postgres-js or Zapatos


## Future plans
- Internationalization
- React Native / Electron versions?
- Move to [Solid.js](https://www.solidjs.com/) once their `solid-start` framework is out and relatively stable. This will drastically improve performance & battery life.
