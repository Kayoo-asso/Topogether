import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { api } from 'helpers/services';
import { watchDependencies } from 'helpers/quarky';
import { isUUID, Session, TopoData } from 'types';
import { RootBuilder } from 'components';
import { editTopo} from 'helpers';
import { getServerSession } from 'helpers/getServerSession';
import { returnTo } from 'pages/user/login';

type BuilderProps = {
  topo: TopoData,
  session: Session
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

  const [topo, session] = await Promise.all([
    api.getTopo(id),
    getServerSession(req)
  ]);

  if (!session) {
    return redirect(
      `/user/login?${returnTo}=${encodeURIComponent(`/builder/${id}`)}`
    );
  }

  if (!topo) {
    return redirect("/404");
  }
  return { props: { topo, session } };
}

const BuilderMapPage: NextPage<BuilderProps> = watchDependencies(({ topo, session }) => {
  const quark = editTopo(topo);
  return <RootBuilder topoQuark={quark} session={session} />
});

export default BuilderMapPage;
