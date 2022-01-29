import type { NextPage } from 'next';
import { Header, LeftbarDesktop, Tabs } from 'components';
import React, { useState } from 'react';
import { LightTopo, TopoStatus } from 'types';

const AdminPage: NextPage = () => {
  const [lightTopos, setLightTopos] = useState<LightTopo[]>();
  const [topoToDisplay, setTopoToDisplay] = useState<TopoStatus>(TopoStatus.Draft);

  { /* TODO: GET LIGHT TOPOS */ }

  return (
    <>
      <Header
        backLink="#"
        title="Administration"
      />

      <div className="h-full flex flex-row bg-white">
        <LeftbarDesktop
          currentMenuItem="ADMIN"
        />

        <div className="w-full h-[10%] mt-[10%]">
          <Tabs
            tabs={[{
              iconName: 'edit',
              iconStroke: true,
              color: 'second',
              action: () => setTopoToDisplay(TopoStatus.Draft),
            },
            {
              iconName: 'recent',
              iconStroke: true,
              color: 'third',
              action: () => setTopoToDisplay(TopoStatus.Submitted),
            },
            {
              iconName: 'checked',
              iconFill: true,
              color: 'main',
              action: () => setTopoToDisplay(TopoStatus.Validated),
            },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
