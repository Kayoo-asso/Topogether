import { WorldMapDesktop, WorldMapMobile } from 'components';
import { TopoCard } from 'components/molecules/card/TopoCard';
import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';
import type { NextPage } from 'next';
import { isDesktop, isMobile } from 'react-device-detect';
import { GeoCamera } from 'components/molecules/GeoCameraTest';

const WorldMapPage: NextPage = () => (
  <>
    <WorldMapDesktop />
  </>
);

export default WorldMapPage;
