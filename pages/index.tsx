import type { NextPage } from "next";
import { api } from "helpers/services";
import { DBLightTopo, TopoStatus } from "types";
import { quarkifyLightTopos } from "helpers/quarkifyTopo";
import { RootWorldMap } from "components/map";

type WorldMapProps = {
  topos: DBLightTopo[];
};

const WorldMapPage: NextPage<WorldMapProps> = ({ topos }) => {
  return <RootWorldMap lightTopos={quarkifyLightTopos(topos)} />;
};

WorldMapPage.getInitialProps = async (ctx) => {
  const topos = await api.getLightTopos({ status: TopoStatus.Validated });
  return { topos };
};

export default WorldMapPage;
