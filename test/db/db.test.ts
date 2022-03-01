import { createClient } from "@supabase/supabase-js";
import { fakeTopo } from "helpers/fakeData/fakeTopo";
import { quarkTopo } from "helpers/fakeData/fakeTopoV2";
import { api } from "helpers/services/ApiService";
import { LinearRing, LineCoords, LineString, MultiPolygon, Point, Position, Topo } from "types";
import { v4 as uuid } from "uuid";

const client = api.client;

test("Saving topo", async () => {
    await api.saveTopo(fakeTopo);
});
