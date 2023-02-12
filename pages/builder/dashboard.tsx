import { useQuery } from "@tanstack/react-query";
import { RootDashboard } from "components/pages/RootDashboard";
import { downloads } from "helpers/downloads/DownloadManager";
import { quarkifyLightTopos } from "helpers/quarkifyTopo";
import { loginRedirect, getSessionId, withRouting } from "helpers/serverStuff";
import { api } from "helpers/services";
import { DBLightTopo, TopoData } from "types";

type DashboardProps = {
	myTopos: DBLightTopo[];
	likedTopos: DBLightTopo[];
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

		return { props: { 
			myTopos, 
			likedTopos,
		}};
	},
	render(props) {
		const { isLoading, error, data } = useQuery({
			queryKey: ['dlTopos'],
			queryFn: async () => {
				const dlTopos = await downloads.getOfflineToposList();
				return dlTopos.map(t => topoData2DBLightTopo(t));
			}
		});
		const lightDlTopos = data || [];
		
		return <RootDashboard 
			myTopos={quarkifyLightTopos(props.myTopos)} 
			likedTopos={quarkifyLightTopos(props.likedTopos)} 
			dlTopos={quarkifyLightTopos(lightDlTopos)}
		/>;
	},
});
