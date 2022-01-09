import React, { ReactNode } from 'react';
import { LightTopo, TopoStatus } from 'types';
import { NoTopoCard } from './NoTopoCard';
import { TopoCard } from './TopoCard';
import { AddTopoCard } from './AddTopoCard';

// TODO: add a select to sort topos by date or alphabetic order
interface TopoCardListProps {
  topos: LightTopo[];
  status: TopoStatus;
  children: ReactNode;
}
export const TopoCardList:React.FC<TopoCardListProps> = (props: TopoCardListProps) => (
  <div className="pt-4">
    {props.children}
    <div
      id={`topo-card-list-${props.status}`}
      className="-mx-1 overflow-x-scroll hide-scrollbar md:overflow-x-hidden"
    >
      <div className="min-w-max md:min-w-full flex flex-row md:flex-wrap">
        {props.topos.length === 0 && (props.status === TopoStatus.Submitted
      || props.status === TopoStatus.Validated)
       && <NoTopoCard topoStatus={props.status} />}
        {props.topos.map((topo) => (
          <TopoCard key={topo.id} topo={topo} />
        ))}
        {props.status === TopoStatus.Draft && <AddTopoCard />}
      </div>
    </div>
  </div>
  );
