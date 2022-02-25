import { createClient } from "@supabase/supabase-js";
import { fakeTopo } from "helpers/fakeData/fakeTopo";
import { api } from "helpers/services/ApiService";
import { LinearRing, LineCoords, LineString, MultiPolygon, Point, Position } from "types";
import { v4 as uuid } from "uuid";

const client = api.client;

type Data = {
    id: number,
    lineString: LineString
}

type Parent = {
    id: number,
    children: number[]
}

type Children = {
    id: number,
    name: string,
    // parent_id: number,
}

test.skip("Inserting and recovering spatial data", async () => {

    throw new Error();
});
