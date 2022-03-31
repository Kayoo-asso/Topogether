import React, { useMemo } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from 'helpers/services';
import { isUUID, TopoData, TopoStatus } from 'types';
import { RootBuilder } from 'components/pages';
import { editTopo } from 'helpers';

type BuilderProps = {
  topo: TopoData,
}

const redirect = (destination: string) => ({
  redirect: {
    destination,
    permanent: false
  }
});

// TODO: check the user is a contributor of the topo

export const getServerSideProps: GetServerSideProps<BuilderProps> = async ({ req, query, res }) => {
  const { id } = query;
  if (typeof id !== "string" || !isUUID(id)) {
    return redirect("/");
  }

  const topo = await api.getTopo(id);
  console.log("Calling builder getServerSideProps");


  if (!topo || topo.status !== TopoStatus.Draft) {
    return redirect("/404");
  }

  return { props: { topo } };
}

const BuilderMapPage: NextPage<BuilderProps> = ({ topo, }) => {
  const quark = useMemo(() => editTopo(topo), []);
  return <RootBuilder topoQuark={quark} />
};

export default BuilderMapPage;
