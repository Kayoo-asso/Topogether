import { WorldMapDesktop, WorldMapMobile } from 'components';
import { TopoCard } from 'components/molecules/card/TopoCard';
import { TopoCardDesktop } from 'components/molecules/card/TopoCard.desktop';
import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';
import type { NextPage } from 'next';
import React from 'react';
import { isDesktop, isMobile } from 'react-device-detect';

const WorldMapPage: NextPage = () => (
  <>
    <TopoCard topo={fakeLightTopo} />
    {/* <TopoCardDesktop topo={fakeLightTopo} /> */}
  </>
);

export default WorldMapPage;
