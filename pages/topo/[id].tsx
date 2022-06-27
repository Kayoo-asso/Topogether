import type { NextPage } from 'next';
import { RootTopo } from 'components';
import { editTopo, decodeUUID, useLoader } from 'helpers';
import { isUUID, TopoData } from 'types';
import { api } from 'helpers/services';
import { useRouter,  } from 'next/router';
import { ServerResponse } from 'http';

type TopoProps = {
  topo?: TopoData,
}

const redirect = (destination: string, res: ServerResponse | undefined) => {
  if (res) {
    res.writeHead(307, { Location: destination })
    res.end();
  }
  return { topo: undefined };
}


const Topo: NextPage<TopoProps> = ({ topo }) => {
  // Hack to redirect on client-side, in case we can't do it from the server
  const router = useRouter();
  if (!topo) {
    router.push("/");
    return null;
  }

  // TODO: how to encode the fact that this topo cannot be edited?
  const topoQuark = editTopo(topo);
  return <RootTopo topoQuark={topoQuark} />
};

Topo.getInitialProps = async ({ query, res  }) => {
  const { id } = query;
  if (typeof id !== "string") return { notFound: true };

  const expanded = decodeUUID(id);

  if (!isUUID(expanded)) return { notFound: true };

  const topo = await api.getTopo(expanded);
  
  // Try to redirect on server
  if (!topo) {
    return redirect("/", res);
  }

  return { topo };
}

Topo.displayName = "TopoPage";

export default Topo;