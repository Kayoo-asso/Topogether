import React, { useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { RootWorldMap } from 'components';
import { api } from 'helpers/services';
import { useSession } from 'helpers/hooks/useSession';
import { LightTopo } from 'types';

type WorldMapProps = {
  topos: LightTopo[];
}

export const getServerSideProps: GetServerSideProps<WorldMapProps> = async ({ req }) => {
  const topos = await api.getLightTopos();
  return { props: { topos } }
}

const WorldMapPage: NextPage<WorldMapProps> = ({ topos }) => {
  const session = useSession();

  useEffect(() => {
    async function contactWorker() {
      await navigator.serviceWorker.ready;
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ command: 'log', message: 'hello world' })
      }
    }

    contactWorker();
  }, []);

  return (
    <RootWorldMap
      lightTopos={topos}
      user={session}
    />
  );
};

export default WorldMapPage;