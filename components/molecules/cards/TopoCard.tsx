import React from 'react';
import Link from 'next/link';
import { Card, Icon } from 'components';
import { formatDate } from 'helpers';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { CFImage } from 'components/atoms/CFImage';

let timer: NodeJS.Timeout;
interface TopoCardProps {
  topo: LightTopo;
  onContextMenu: (topo: LightTopo, position: {x: number, y: number}) => void
}

const getTopoIcons = (status: TopoStatus) => {
  if (status === TopoStatus.Validated) {
    return <Icon center wrapperClassName="stroke1" SVGClassName="stroke-main md:h-6 md:w-6 h-4 w-4" name="checked" />;
  }
  if (status === TopoStatus.Submitted) {
    return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-third md:h-6 md:w-6 h-4 w-4 " name="recent" />;
  }
  return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-second-light md:h-6 md:w-6 h-4 w-4" name="edit" />;
};

export const TopoCard: React.FC<TopoCardProps> = React.memo((props: TopoCardProps) => {
  const getAction = () => {
    if (props.topo.status === TopoStatus.Validated && props.topo.validated) {
      return `Validé le ${formatDate(props.topo.validated)}`;
    } if (props.topo.status === TopoStatus.Submitted && props.topo.submitted) {
      return `Envoyé le ${formatDate(props.topo.submitted)}`;
    } if (props.topo.status === TopoStatus.Draft && props.topo.modified) {
      return `Modifié le ${formatDate(props.topo.modified)}`;
    }
    return '';
  };

  return (
    <>
      <Link href={`/builder/${props.topo.id}`} passHref>
        <div onContextMenu={(e) => {
            props.onContextMenu(props.topo, {x: e.pageX, y: e.pageY});
            e.preventDefault()}}
            onTouchStart={(e) => {
              timer = setTimeout(() => props.onContextMenu(props.topo, {x: e.touches[0].pageX, y: e.touches[0].pageY}), 500)
            }}
            onTouchEnd={() => {
              if(timer) clearTimeout(timer);
            }}    
        >
          <Card className="relative text-center text-grey-medium bg-white flex flex-col cursor-pointer">
            <div className="w-full h-[50%] md:h-[75%] top-0 relative">
              <CFImage
                image={props.topo.image}
                className="rounded-t-lg"
                alt="topo-image"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div className="h-[50%] md:h-[25%] md:px-5 flex flex-row md:items-center md:justify-center">
              <div className="hidden md:block">
                {getTopoIcons(props.topo.status)}
              </div>
              
              <div className="p-2 md:pr-6 w-full flex flex-col items-start">

                <div className='flex flex-row items-center mb-1 md:my-1'>
                  <div className="pr-2 md:hidden">
                    {getTopoIcons(props.topo.status)}
                  </div>
                  <div className="pr-2 truncate ktext-title text-left text-dark font-bold text-xs">
                    {props.topo.name}
                  </div>
                </div>
              

                <div className="w-full border-t-[1px] text-xxs flex flex-row flex-wrap items-end justify-between py-1">
                  <span className="whitespace-nowrap">{`${props.topo.nbBoulders} blocs - ${props.topo.nbTracks} passages`}</span>
                  <span className="mr-1 whitespace-nowrap">
                    {getAction()}
                  </span>
                </div>
              </div>

            </div>
          </Card>
        </div>
      </Link>
    </>
  );
}, equal);

TopoCard.displayName = 'TopoCard';
