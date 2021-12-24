import { Button, Select } from 'components';
import { AddTopoCard } from 'components/molecules/card/AddTopoCard';
import { NoTopoCard } from 'components/molecules/card/NoTopoCard';
import { TopoCard } from 'components/molecules/card/TopoCard';
import { TopoCardList } from 'components/molecules/card/TopoCardList';
import React, { useCallback } from 'react';
import { LightTopo, TopoStatus } from 'types';

// TODO: add a select to sort topos by date or alphabetic order
interface DashboardMobileProps {
  topos: LightTopo[];
}
export const DashboardMobile:React.FC<DashboardMobileProps> = (props: DashboardMobileProps) => {
  const newTopo = useCallback(() => console.log('Link to newTopo page'), []);
  // const sortTopos = useCallback(() => console.log('sortTopos'), []);
  const draftTopos = props.topos.filter((topo) => topo.status === TopoStatus.Draft);
  const submittedTopos = props.topos.filter((topo) => topo.status === TopoStatus.Submitted);
  const validatedTopos = props.topos.filter((topo) => topo.status === TopoStatus.Validated);

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

      <TopoCardList topos={draftTopos} status={TopoStatus.Draft}>
        <div className="text-second-light ktext-section-title">Brouillons</div>
      </TopoCardList>

      <TopoCardList topos={submittedTopos} status={TopoStatus.Submitted}>
        <div className="text-third-light ktext-section-title">En attente de validation</div>
      </TopoCardList>

      <TopoCardList topos={validatedTopos} status={TopoStatus.Validated}>
        <div className="text-main ktext-section-title">Validés</div>
      </TopoCardList>

    </div>
  );
};
