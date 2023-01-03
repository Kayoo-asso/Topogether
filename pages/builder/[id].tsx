import { useMemo } from "react";
import { api } from "helpers/services";
import { isUUID, TopoData } from "types";
import { editTopo } from "helpers/quarkifyTopo";
import { withRouting } from "helpers/serverStuff";
import { decodeUUID } from "helpers/utils";
import { RootBuilder } from "components/pages/RootBuilder";

type BuilderProps = {
	topo: TopoData;
};

// TODO: check the user is a contributor of the topo

export default withRouting<BuilderProps>({
	async getInitialProps({ query }) {
		const { id } = query;
		if (typeof id !== "string") return { notFound: true };

		const expanded = decodeUUID(id);
		if (!isUUID(expanded)) return { notFound: true };

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
		return (
			<>
				<RootBuilder topoQuark={topoQuark} />
			</>
		);
	},
});
