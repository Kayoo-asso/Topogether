import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import { Error404, HeaderDesktop, Loading, RootWorldMap } from 'components';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { api, auth } from 'helpers/services';
import { useSession } from 'helpers/hooks/useSession';

export async function getServerSideProps() {
  const data = {};
  return { props: { data } }
}

const WorldMapPage: NextPage = () => {
  const session = useSession();
  // console.log(session);

  const toposQuery = useAsyncData(() => api.getLightTopos(), []);

  // ERROR
  if (toposQuery.type === 'error') return <Error404 title="Aucun topo n'a été trouvé" />

  //LOADING
  else if (toposQuery.type === 'loading') return (
    <>
      <HeaderDesktop
        title="Chargement des topos..."
        backLink='#'
        displayLogin={session ? false : true}
      />
      <Loading />
    </>
  )

  // SUCCESS
  else {
    // BUT NO DATA...
    if (!toposQuery.data) return <Error404 title="Aucun topo n'a été trouvé" />
    else {
      return (
        <RootWorldMap 
          lightTopos={toposQuery.data}
          user={session}
        />
      );
    }
  }
};

export default WorldMapPage;
