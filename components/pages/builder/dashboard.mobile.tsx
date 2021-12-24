import { Button, Select } from 'components';
import { AddTopoCard } from 'components/molecules/card/AddTopoCard';
import { NoTopoCard } from 'components/molecules/card/NoTopoCard';
import { TopoCard } from 'components/molecules/card/TopoCard';
import React, { useCallback } from 'react';
import { LightTopo, TopoStatus } from 'types';

interface DashboardMobileProps {
  topos: LightTopo[];
}
export const DashboardMobile:React.FC<DashboardMobileProps> = (props: DashboardMobileProps) => {
  const newTopo = useCallback(() => console.log('Link to newTopo page'), []);
  const sortTopos = useCallback(() => console.log('sortTopos'), []);
  const draftTopos = props.topos.filter((topo) => topo.status === TopoStatus.Draft);
  const submittedTopos = props.topos.filter((topo) => topo.status === TopoStatus.Submitted);
  const validatedTopos = props.topos.filter((topo) => topo.status === TopoStatus.Validated);

  return (
    <div className="my-8 mx-3">
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
      
      <div className="text-second-light ktext-section-title">Brouillons</div>
      <div className="flex flex-row">
        {draftTopos.map((topo) => (
          <TopoCard key={topo.id} topo={topo} />
        ))}
        <AddTopoCard />
      </div>

      <div className="text-third-light ktext-section-title">En attente de validation</div>
      {submittedTopos?.length === 0 && <NoTopoCard topoStatus={TopoStatus.Submitted} />}
      <div className="flex flex-row">
        {submittedTopos.map((topo) => (
          <TopoCard key={topo.id} topo={topo} />
        ))}
      </div>

      <div className="text-main-light ktext-section-title">Validés</div>
      {validatedTopos?.length === 0 && <NoTopoCard topoStatus={TopoStatus.Validated} />}
      <div className="flex flex-row">
        {validatedTopos.map((topo) => (
          <TopoCard key={topo.id} topo={topo} />
        ))}
      </div>
    </div>
  );
};
