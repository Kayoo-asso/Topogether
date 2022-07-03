import { RootDashboard } from "components/pages/RootDashboard";
import { quarkifyLightTopos } from "helpers/quarkifyTopo";
import { loginRedirect, getSessionId, withRouting } from "helpers/serverStuff";
import { api } from "helpers/services";
import { DBLightTopo } from "types";

type DashboardProps = {
	myTopos: DBLightTopo[];
};

export default withRouting<DashboardProps>({
	async getInitialProps(ctx) {
		const userId = getSessionId(ctx);
		if (!userId) {
			return loginRedirect("/builder/dashboard");
		}
		const myTopos = await api.getLightTopos({ userId });
		return { props: { myTopos } };
	},
	render({ myTopos }) {
		return <RootDashboard lightTopos={quarkifyLightTopos(myTopos)} />;
	},
});
