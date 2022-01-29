import type { NextPage } from 'next';
import {
 Header, LeftbarDesktop, Tabs, TopoCardList,
} from 'components';
import React, { useState } from 'react';
import { LightTopo, TopoStatus } from 'types';
import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';
import { v4 as uuid } from 'uuid';

const AdminPage: NextPage = () => {
  const [lightTopos, setLightTopos] = useState<LightTopo[]>([
    fakeLightTopo,
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: uuid(),
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: uuid(),
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: uuid(),
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
      id: uuid(),
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: uuid(),
      name: 'Les roches qui dansent très souvent',
    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Submitted,
      id: uuid(),

    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Validated,
      id: '8',

    },
    {
      ...fakeLightTopo,
      status: TopoStatus.Draft,
      id: uuid(),

    },
  ]); const [selectedStatus, setSelectedStatus] = useState<TopoStatus>(TopoStatus.Draft);

  const toposToDisplay = lightTopos.filter((topo) => topo.status === selectedStatus);

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
              action: () => setSelectedStatus(TopoStatus.Draft),
            },
            {
              iconName: 'recent',
              iconStroke: true,
              color: 'third',
              action: () => setSelectedStatus(TopoStatus.Submitted),
            },
            {
              iconName: 'checked',
              iconFill: true,
              color: 'main',
              action: () => setSelectedStatus(TopoStatus.Validated),
            },
            ]}
          />
          <TopoCardList topos={toposToDisplay} status={selectedStatus} />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
