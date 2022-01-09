import React, { useContext } from 'react';
import { DeviceContext } from 'helpers';
import type { NextPage } from 'next';
import { HeaderDesktop, LeftbarDesktop } from 'components';

const WorldMapPage: NextPage = () => {
  const device = useContext(DeviceContext);

  return (
    <>
      <HeaderDesktop
        backLink="#"
        title="Carte des topos"
      />

      <div className="flex flex-row h-full">
        <LeftbarDesktop
          currentMenuItem="MAP"
        />
      </div>
    </>
  )
};

export default WorldMapPage;
