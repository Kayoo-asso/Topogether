import type { NextPage } from 'next';
import { DashboardDesktop, DashboardMobile } from 'components';
import { isDesktop, isMobile } from 'react-device-detect';
import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';
import { LightTopo, TopoStatus } from 'types';
import { useState } from 'react';

const DashboardPage: NextPage = () => {
  const [lightTopos, setLightTopos] = useState<LightTopo[]>([
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
      status: TopoStatus.Validated,
      id: '3',

    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Draft,
      id: '4',

    },
  ]);

  { /* TODO: get Light Topos */ }

  return (
    <>
      {isMobile
        && (
        <DashboardMobile
          lightTopos={lightTopos}
        />
        )}
      {isDesktop
        && (
        <DashboardDesktop
          lightTopos={lightTopos}
        />
        )}
    </>
  );
};

export default DashboardPage;
