import React, { ReactNode } from 'react';
import { LightTopo, Topo, TopoStatus, UUID } from 'types';
import { NoTopoCard } from './NoTopoCard';
import { TopoCard } from './TopoCard';

// TODO: add a select to sort topos by date or alphabetic order
interface TopoCardListProps {
  topos: LightTopo[];
  status: TopoStatus;
  title?: ReactNode;
  lastCard?: ReactNode;
  onContextMenu: (topo: LightTopo, position: {x: number, y: number}) => void
}
export const TopoCardList:React.FC<TopoCardListProps> = (props: TopoCardListProps) => (
  <div className="pt-4">
    {props.title}
    <div
      id={`topo-card-list-${props.status}`}
      className="overflow-x-scroll hide-scrollbar md:overflow-x-hidden"
    >
      <div className="min-w-max md:min-w-full flex flex-row md:flex-wrap">
        <div className="md:hidden w-2 h-2" />
        {props.topos.length === 0 && (props.status === TopoStatus.Submitted
      || props.status === TopoStatus.Validated)
       && <NoTopoCard topoStatus={props.status} />}
        {props.topos.map((topo) => (
          <TopoCard 
            key={topo.id}
            topo={topo}
            onContextMenu={props.onContextMenu}
            />
        ))}
        {props.lastCard}
      </div>
    </div>
  </div>
  );
