import { WorldMapDesktop, WorldMapMobile } from 'components';
import type { NextPage } from 'next';
import { isDesktop, isMobile } from 'react-device-detect';

const WorldMapPage: NextPage = () => (
  <>
    <WorldMapMobile />
    {isDesktop && false
        && (
        <div>
          <WorldMapDesktop />
        </div>
        )}
  </>
);

export default WorldMapPage;
