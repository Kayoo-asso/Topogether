import { createClient } from "@supabase/supabase-js";
import exp from "constants";
import { images, topoData } from "helpers/fakeData/fakeTopoV2";
import { api, AuthResult } from "helpers/services/ApiService";
import { DBParking, DBTopo, Email, LinearRing, LineCoords, LineString, MultiPolygon, Name, Point, Position, Topo, TopoData, User, UUID } from "types";
import { v4 as uuid } from "uuid";
import { usersShouldBeEqual } from "./equality";

const client = api.client;
const masterClient = createClient(
    process.env.NEXT_PUBLIC_API_URL!,
    process.env.API_MASTER_KEY_LOCAL!
);

const user: User = {
    id: undefined as any, // placeholder
    userName: "Superwin" as Name,
    email: "superwin@kayoo.io" as Email,
    role: "USER", // testing user-level permissions
    created: (new Date()).toISOString(),

    firstName: "Erwin" as Name,
    lastName: "Kuhn" as Name,
    country: "France" as Name,
    city: "Lyon" as Name,
    phone: "+33699320064" as any,
    birthDate: '1998-03-06',

    imagePath: "TODO",
}

const password = 'lalalalala';

type TopoContributor = {
    topo_id: UUID,
    user_id: UUID,
    role: 'CONTRIBUTOR' | 'ADMIN'
}

test("Integration test: signing up & saving topo", async () => {
    // Login or signup
    const signIn = await api.signIn(user.email, password);
    if (signIn !== AuthResult.Success) {
        const authRes = await api.signup(
            user.email,
            password,
            user.userName
        );
        expect(authRes).toBe(AuthResult.Success);
    }

    // update the UUID in the data to match the one we got on sign up
    user.id = api.user()!.id; // important
    topoData.creator = user;
    topoData.boulders = topoData.boulders.map(b => ({
        ...b,
        tracks: b.tracks.map(t => ({
            ...t,
            creatorId: user.id
        }))
    }));


    // Update the profile
    const updateProfile = await api.updateUserInfo(user);
    expect(updateProfile).toBe(AuthResult.Success);
    const userFromDb = await client
        .from<User>("users")
        .select('*')
        .match({ id: user.id })
        .single();
    expect(userFromDb.error).toBe(null);
    // does not compare the `created` dates
    usersShouldBeEqual(userFromDb.data!, user);

    // Save the fake topo
    const topoSave = await api.saveTopo(topoData);
    expect(topoSave).toBe(true);

    // Check the current user was added as topo admin
    const { data, error } = await client
        .from<TopoContributor>("topo_contributors")
        .select('*')
        .match({ topo_id: topoData.id })
        .single();
    expect(error).toBe(null);
    expect(data).toStrictEqual({
        topo_id: topoData.id,
        user_id: user.id,
        role: "ADMIN"
    });

    // Get from DB and compare
    const topoFromDb = await api.getTopo2(topoData.id);
    // const expected: TopoData = {
    //     ...topoData,
    // }
    expect(topoFromDb).toStrictEqual(topoData);

    // Clean the DB
    const topoDelete = await client
        .from<DBTopo>("topos")
        .delete()
        .match({
            id: topoData.id
        });
    expect(topoDelete.error).toBe(null);

    // Deleting one's own profile should be doable from the regular client
    const deleteUser = await client
        .from("users")
        .delete()
        .match({ id: user.id });
    expect(deleteUser.error).toBe(null);
});

type GeomTest = {
    id: number,
    location: Point
};

type GeomResult = {
    id: number,
    location: Position
}

test.skip("Inserting point into geography column", async () => {
    const row: GeomTest = {
        id: 1,
        location: {
            type: "Point",
            coordinates: [1, 2]
        }
    };
    const res = await client
        .from<GeomTest>("test_geom")
        .insert(row);
    expect(res.error).toBe(null);
    const fromDb = await client
        .from<GeomTest>("test_geom")
        .select('*')
        .match({ id: 1 })
        .single();
    expect(fromDb.error).toBe(null);
    expect(fromDb.data).toStrictEqual(row);
});