import { api } from "helpers/services";
import { RootAdmin } from "components/pages/RootAdmin";
import type { DBLightTopo, User } from "types";
import { quarkifyLightTopos } from "helpers/quarkifyTopo";
import {
	withRouting,
	getSessionId,
	loginRedirect,
	getUserInitialProps,
} from "helpers/serverStuff";

type AdminProps = {
	user: User & { role: "ADMIN" };
	topos: DBLightTopo[];
};
export default withRouting<AdminProps>({
	async getInitialProps(ctx) {
		const userId = getSessionId(ctx);
		if (!userId) return loginRedirect("/admin");

		const [user, topos] = await Promise.all([
			// using this function instead of `fetchUser(userId)` avoids a fetch on the client
			getUserInitialProps(ctx),
			api.getLightTopos(),
		]);

		if (!user) return loginRedirect("/admin");
		if (user.role !== "ADMIN") return { notFound: true };

		return {
			props: {
				user: user as AdminProps["user"],
				topos,
			},
		};
	},
	render({ user, topos }) {
		return <RootAdmin lightTopos={quarkifyLightTopos(topos)} />;
	},
});
