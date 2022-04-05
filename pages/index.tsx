import React from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { RootWorldMap } from 'components';
import { api } from 'helpers/services';
import { DBLightTopo } from 'types';
import { quarkifyLightTopos } from 'helpers';

type WorldMapProps = {
  topos: DBLightTopo[];
}

export const getServerSideProps: GetServerSideProps<WorldMapProps> = async ({ req }) => {
  const topos = await api.getLightTopos();
  return { props: { topos } }
}

const WorldMapPage: NextPage<WorldMapProps> = ({ topos }) => {
  return (
    <RootWorldMap
      lightTopos={quarkifyLightTopos(topos)}
    />
  );
};

export default WorldMapPage;