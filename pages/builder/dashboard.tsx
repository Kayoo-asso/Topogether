import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { NextPage } from 'next';
import Link from 'next/link';
import {
  Button, HeaderDesktop, LeftbarDesktop, TopoCardList,
} from 'components';
import { LightTopo, TopoStatus } from 'types';
import { fakeLightTopo } from 'helpers/fakeData/fakeLightTopo';

const DashboardPage: NextPage = () => {
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
  ]);
  const draftLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Draft);
  const submittedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Submitted);
  const validatedLightTopos = lightTopos.filter((topo) => topo.status === TopoStatus.Validated);

  { /* TODO: get Light Topos */ }

  return (
    <>
      <HeaderDesktop
        backLink="#"
        title="Mes topos"
      />

      <div className="flex flex-row h-content md:h-full">
        <LeftbarDesktop
          currentMenuItem="BUILDER"
        />

        <div className="bg-white overflow-y-auto h-contentPlusHeader md:h-contentPlusShell overflow-x-hidden">
          <div className="px-4 md:px-8 py-6 flex flex-row-reverse justify-between items-center">
            <Link href="/builder/new" passHref>
              <Button content="Créer un topo" />
            </Link>
            <div className="md:hidden ktext-section-title text-center">Mes topos</div>
          </div>
          <TopoCardList topos={draftLightTopos} status={TopoStatus.Draft}>
            <div className="text-second-light ktext-section-title px-4 md:px-8">Brouillons</div>
          </TopoCardList>

          <TopoCardList topos={submittedLightTopos} status={TopoStatus.Submitted}>
            <div className="text-third-light ktext-section-title px-4 md:px-8">En attente de validation</div>
          </TopoCardList>

          <TopoCardList topos={validatedLightTopos} status={TopoStatus.Validated}>
            <div className="text-main ktext-section-title px-4 md:px-8">Validés</div>
          </TopoCardList>
        </div>
      </div>
    </>
);
};

export default DashboardPage;
