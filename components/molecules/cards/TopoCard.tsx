import React, { MouseEvent, TouchEvent, ReactElement, useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CFImage } from 'components';
import { formatDate, encodeUUID } from 'helpers';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import Checked from 'assets/icons/checked.svg';
import Recent from 'assets/icons/recent.svg';
import Edit from 'assets/icons/edit.svg';


interface TopoCardProps {
  topo: LightTopo;
  clickable?: 'builder' | 'topo';
  onContextMenu: (topo: LightTopo, position: { x: number, y: number }) => void
  onClick?: () => void,
}

const iconSize = 'h-4 w-4 md:h-6 md:w-6';

export const TopoCard: React.FC<TopoCardProps> = React.memo(({
  clickable = 'topo',
  ...props
}: TopoCardProps) => {
  const topo = props.topo;

  let TopoIcon;
  let lastAction;

  if (topo.status === TopoStatus.Validated) {
    TopoIcon = <Checked className={`stroke-main ${iconSize}`} />;
    lastAction = topo.validated ? `Validé le ${formatDate(topo.validated)}` : ''; //TODO : be sure that a date is saved in db
  }
  else if (topo.status === TopoStatus.Submitted) {
    TopoIcon = <Recent className={`stroke-third ${iconSize}`} />;
    lastAction = topo.submitted ? `Envoyé le ${formatDate(topo.submitted)}` : ''; //TODO : be sure that a date is saved in db
  }
  else {
    TopoIcon = <Edit className={`stroke-second-light ${iconSize}`} />;
    lastAction = `Modifié le ${formatDate(props.topo.modified)}`;
  }

  const wrapLink = (elts: ReactElement<any, any>) => {
    if (clickable) {
      return(<Link href={`/${clickable}/${encodeUUID(props.topo.id)}`}>
        <a onClick={props.onClick}>{elts}</a>
      </Link>)
    }
    else return elts;
  }

  const timer = useRef<number>(0);
  const blockClick = useRef<boolean>(false);
  const handleMouseContextMenu = useCallback((e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    if (e.button === 2 && props.onContextMenu) { //Right click
      e.preventDefault();
      props.onContextMenu(props.topo, { x: e.pageX, y: e.pageY });
    }
  }, [props.topo, props.onContextMenu]);
  const handleTouchStartContextMenu = useCallback((e: TouchEvent<HTMLDivElement>) => {
    if (props.onContextMenu) {
      // `setTimeout` returns an integer when called in the browser,
      // but TypeScript gives us the type for `setTimeout` on Node.js
      // -> need `as any`
      timer.current = setTimeout(() => { 
        blockClick.current = true;
        props.onContextMenu!(props.topo, { x: e.touches[0].pageX, y: e.touches[0].pageY });
      }, 800) as any;
    }
  }, [props.topo, props.onContextMenu]);
  const handleTouchEndContextMenu = useCallback((e: TouchEvent<HTMLDivElement>) => {
    clearTimeout(timer.current);
    if (blockClick.current) {
      e.preventDefault();
      blockClick.current = false;
    }
  }, []);

  return (
    wrapLink(
      <div 
        className='touch-none'
        onContextMenu={handleMouseContextMenu}
        onTouchStart={handleTouchStartContextMenu}
        onTouchEnd={handleTouchEndContextMenu}
      >
        <Card className={"relative text-center text-grey-medium bg-white flex flex-col" + (clickable ? " cursor-pointer" : '')}>
          <div className="w-full h-[55%] md:h-[75%] top-0 relative">
            <CFImage
              image={props.topo.image}
              className="rounded-t-lg h-full"
              objectFit='cover'
              alt="topo-image"
              sizeHint={'25vw'}
            />
          </div>

          <div className="h-[45%] md:h-[25%] px-3 md:px-4 py-1 flex flex-row gap-2 md:items-center md:justify-center">
            <div className="hidden md:block">
              {TopoIcon}
            </div>
  
            <div className="w-full flex flex-col items-start overflow-hidden">
              <div className='flex flex-row items-center mb-1 md:my-1 '>
                <div className="pr-2 md:hidden stroke-[1.5px]">
                  {TopoIcon}
                </div>
                <div className="pr-2 truncate ktext-title text-left text-dark font-bold text-xs">
                  {props.topo.name}
                </div>
              </div>
  
              <div className="w-full border-t-[1px] text-xxs flex flex-col flex-wrap items-start justify-between py-1">
                <span className="whitespace-nowrap">{`${props.topo.nbBoulders} blocs - ${props.topo.nbTracks} passages`}</span>
                <span className="mr-1 whitespace-nowrap">
                  {lastAction}
                </span>
              </div>
            </div>
          </div>

        </Card>
      </div>
    )
  );
}, equal);

TopoCard.displayName = 'TopoCard';
