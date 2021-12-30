import React, { useCallback } from 'react';
import { Button, TopoCardList } from 'components';
import { LightTopo, TopoStatus } from 'types';

// TODO: add a select to sort topos by date or alphabetic order
interface DashboardMobileProps {
  lightTopos: LightTopo[];
}

export const DashboardMobile:React.FC<DashboardMobileProps> = (props: DashboardMobileProps) => {
  const newTopo = useCallback(() => console.log('Link to newTopo page'), []);
  // const sortTopos = useCallback(() => console.log('sortTopos'), []);
  const draftLightTopos = props.lightTopos.filter((topo) => topo.status === TopoStatus.Draft);
  const submittedLightTopos = props.lightTopos.filter((topo) => topo.status === TopoStatus.Submitted);
  const validatedLightTopos = props.lightTopos.filter((topo) => topo.status === TopoStatus.Validated);

  return (
    <div className="py-6 px-5 bg-white w-full h-full flex flex-col ">

      <div className="flex flex-row justify-between items-center">
        <div className="ktext-section-title text-center">Vos topos</div>
        <Button content="Créer un topo" onClick={newTopo} />
      </div>
      {/* <Select
        id=""
        label=""
        choices={[{ label: 'Les plus récents', value: 'mostRecent' }]}
        selected="mostRecent"
        onSelect={sortTopos}
        className="w-44 m-3"
      /> */}
      <div className="overflow-y-scroll hide-scrollbar w-screen">
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
  );
};
