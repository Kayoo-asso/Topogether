import React from 'react';
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

  return (
    <RootWorldMap
      lightTopos={topos}
      user={session}
    />
  );
};

export default WorldMapPage;