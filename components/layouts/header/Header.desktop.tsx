import React, { ReactNode, useEffect, useState } from 'react';
import NextImage from 'next/image';
import { ProfilePicture } from 'components/atoms';
import { Dropdown, DropdownOption } from 'components/molecules/form';
import Link from 'next/link';
import { MapToolEnum } from 'types';
import { useAuth } from 'helpers/services';
import { useRouter } from 'next/router';
import { watchDependencies } from 'helpers/quarky';
import ArrowFull from 'assets/icons/arrow-full.svg';
import Rock from 'assets/icons/rock.svg';
import Sector from 'assets/icons/sector.svg';
import Parking from 'assets/icons/parking.svg';
import HelpRound from 'assets/icons/help-round.svg';

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
  const auth = useAuth();
  const user = auth.session();
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

      <div
        className="flex-1 flex flex-row items-center text-white ktext-title whitespace-nowrap cursor-pointer"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {props.title}
        {props.menuOptions && (
          <ArrowFull
            className="fill-white w-4 h-4 rotate-90 ml-[20px]"
          />
        )}
        {props.menuOptions && menuOpen && (
          <Dropdown
            options={props.menuOptions}
            onSelect={() => setMenuOpen(false)}
            className="top-[7%]"
          />
        )}
      </div>
      <div className="flex-1 flex flex-row items-center">
        {props.children}
      </div>
      {displayMapTools && (
        <div className="flex flex-row gap-8 mr-[40%]">
          <Rock
            className={`h-7 w-7 cursor-pointer ${!props.MapToolsActivated ? 'stroke-grey-medium' : props.currentTool === 'ROCK' ? 'stroke-main' : 'stroke-white'}`}
            onClick={props.MapToolsActivated ? props.onRockClick : undefined}
          />
          <Sector
            className={`h-7 w-7 cursor-pointer ${!props.MapToolsActivated ? 'stroke-grey-medium fill-grey-medium' : props.currentTool === 'SECTOR' ? 'stroke-main fill-main' : 'stroke-white fill-white'}`}
            onClick={props.MapToolsActivated ? props.onSectorClick : undefined}
          />
          <Parking
            className={`h-6 w-6 cursor-pointer ${!props.MapToolsActivated ? 'fill-grey-medium' : props.currentTool === 'PARKING' ? 'fill-second' : 'fill-white'}`}
            onClick={props.MapToolsActivated ? props.onParkingClick : undefined}
          />
          <HelpRound
            className={`h-6 w-6 cursor-pointer ${!props.MapToolsActivated ? 'fill-grey-medium stroke-grey-medium' : props.currentTool === 'WAYPOINT' ? 'fill-third stroke-third' : 'fill-white stroke-white'}`}
            onClick={props.MapToolsActivated ? props.onWaypointClick : undefined}
          />
        </div>
      )}

      {displayLogin && !user &&
        <Link href="/user/login" passHref>
          <div className="ktext-base text-white cursor-pointer mr-[3%]">
            Se connecter
          </div>
        </Link>
      }

      {displayUser && user &&
        <div className='w-1/12 flex justify-center items-center'>
          <div className='h-[45px] w-[45px] relative'>
            <ProfilePicture
              image={user?.image}
              onClick={() => setUserMenuOpen(m => !m)}
            />
          </div>
          {userMenuOpen &&
            <Dropdown
              options={[
                { value: 'Mon profil', action: () => router.push('/user/profile') },
                {
                  value: 'Se déconnecter', action: async () => {
                    const success = await auth.signOut();
                    if (success) await router.push('/');
                  }
                }
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