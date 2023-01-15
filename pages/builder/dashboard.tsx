import { RootDashboard } from "components/pages/RootDashboard";
import { downloads } from "helpers/downloads/DownloadManager";
import { quarkifyLightTopos } from "helpers/quarkifyTopo";
import { loginRedirect, getSessionId, withRouting } from "helpers/serverStuff";
import { api } from "helpers/services";
import { DBLightTopo, TopoData } from "types";

type DashboardProps = {
	myTopos: DBLightTopo[];
	likedTopos: DBLightTopo[];
	lightDlTopos: DBLightTopo[];
};

const topoData2DBLightTopo = (t: TopoData): DBLightTopo => {
	const topo = {
		...t,
		nbSectors: t.sectors.length,
		nbBoulders: t.boulders.length,
		nbTracks: t.boulders.map(b => b.tracks.length).reduce((a,b) => a + b),
	}
	return topo;
}

export default withRouting<DashboardProps>({
	async getInitialProps(ctx) {
		const userId = getSessionId(ctx);
		if (!userId) {
			return loginRedirect("/builder/dashboard");
		}
		const myTopos = await api.getLightTopos({ userId });
		const likedTopos = await api.getLikedTopos(userId);
		// const dlTopos = [] as DBLightTopo[]; //TODO when dl is ready
		const dlTopos = await downloads.getOfflineToposList();
		const lightDlTopos = dlTopos.map(t => topoData2DBLightTopo(t));

		return { props: { 
			myTopos, 
			likedTopos,
			lightDlTopos,
		}};
	},
	render(props) {
		return <RootDashboard 
			myTopos={quarkifyLightTopos(props.myTopos)} 
			likedTopos={quarkifyLightTopos(props.likedTopos)} 
			dlTopos={quarkifyLightTopos(props.lightDlTopos)}
		/>;
	},
});
