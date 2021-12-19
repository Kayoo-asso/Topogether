import type { NextPage } from 'next';
import { TopoDesktop, TopoMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const AdminPage: NextPage = () => {

  return (
    <>
      {isMobile &&
        <TopoMobile />
      }
      {isDesktop &&
        <TopoDesktop />
      }
    </>
  )
};

export default AdminPage;
