import React, { useEffect } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Error404, HeaderDesktop, Loading, RootWorldMap } from 'components';
import { useAsyncData } from 'helpers/hooks/useAsyncData';
import { api, auth } from 'helpers/services';
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

  return (
    <RootWorldMap
      lightTopos={topos}
      user={session}
    />
  );
};

export default WorldMapPage;
