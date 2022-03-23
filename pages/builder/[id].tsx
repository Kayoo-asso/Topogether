import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { api } from 'helpers/services';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { Quark, watchDependencies } from 'helpers/quarky';
import { isUUID, Topo, TopoData } from 'types';
import { Error404, Header, Loading, RootBuilder } from 'components';
import { editTopo, quarkifyTopo } from 'helpers';

export async function getServerSideProps() {
  const data = {};
  return { props: { data } }
}

const BuilderMapPage: NextPage = watchDependencies(() => {
  const router = useRouter();
  const id = router.query.id?.toString();
  if (!id || !isUUID(id)) {
    router.push('/');
    return null;
  }

  const session = api.user();
  if (!session) { () => router.push('/'); return null; }

  const topoQuery = useAsyncData(() => api.getTopo(id), [id]);

  // ERROR
  if (topoQuery.type === 'error') { router.push('/'); return null; }

  //LOADING
  else if (topoQuery.type === 'loading') 
    return (
      <>
        <Header
          title="Chargement du topo..."
          backLink='/'
        />
        <Loading />
      </>
    )

  // SUCCESS
  else {
    // BUT NO DATA...
    if (!topoQuery.data) return <Error404 title="Topo introuvable" />
    else {
      const topoQuark: Quark<Topo> = editTopo(topoQuery.data);
      return (
        <RootBuilder 
          topoQuark={topoQuark}
          user={session}
        />
      );
    }
  }
});

export default BuilderMapPage;
