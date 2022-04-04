import { api, AuthService, sync } from "helpers/services";
import { createTopo, editTopo, quarkifyTopo } from "helpers/topo";
import { fakeAdmin, fakeTopov2 } from "./fakeTopoV2";

export async function seedLocalDb(auth: AuthService) {
    console.log("Called seedLocalDB");
    const topoInDb = await api.getTopo(fakeTopov2.id);
    if (topoInDb) {
        console.log("Found fake topo in DB");
        return editTopo(topoInDb);
    }
    
    const user = auth.session();
    if (user === null) {
        throw new Error("Cannot seed DB while being logged out");
    }

    fakeTopov2.creator = {
        ...fakeAdmin,
        id: user.id
    };
    console.log("Seeding localDB as user with ID ", user.id);
    for (const boulder of fakeTopov2.boulders) {
        for (const track of boulder.tracks) {
            track.creatorId = user.id;
        }
    }
    createTopo(fakeTopov2);
    const quark = quarkifyTopo(fakeTopov2, true);
    let res = await sync.attemptSync();
    let iters = 0;
    while (!res) {
        if (iters >= 10) {
            throw new Error("Synchronisation fails while seeding local DB (too many iterations)");
        }
        res = await sync.attemptSync();
        iters += 1;
    }
    return quark;
}