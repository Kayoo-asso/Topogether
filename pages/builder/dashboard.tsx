import type { NextPage } from 'next';
import { DashboardDesktop, DashboardMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';

const DashboardPage: NextPage = () => {

  return (
    <>
      {isMobile &&
        <DashboardMobile />
      }
      {isDesktop &&
        <DashboardDesktop />
      }
    </>
  )
};

export default DashboardPage;
