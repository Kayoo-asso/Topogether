import React, { useMemo } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from 'helpers/services';
import { isUUID, TopoData } from 'types';
import { RootBuilder } from 'components/pages';
import { editTopo, decodeUUID } from 'helpers';
import { fakeTopov2 } from 'helpers/fakeData/fakeTopoV2';

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
  if (typeof id !== "string") return redirect("/");

  const expanded = decodeUUID(id);
  if (!isUUID(expanded)) return redirect("/");

  // const [topo, canEdit] = await Promise.all([
  //   api.getTopo(expanded),
  //   api.client.rpc<boolean>("can_edit_topo", { _topo_id: expanded }).single()
  // ]);

  const canEdit = { data: true };
  const topo = fakeTopov2;

  if (topo && canEdit.data === true) {
    return { props: { topo } };
  }
  return { notFound: true };
}

const BuilderMapPage: NextPage<BuilderProps> = ({ topo }) => {
  const quark = useMemo(() => editTopo(topo), []);
  return <RootBuilder topoQuark={quark} />
};

export default BuilderMapPage;
