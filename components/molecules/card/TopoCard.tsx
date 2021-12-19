import React from 'react';
import Image from 'next/image';
import { Card } from 'components/atoms/Card';
import { topogetherUrl } from 'const';
import { Icon } from 'components';
import equal from 'fast-deep-equal/es6';

interface TopoCardProps {
  topo: any;
}
// TODO: format correct de date
// memoiser ?
// petit padding
// type topo avec updatedAt, sentAt,
export const TopoCard: React.FC<TopoCardProps> = (props: TopoCardProps) => {
  const getIcon = () => {
    if (props.topo.status === 'validated') {
      return <Icon center wrapperClassName="stroke-1" SVGClassName="stroke-main h-4 w-4" name="checked" />;
    } if (props.topo.status === 'submitted') {
      return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-third h-4 w-4 " name="recent" />;
    } if (props.topo.status === 'draft') {
      return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-second h-4 w-4" name="edit" />;
    }
    return null;
  };

  const getAction = () => {
    if (props.topo.status === 'validated') {
      return `Validé le ${props.topo.validatedAt}`;
    } if (props.topo.status === 'submitted') {
      return `Envoyé le ${props.topo.submittedAt}`;
    } if (props.topo.status === 'draft') {
      return `Modifié le ${props.topo.updatedAt}`;
    }
    return null;
  };

  return (
    <Card className="m-10 relative text-center text-grey-medium bg-white flex flex-col">
      <div className="w-full h-20 top-0 relative">
        <Image
          src={props.topo.mainImage ? topogetherUrl + props.topo.mainImage.url : '/assets/img/Kayoo_defaut_image.png'}
          className="rounded-t-lg"
          alt="topo-image"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="p-2 w-full flex flex-col items-start">
        <div
          className="w-full pr-2 truncate ktext-title text-dark font-bold text-xs"
        >
          {props.topo.name}

        </div>
        <span className="text-xxs border-t-[1px]">{`${props.topo.numberOfBoulder} blocs - ${props.topo.numberOfTrack} passages`}</span>
        <div className="w-full text-xxs flex flex-row items-end justify-between">
          {getIcon()}
          {props.topo.validatedAt && (
            <span className="mr-1">
              {getAction()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
