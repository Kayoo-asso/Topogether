import { api } from "helpers/services";
import { topoData } from "./fakeTopoV2";

export const saveFakeTopo = async () => {
    const session = api.user();
    const topo = topoData;

    if (session) {
        topo.creator = session;
        for (const boulder of topo.boulders) {
            for (const track of boulder.tracks) {
                track.creatorId = session?.id;
            }
        }
        const res = await api.saveTopo(topo);
        console.log(res);
    }
}