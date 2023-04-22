# Topogether

[Topogether](https://topogether.com/) is an outdoor climbing app, providing interactive maps of climbing spots and tools for collaborative cartography.

Currently only available in French, sorry!

## Tech stack

- **T3 stack + Drizzle ORM**
- **Mapbox + OpenLayers**
- **Vercel**, hosting
- **Clerk**, auth provider
- **Postgres + PostGIS**, database system
- **Neon**, database provider
- **Bunny**, image hosting and CDN

## Backend rework
- Type-safe environment variables (like t3-stack)

### TODO
- LighTopo.grades
- Download status
- Only have on TopoFilters component + responsive CSS
- Remove packages:
  - Supabase
  - cookie
  - postgres

### Changes to check
- TopoFilters

### Content and features

- Add topos, both by ourselves & by bringing in more contributors on the platform.
- Get more users to go climbing outdoors with the app (especially when topo downloads become available).
- Work on the offline UI, so it's clear about what is possible or not, based on online / offline status
- Enable the creation of "community tracks" on published boulders.
- Add up/down-voting for grading tracks.
- Add track ratings and comments.


## Future plans

- Internationalization
- React Native / Electron versions?