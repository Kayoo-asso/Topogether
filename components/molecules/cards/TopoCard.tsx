import React, { useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Card, Icon, Dropdown } from 'components';
import { formatDate, staticUrl } from 'helpers';
import equal from 'fast-deep-equal/es6';
import { LightTopo, TopoStatus } from 'types';
import { useRouter } from 'next/router';
import { useContextMenu } from 'helpers/hooks/useContextMenu';
import { UserActionDropdown } from './UserActionDropdown';
import { AdminActionDropdown } from './AdminActionDropdown';

interface TopoCardProps {
  topo: LightTopo;
  isAdmin?: boolean;
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
  const router = useRouter();
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

  const [dropdownDisplayed, setDropdownDisplayed] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ x: number, y: number }>();

  useContextMenu(setDropdownDisplayed);

  return (
    <>
      <Link href={`/builder/${props.topo.id}`} passHref>
        <div onContextMenu={(e) => {
          setDropdownDisplayed(!dropdownDisplayed);
          setDropdownPosition({ x: e.pageX, y: e.pageY });
          e.preventDefault();
        }}
        >
          <Card className="relative text-center text-grey-medium bg-white flex flex-col cursor-pointer">
            <div className="w-full h-[70px] md:h-44 top-0 relative">
              <NextImage
                src={props.topo.image ? props.topo.image.url : staticUrl.defaultKayoo}
                className="rounded-t-lg"
                alt="topo-image"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div className="md:pl-2 flex flex-row md:h-12 md:ml-4 md:items-center md:justify-center">
              <div className="hidden md:block">
                {getTopoIcons(props.topo.status)}
              </div>
              <div className="p-2 md:pr-6 w-full flex flex-col items-start">
                <div className="w-full pr-2 truncate ktext-title text-left text-dark font-bold text-xs">
                  {props.topo.name}
                </div>
                <div className="w-full border-t-[1px] text-xxs flex flex-row flex-wrap items-end justify-between py-1">
                  <span className="whitespace-nowrap">{`${props.topo.nbBoulders} blocs - ${props.topo.nbTracks} passages`}</span>
                  <div className="md:hidden">
                    {getTopoIcons(props.topo.status)}
                  </div>
                  <span className="mr-1 whitespace-nowrap">
                    {getAction()}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Link>
      {dropdownDisplayed && !props.isAdmin && (
        <UserActionDropdown dropdownPosition={dropdownPosition} topoId={props.topo.id} />
      )}
      {dropdownDisplayed && props.isAdmin && (
        <AdminActionDropdown topoId={props.topo.id} status={props.topo.status} dropdownPosition={dropdownPosition} />
      )}
    </>
  );
}, equal);

TopoCard.displayName = 'TopoCard';
