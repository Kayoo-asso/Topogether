import { useMemo } from "react";
import { api } from "helpers/services";
import { isUUID, TopoData } from "types";
import { editTopo } from "helpers/quarkifyTopo";
import { withRouting } from "helpers/serverStuff";
import { decodeUUID } from "helpers/utils";
import { RootBuilderOpenLayers } from "components/pages/RootBuilderOpenLayers";

type BuilderProps = {
	topo: TopoData;
};

const redirect = (destination: string) => ({
	redirect: {
		destination,
		permanent: false,
	},
});

// TODO: check the user is a contributor of the topo

export default withRouting<BuilderProps>({
	async getInitialProps({ query }) {
		const { id } = query;
		if (typeof id !== "string") return redirect("/");

		const expanded = decodeUUID(id);
		if (!isUUID(expanded)) return redirect("/");

		const [topo, canEdit] = await Promise.all([
			api.getTopo(expanded),
			api.client.rpc<boolean>("can_edit_topo", { _topo_id: expanded }).single(),
		]);

		if (topo && canEdit.data === true) {
			return { props: { topo } };
		}
		return { notFound: true };
	},

	render({ topo }) {
		// Memoize here, to avoid recreating a store from the initial page props after the first render
		// (ex: when the URL changes when the user selects a boulder)
		const topoQuark = useMemo(() => editTopo(topo), []);
		return <RootBuilderOpenLayers topoQuark={topoQuark} />;
	},
});
