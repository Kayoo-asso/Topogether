import type { NextPage } from 'next';
import { AdminDesktop, AdminMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';
import { useState } from 'react';
import { LightTopo } from 'types';

const AdminPage: NextPage = () => {
  const [lightTopos, setLightTopos] = useState<LightTopo[]>();

  {/* TODO: GET LIGHT TOPOS */}

  return (
    <>
      {isMobile &&
        <AdminMobile
          lightTopos={lightTopos}
        />
      }
      {isDesktop &&
        <AdminDesktop
          lightTopos={lightTopos}
        />
      }
    </>
  )
};

export default AdminPage;
