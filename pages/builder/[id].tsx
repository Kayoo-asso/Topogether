import { useMemo } from "react";
import { api } from "helpers/services";
import { isUUID, TopoData } from "types";
import { RootBuilder } from "components/builder";
import { editTopo } from "helpers/quarkifyTopo";
import { withRouting } from "helpers/serverStuff";
import { decodeUUID } from "helpers/utils";

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
    const topoQuark = useMemo(() => editTopo(topo), [topo]);
    return <RootBuilder topoQuark={topoQuark} />;
  },
});
