import { RootTopo } from "components/pages/RootTopo";
import { isUUID, TopoData, TopoTypes } from "types";
import { api } from "helpers/services";
import { useRouter } from "next/router";
import { editTopo } from "helpers/quarkifyTopo";
import { decodeUUID } from "helpers/utils";
import { withRouting } from "helpers/serverStuff";
import { createContext, useMemo } from "react";

type TopoProps = {
	topo: TopoData;
};

export const TopoTypeContext = createContext<TopoTypes>(0);

const getRidOfBouldersWithoutTrack = (topo: TopoData) => {
	topo.lonelyBoulders = topo.lonelyBoulders.filter(id => topo.boulders.find(b => b.id === id)!.tracks.length > 0)
	topo.sectors = topo.sectors.map(s => ({ ...s, boulders: s.boulders.filter(id => topo.boulders.find(b => b.id === id)!.tracks?.length > 0) }));
	topo.boulders = topo.boulders.filter(b => b.tracks.length > 0);
}

export default withRouting<TopoProps>({
	async getInitialProps({ query, res }) {
		const { id } = query;
		if (typeof id !== "string") return { notFound: true };
	
		const expanded = decodeUUID(id);
		if (!isUUID(expanded)) return { notFound: true };
	
		const topo = await api.getTopo(expanded);
	
		// Try to redirect on server
		if (!topo) {
			return { notFound: true };
		}
	
		return { props: { topo } };
	},

	render({ topo }) {
		// Hack to redirect on client-side, in case we can't do it from the server
		const router = useRouter();
		if (!topo) {
			router.push("/");
			return null;
		}
		const { show } = router.query;
		if (show !== "all") {
			getRidOfBouldersWithoutTrack(topo);
		}

		const topoQuark = useMemo(() => editTopo(topo), []);
		return (
			<TopoTypeContext.Provider value={topoQuark().type}>
				<RootTopo topoQuark={topoQuark} />
			</TopoTypeContext.Provider>
		);
	},
});
