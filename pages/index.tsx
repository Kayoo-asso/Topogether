import { WorldMapDesktop, WorldMapMobile } from 'components';
import type { NextPage } from 'next';
import { isDesktop, isMobile } from 'react-device-detect';

const WorldMapPage: NextPage = () => {
    
  return (
    <>
      {isMobile &&
        <WorldMapMobile />
      }
      {isDesktop &&
        <WorldMapDesktop />
      }
    </>
  )
};

export default WorldMapPage;
