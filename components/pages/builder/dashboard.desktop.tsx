import {
  Button, HeaderDesktop, LeftbarDesktop, TopoCardList,
} from 'components';
import React, { useCallback } from 'react';
import { LightTopo, TopoStatus } from 'types';

interface DashboardDesktopProps {
  lightTopos: LightTopo[],
}

export const DashboardDesktop:React.FC<DashboardDesktopProps> = (props: DashboardDesktopProps) => {
  const newTopo = useCallback(() => console.log('Link to newTopo page'), []);
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

        <div className="py-6 px-5 bg-white w-full h-full flex flex-col ">

          <div className="flex flex-row justify-between items-center">
            <div className="ktext-section-title text-center">Vos topos</div>
            <Button content="Créer un topo" onClick={newTopo} />
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
    </>
  );
};
