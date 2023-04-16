import { db } from "../api/db";
// import { api } from "../helpers/services";
import postgres from "postgres";
import { env } from "../src/env.mjs";
import { TopoStatus, UUID } from "types";
import { topos } from "db/schema";
import { ApiService, getSupaMasterClient } from "helpers/services";
import { createClient } from "@supabase/supabase-js";

const sql = postgres(env.SUPABASE_PGURL);
const api = new ApiService(createClient(
  env.SUPABASE_API_URL,
  env.SUPABASE_MASTER_KEY
));

const rows = await sql`SELECT id from public.topos`;
const topoIds = rows.map(x => x.id) as UUID[];

for(const id of topoIds) {
  const topo = (await api.getTopo(id))!;
  let status: "draft" | "submitted" | "validated";
  if(topo.status === TopoStatus.Draft) {
    status = "draft"
  }
  else if(topo.status === TopoStatus.Submitted) {
    status = "submitted";
  }
  else if(topo.status === TopoStatus.Validated) {
    status = "validated";
  }
  else {
    throw new Error("Unexpected topo status flag: " + topo.status)
  }
  await db.delete(topos);
  console.log("INSERT topos:", await db.insert(topos).values({
    // id: topo.id,
    // name: topo.name,
    // status: topo.status,
    // type: topo.type,
    // // trashed: default false

    // location: topo.location,
    // rockTypes: topo.rockTypes,
    // // bestSeason: null
    // forbidden: topo.forbidden,
    ...topo,
    status,
    submitted: topo.submitted ? new Date(topo.submitted) : undefined,
    modified: new Date(topo.modified),
    validated: topo.validated ? new Date(topo.validated) : undefined
  }))
  
}
console.log(topoIds)

process.exit(0);