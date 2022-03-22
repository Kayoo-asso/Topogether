import React from 'react';
import type { NextPage } from 'next';
import { Error404, HeaderDesktop, Loading, RootWorldMap } from 'components';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { api } from 'helpers/services';
import { convertOldTopo } from 'helpers/fakeData/convertOldTopo';
import { Yzeron } from 'helpers/fakeData/YzeronOLD';
import { Payre } from 'helpers/fakeData/PayreOLD';

export async function getServerSideProps() {
  const data = {};
  return { props: { data } }
}

const WorldMapPage: NextPage = () => {
  const session = api.user();

  const toposQuery = useAsyncData(() => api.getAllLightTopos(), []);

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
