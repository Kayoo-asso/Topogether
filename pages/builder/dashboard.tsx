import type { NextPage } from 'next';
import { Device, DashboardDesktop, DashboardMobile } from 'components';
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
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '3',
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '4',
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '5',
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '6',
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: '7',

    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Validated,
      id: '8',

    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Draft,
      id: '9',

    },
  ]);

  { /* TODO: get Light Topos */ }

  return (
    <Device>
      {({ isMobile }: { isMobile: boolean }) => {
        if (isMobile) {
          return (
            <DashboardMobile
              lightTopos={lightTopos}
            />
);
        }
        return (
          <DashboardDesktop
            lightTopos={lightTopos}
          />
);
      }}
    </Device>
);
};

export default DashboardPage;
