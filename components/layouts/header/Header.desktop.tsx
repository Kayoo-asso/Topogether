import { Dropdown, DropdownOption, Icon } from 'components';
import { default as NextImage } from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { MapToolEnum } from 'types';

interface HeaderDesktopProps {
  backLink: string,
  title: string,
  menuOptions?: DropdownOption[],
  displayDrawer?: boolean,
  onRockClick?: () => void,
  onParkingClick?: () => void,
  onWaypointClick?: () => void,
  currentTool?: MapToolEnum,
  displayLogin?: boolean,
}

export const HeaderDesktop: React.FC<HeaderDesktopProps> = ({
  displayDrawer = true,
  displayLogin = false,
  ...props
}: HeaderDesktopProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayTitleTooltip, setDisplayTitleTooltip] = useState(false);

  return (
    <>
      <div className="bg-dark flex items-center h-header">
        <Link href={props.backLink} passHref>
          <div className="w-1/12 relative h-[70%]">
            <NextImage 
              src='/assets/img/Logo_white_topogether.png'
              priority
              alt="Logo Topogether"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Link>

        <div className="flex-1 flex flex-row items-center text-white ktext-title whitespace-nowrap">
          <span
            className='cursor-pointer'
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {props.title}
          </span>
          {props.menuOptions && 
            <Icon 
              name='arrow-full'
              center
              SVGClassName='fill-white w-4 h-4 rotate-90 ml-[20px]'
              onClick={() => setMenuOpen(!menuOpen)}
            />
          }
          {props.menuOptions && menuOpen &&
            <Dropdown 
              choices={props.menuOptions}
              onSelect={() => setMenuOpen(false)}
              className='absolute z-500 top-[7%]'
            />
          }
        </div>
        

        {displayDrawer &&
          <div className='flex flex-row gap-8 mr-[40%]'>
            <Icon 
              name='rock'
              SVGClassName={`h-7 w-7 ${props.currentTool === 'ROCK' ? 'stroke-main' : 'stroke-white'}`}
              onClick={props.onRockClick}
            />
            <Icon 
              name='parking'
              SVGClassName={`h-6 w-6 ${props.currentTool === 'PARKING' ? 'fill-second' : 'fill-white'}`}
              onClick={props.onParkingClick}
            />
            <Icon 
              name='help-round'
              SVGClassName={`h-6 w-6 ${props.currentTool === 'WAYPOINT' ? 'fill-third stroke-third' : 'fill-white stroke-white'}`}
              onClick={props.onWaypointClick}
            />
          </div>
        }

        {displayLogin &&
          <Link href='/user/login' passHref>
            <div className='ktext-base text-white cursor-pointer mr-[3%]'>
              Se connecter
            </div>
          </Link>
        }

      </div>
    </>
  );
};
