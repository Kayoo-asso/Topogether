import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { RootTopo } from 'components';
import { editTopo } from 'helpers';
import { isUUID, TopoData } from 'types';
import { api } from 'helpers/services';

type TopoProps = {
  topo: TopoData,
}

const redirect = (destination: string) => ({
  redirect: {
    destination,
    permanent: false
  }
});

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;
  if (typeof id !== "string" || !isUUID(id)) {
    return redirect("/");
  }

  const topo = await api.getTopo(id);


  if (!topo) {
    return redirect("/404");
  }

  return { props: { topo } };
}

const Topo: NextPage<TopoProps> = ({ topo }) => {
  // TODO: how to encode the fact that this topo cannot be edited?
  const topoQuark = editTopo(topo);
  return (
    <RootTopo 
      topoQuark={topoQuark}
    />
  );
};

Topo.displayName = "TopoPage";

export default Topo;