import { AddTopoCard } from 'components/molecules/card/AddTopoCard';
import { NoTopoCard } from 'components/molecules/card/NoTopoCard';
import { TopoCard } from 'components/molecules/card/TopoCard';
import React, { ReactNode } from 'react';
import { LightTopo, TopoStatus } from 'types';

// TODO: add a select to sort topos by date or alphabetic order
interface TopoCardListProps {
  topos: LightTopo[];
  status: TopoStatus;
  children: ReactNode;
}
export const TopoCardList:React.FC<TopoCardListProps> = (props: TopoCardListProps) => (
  <div className="py-4">
    {props.children}
    <div className="-mx-2 flex flex-row">
      {props.topos.length === 0 && (props.status === TopoStatus.Submitted
      || props.status === TopoStatus.Validated)
       && <NoTopoCard topoStatus={props.status} />}
      {props.topos.map((topo) => (
        <TopoCard key={topo.id} topo={topo} />
      ))}
      {props.status === TopoStatus.Draft && <AddTopoCard />}
    </div>
  </div>
);
