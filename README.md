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
- ImageInput onChange in MapControl
- MapControl use of breakpoint
- Download status
- Only have one TopoFilters component + responsive CSS
- Cleanups
  - SelectListMultiple
    - `getClassName`
    - The hover styling for either the active element or all elements on mobile seems weird
  - Too many sliders
- Remove packages:
  - Supabase
  - cookie
  - postgres
- Delete Amenities bitflag
- Remove all traces of `useLoader`
- Use a proper form library
- Look into using [`shadcn/ui`](https://ui.shadcn.com/) components
  - Remove `react-compound-slider`

### Changes to check
- TopoFilters
- Styling converted from breakpoint to `md:` variant
  - SelectListMultiple hover styling
  - MapControl bottom center controls z-index
  - MapControl bottom right controls z-index and bottom padding
- `cursor-pointer` behavior for GradeCircle

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