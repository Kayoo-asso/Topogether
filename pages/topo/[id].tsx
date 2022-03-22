import React from 'react';
import type { NextPage } from 'next';
import { Error404, Header, Loading, RootTopo } from 'components';
import { useRouter } from 'next/router';
import { editTopo, quarkifyTopo } from 'helpers';
import { isUUID, Topo } from 'types';
import { watchDependencies } from 'helpers/quarky';
import { api } from 'helpers/services';
import { useAsyncData } from 'helpers/hooks/useAsyncData';

export async function getServerSideProps() {
  const data = {};
  return { props: { data } }
}

const Topo: NextPage = watchDependencies(() => {
  const router = useRouter();
  const id = router.query.id?.toString();
  if (!id || !isUUID(id)) { () => router.push('/'); return null; }

  const topoQuery = useAsyncData(() => api.getTopo(id), [id]);

  // ERROR
  if (topoQuery.type === 'error') { () => router.push('/'); return null; }

  //LOADING
  else if (topoQuery.type === 'loading') return (
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
    if (!topoQuery.data) return <Error404 title='Topo introuvable' />
    else {
      const topoQuark = editTopo(topoQuery.data);
      return (
        <RootTopo 
          topoQuark={topoQuark}
        />
      );
    }
  }
});

Topo.displayName = "TopoPage";

export default Topo;