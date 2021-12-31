import { WorldMapDesktop, WorldMapMobile, TopoCard } from 'components';
import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';
import type { NextPage } from 'next';
import { isDesktop, isMobile } from 'react-device-detect';
import { GeoCamera } from 'components/molecules/GeoCameraTest';
import React from 'react';

const WorldMapPage: NextPage = () => (
  <WorldMapDesktop />
);

export default WorldMapPage;
