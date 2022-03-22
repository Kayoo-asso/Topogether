import { Quark } from "helpers/quarky";
import { api, AuthResult, sync } from "helpers/services";
import { editTopo, quarkifyTopo } from "helpers/topo";
import { Topo } from "types";
import { fakeAdmin, fakeTopoUUID, fakeTopov2 } from "./fakeTopoV2";
import { loginFakeAdmin } from "./loginFakeAdmin";
import { seedLocalDb } from "./seedLocalDb";

export async function getFakeTopo(): Promise<Quark<Topo>> {
    if (process.env.NODE_ENV !== 'development') {
        throw new Error("Should not be attempting to use getFakeTopo outside development environment");
    }
    // sign in or sign up
    const user = await loginFakeAdmin();

    console.log("Getting fake topo");
    // get fake topo from DB, or save it in DB
    const topoInDB = await api.getTopo(fakeTopoUUID);

    if (topoInDB) {
        return editTopo(topoInDB);
    }

    return await seedLocalDb();
}