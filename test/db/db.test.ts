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

test("Inserting and recovering spatial data", async () => {
    const children: Children[] = [
        { id: 1, name: "foo" },
        { id: 2, name: "bar" },
        { id: 3, name: "baz" }
    ];
    const parent: Parent = {
        id: 1,
        children: [2, 1, 3]
    }
    console.log("Children insert result: ", JSON.stringify(
        await client.from<Children>("children").insert(children)
    ));
    console.log("Parent insert result: ", JSON.stringify(
        await client.from<Parent>("parents").insert(parent)
    ));
    const res2 = await client.rpc("children_in_order", {
        parent_id: 1
    });
    console.log("RPC result: ", JSON.stringify(res2));

    throw new Error();
});
