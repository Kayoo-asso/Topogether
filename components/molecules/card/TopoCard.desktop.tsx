import { Card } from 'components/atoms/Card';
import React from 'react';
import { topogetherUrl } from 'const';
import Image from 'next/image';
import { Icon } from 'components';

interface TopoCardProps {
  topo: any;
}
// TODO: format correct de date
export const TopoCard: React.FC<TopoCardProps> = (props: TopoCardProps) => {
  const getIcon = () => {
    if (props.topo.status === 'validated') {
      return <Icon center wrapperClassName="stroke-1" SVGClassName="stroke-main h-6 w-6" name="checked" />;
    } if (props.topo.status === 'submitted') {
      return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-third h-6 w-6 " name="recent" />;
    }
    return <Icon center wrapperClassName="stroke-[1.5px]" SVGClassName="stroke-second h-6 w-6" name="edit" />;
  };

  return (
    <Card className="m-10 relative text-center text-grey-medium bg-white flex flex-col">
      <div className="w-full h-44 top-0 relative">
        <Image
          src={props.topo.mainImage ? topogetherUrl + props.topo.mainImage.url : '/assets/img/Kayoo_defaut_image.png'}
          className="rounded-t-lg"
          alt="topo-image"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>
      <div className="flex flex-row h-12 ml-4 items-center justify-center">
        {getIcon()}
        <div className="w-full mx-3 flex flex-col items-start">
          <span className="ktext-title text-base text-dark font-bold">Yzéron</span>
          <div className="text-xxs border-t-[1px] pt-1 w-full flex flex-row justify-between">
            <span>{`${props.topo.numberOfBoulder} blocs - ${props.topo.numberOfTrack} passages`}</span>
            {props.topo.validatedAt && (
            <span>
              validé le
              {' '}
              {props.topo.validatedAt}
            </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
