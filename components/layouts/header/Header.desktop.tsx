import React, { ReactNode, useEffect, useState } from 'react';
import NextImage from 'next/image';
import { Dropdown, DropdownOption, Icon, ProfilePicture } from 'components';
import Link from 'next/link';
import { MapToolEnum } from 'types';
import { api } from 'helpers/services/ApiService';
import { staticUrl } from 'helpers';
import { useRouter } from 'next/router';
import { watchDependencies } from 'helpers/quarky';

interface HeaderDesktopProps {
  backLink: string,
  title: string,
  menuOptions?: DropdownOption[],
  displayMapTools?: boolean,
  MapToolsActivated?: boolean,
  onRockClick?: () => void,
  onSectorClick?: () => void,
  onParkingClick?: () => void,
  onWaypointClick?: () => void,
  currentTool?: MapToolEnum,
  displayLogin?: boolean,
  displayUser?: boolean,
  children?: ReactNode;
}

export const HeaderDesktop: React.FC<HeaderDesktopProps> = watchDependencies(({
  displayMapTools = false,
  displayLogin = false,
  displayUser = true,
  ...props
}: HeaderDesktopProps) => {
  const session = api.user();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="bg-dark items-center h-header hidden md:flex">
      <Link href={props.backLink} passHref>
        <div className="w-1/12 relative h-[70%] cursor-pointer">
          <NextImage
            src="/assets/img/Logo_white_topogether.png"
            priority
            alt="Logo Topogether"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </Link>

      <div className="flex-1 flex flex-row items-center text-white ktext-title whitespace-nowrap">
        <span
          className="cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {props.title}
        </span>
        {props.menuOptions && (
          <Icon
            name="arrow-full"
            center
            SVGClassName="fill-white w-4 h-4 rotate-90 ml-[20px]"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        )}
        {props.menuOptions && menuOpen && (
          <Dropdown
            options={props.menuOptions}
            onSelect={() => setMenuOpen(false)}
            className="z-1000 top-[7%]"
          />
        )}
      </div>
      <div className="flex-1 flex flex-row items-center">
        {props.children}
      </div>
      {displayMapTools && (
        <div className="flex flex-row gap-8 mr-[40%]">
          <Icon
            name="rock"
            SVGClassName={`h-7 w-7 ${!props.MapToolsActivated ? 'stroke-grey-medium' : props.currentTool === 'ROCK' ? 'stroke-main' : 'stroke-white'}`}
            onClick={props.MapToolsActivated ? props.onRockClick : undefined}
          />
          <Icon
            name="sector"
            SVGClassName={`h-7 w-7 ${!props.MapToolsActivated ? 'stroke-grey-medium fill-grey-medium' : props.currentTool === 'SECTOR' ? 'stroke-main fill-main' : 'stroke-white fill-white'}`}
            onClick={props.MapToolsActivated ? props.onSectorClick : undefined}
          />
          <Icon
            name="parking"
            SVGClassName={`h-6 w-6 ${!props.MapToolsActivated ? 'fill-grey-medium' : props.currentTool === 'PARKING' ? 'fill-second' : 'fill-white'}`}
            onClick={props.MapToolsActivated ? props.onParkingClick : undefined}
          />
          <Icon
            name="help-round"
            SVGClassName={`h-6 w-6 ${!props.MapToolsActivated ? 'fill-grey-medium stroke-grey-medium' : props.currentTool === 'WAYPOINT' ? 'fill-third stroke-third' : 'fill-white stroke-white'}`}
            onClick={props.MapToolsActivated ? props.onWaypointClick : undefined}
          />
        </div>
      )}

      {displayLogin && !session &&
        <Link href="/user/login" passHref>
          <div className="ktext-base text-white cursor-pointer mr-[3%]">
            Se connecter
          </div>
        </Link>
      }

      {displayUser && session &&
        <div className='w-1/12 flex justify-center items-center'>
          <div className='h-[45px] w-[45px] relative'>
            <ProfilePicture
              src={session.imageUrl || staticUrl.defaultProfilePicture}
              onClick={() => setUserMenuOpen(m => !m)}
            />
          </div>
          {userMenuOpen &&
            <Dropdown
              options={[
                { value: 'Mon profil', action: () => router.push('/user/profile') },
                { value: 'Se déconnecter', action: async () => { await api.signOut(); router.push('/'); } }
              ]}
              className='w-[200px] -ml-[180px] mt-[180px]'
            />
          }
        </div>
      }
    </div>
  );
});

HeaderDesktop.displayName = "Header Desktop";