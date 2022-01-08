import React, { useContext } from 'react';
import { WorldMapDesktop } from 'components';
import { DeviceContext } from 'helpers';
import type { NextPage } from 'next';

const WorldMapPage: NextPage = () => {
  const device = useContext(DeviceContext);

  return (
    <WorldMapDesktop />
  )
};

export default WorldMapPage;
