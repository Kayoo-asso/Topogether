import React from 'react';
import NextImage from 'next/image';
import { Card, Icon } from 'components';
import { topogetherUrl, formatDate } from 'helpers';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';

interface TopoCardProps {
  topo: LightTopo;
}

const getTopoIcons = (status: TopoStatus) => {
  if (status === TopoStatus.Validated) {
    return <Icon center wrapperClassName="stroke1" SVGClassName="stroke-main lg:h-6 lg:w-6 h-4 w-4" name="checked" />;
  }
  if (status === TopoStatus.Submitted) {
    return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-third lg:h-6 lg:w-6 h-4 w-4 " name="recent" />;
  }
  return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-second-light lg:h-6 lg:w-6 h-4 w-4" name="edit" />;
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
    return '';
  };

  return (
    <Card className="relative text-center text-grey-medium bg-white flex flex-col">
      <div className="w-full h-[70px] lg:h-44 top-0 relative">
        <NextImage
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
          {getTopoIcons(props.topo.status)}
        </div>
        <div className="p-2 lg:pr-6 w-full flex flex-col items-start">
          <div className="w-full pr-2 truncate ktext-title text-left text-dark font-bold text-xs">
            {props.topo.name}
          </div>
          <div className="w-full border-t-[1px] text-xxs flex flex-row flex-wrap items-end justify-between py-1">
            <span className="whitespace-nowrap">{`${props.topo.nbBoulders} blocs - ${props.topo.nbTracks} passages`}</span>
            <div className="lg:hidden">
              {getTopoIcons(props.topo.status)}
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
