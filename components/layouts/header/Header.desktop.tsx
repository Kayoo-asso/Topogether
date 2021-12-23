import { Dropdown, DropdownOption, Icon } from 'components';
import { default as NextImage } from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

interface HeaderDesktopProps {
  backLink: string,
  title: string,
  menuOptions?: DropdownOption[],
  displayDrawer?: boolean,
  onRockClick?: () => void,
  onParkingClick?: () => void,
  onWaypointClick?: () => void,
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
            aria-label={props.title}
            data-microtip-position="bottom" 
            role="tooltip"
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
              className='absolute z-50 top-[7%]'
            />
          }
        </div>
        

        {displayDrawer &&
          <div className='flex flex-row gap-8 mr-[40%]'>
            <Icon 
              name='rock'
              SVGClassName='stroke-white h-7 w-7'
              onClick={props.onRockClick}
            />
            <Icon 
              name='parking'
              SVGClassName='fill-white h-6 w-6'
              onClick={props.onParkingClick}
            />
            <Icon 
              name='help'
              SVGClassName='fill-white h-6 w-6'
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
