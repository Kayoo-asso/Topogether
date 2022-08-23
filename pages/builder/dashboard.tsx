import { RootDashboard } from "components/pages/RootDashboard";
import { quarkifyLightTopos } from "helpers/quarkifyTopo";
import { loginRedirect, getSessionId, withRouting } from "helpers/serverStuff";
import { api } from "helpers/services";
import { DBLightTopo } from "types";

type DashboardProps = {
	myTopos: DBLightTopo[];
	likedTopos: DBLightTopo[];
};

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
			likedTopos 
		}};
	},
	render(props) {
		return <RootDashboard 
			myTopos={quarkifyLightTopos(props.myTopos)} 
			likedTopos={quarkifyLightTopos(props.likedTopos)} 
			dlTopos={quarkifyLightTopos([])} //TODO when dl is ready
		/>;
	},
});
