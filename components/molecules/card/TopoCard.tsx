import React from 'react';
import Image from 'next/image';
import { Card } from 'components/atoms/Card';
import { topogetherUrl } from 'helpers/globals';
import { Icon } from 'components';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { formatDate } from 'helpers/formatDate';

interface TopoCardProps {
  topo: LightTopo;
}

const topoIcons = {
  [TopoStatus.Validated]: <Icon center wrapperClassName="stroke1" SVGClassName="stroke-main lg:h-6 lg:w-6 h-4 w-4" name="checked" />,
  [TopoStatus.Submitted]: <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-third lg:h-6 lg:w-6 h-4 w-4 " name="recent" />,
  [TopoStatus.Draft]: <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-second-light lg:h-6 lg:w-6 h-4 w-4" name="edit" />,
};

export const TopoCard: React.FC<TopoCardProps> = React.memo((props: TopoCardProps) => {
  const getAction = () => {
    if (props.topo.status === TopoStatus.Validated && props.topo.validatedAt) {
      return `Validé le ${formatDate(props.topo.validatedAt)}`;
    } if (props.topo.status === TopoStatus.Submitted && props.topo.submittedAt) {
      return `Envoyé le ${formatDate(props.topo.submittedAt)}`;
    } if (props.topo.status === TopoStatus.Draft && props.topo.modifiedAt) {
      return `Modifié le ${formatDate(props.topo.modifiedAt)}`;
    }
    return null;
  };

  const icon = topoIcons[props.topo.status];

  return (
    <Card className="relative text-center text-grey-medium bg-white flex flex-col">
      <div className="w-full h-20 lg:h-44 top-0 relative">
        <Image
          src={props.topo.image ? topogetherUrl + props.topo.image.url : '/assets/img/Kayoo_defaut_image.png'}
          className="rounded-t-lg"
          alt="topo-image"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="lg:pl-2 flex flex-row lg:h-12 lg:ml-4 lg:items-center lg:justify-center">
        <div className="hidden lg:block">
          {icon}
        </div>
        <div className="p-2 lg:pr-6 w-full flex flex-col items-start">
          <div className="w-full pr-2 truncate ktext-title text-dark font-bold text-xs">
            {props.topo.name}
          </div>
          <div className="w-full border-t-[1px] text-xxs flex flex-row flex-wrap items-end justify-between">
            <span className="whitespace-nowrap">{`${props.topo.nbBoulders} blocs - ${props.topo.nbTracks} passages`}</span>
            <div className="lg:hidden">
              {icon}
            </div>
            <span className="mr-1 whitespace-nowrap">
              {getAction()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}, equal);

TopoCard.displayName = 'TopoCard';
