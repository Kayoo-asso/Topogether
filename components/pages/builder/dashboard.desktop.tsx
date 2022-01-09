import {
  Button, HeaderDesktop, LeftbarDesktop, TopoCardList,
} from 'components';
import Link from 'next/link';
import React, { useCallback } from 'react';
import { LightTopo, TopoStatus } from 'types';

interface DashboardDesktopProps {
  lightTopos: LightTopo[],
}

export const DashboardDesktop:React.FC<DashboardDesktopProps> = (props: DashboardDesktopProps) => {
  // const sortTopos = useCallback(() => console.log('sortTopos'), []);
  const draftLightTopos = props.lightTopos.filter((topo) => topo.status === TopoStatus.Draft);
  const submittedLightTopos = props.lightTopos.filter((topo) => topo.status === TopoStatus.Submitted);
  const validatedLightTopos = props.lightTopos.filter((topo) => topo.status === TopoStatus.Validated);

  return (
    <>
      <HeaderDesktop
        backLink="#"
        title="Mes topos"
      />

      <div className="flex flex-row h-full">
        <LeftbarDesktop
          currentMenuItem="BUILDER"
        />

        <div className="py-6 px-8 bg-white lg:overflow-y-scroll h-screen">
          <div className="w-full flex flex-col min-h-max">
            <div className="flex flex-row-reverse justify-between items-center">
              <Link href="builder/new" passHref>
                <Button content="Créer un topo" />
              </Link>
            </div>

            <TopoCardList topos={draftLightTopos} status={TopoStatus.Draft}>
              <div className="text-second-light ktext-section-title">Brouillons</div>
            </TopoCardList>

            <TopoCardList topos={submittedLightTopos} status={TopoStatus.Submitted}>
              <div className="text-third-light ktext-section-title">En attente de validation</div>
            </TopoCardList>

            <TopoCardList topos={validatedLightTopos} status={TopoStatus.Validated}>
              <div className="text-main ktext-section-title">Validés</div>
            </TopoCardList>
          </div>
        </div>
      </div>
    </>
  );
};
