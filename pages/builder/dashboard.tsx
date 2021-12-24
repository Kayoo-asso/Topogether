import type { NextPage } from 'next';
import { DashboardDesktop, DashboardMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';
import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';
import { TopoStatus } from 'types';

const DashboardPage: NextPage = () => {
  const topos = [
    fakeLightTopo,
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '1',
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '2',

    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '3',

    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '4',

    },
  ];
  return (
    <>
      {isMobile
        && <DashboardMobile topos={topos} />}
      {isDesktop
        && <DashboardDesktop />}
    </>
  );
};

export default DashboardPage;
