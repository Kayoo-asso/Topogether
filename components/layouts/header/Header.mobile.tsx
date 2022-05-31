import React, { ReactNode, useState } from 'react';
import { Dropdown, DropdownOption } from 'components';
import Link from 'next/link';
import ArrowSimple from 'assets/icons/arrow-simple.svg';
import MenuIcon from 'assets/icons/menu.svg';
import { useLoader } from 'helpers';

interface HeaderMobileProps {
  title: string,
  menuOptions?: DropdownOption[],
  backLink: string,
  children?: ReactNode;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = (props: HeaderMobileProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayTitleTooltip, setDisplayTitleTooltip] = useState(false);

  const [Loader, showLoader] = useLoader();

  return (
    <div className="bg-dark flex items-center h-header">

      <div className='w-1/6 flex justify-center'>
        <Link href={props.backLink}>
          <a onClick={showLoader}><ArrowSimple className="stroke-white stroke-1 w-4 h-4" /></a>
        </Link>
      </div>

      <div
        className={(props.children ? 'w-3/6' : 'w-4/6') + " text-white ktext-title whitespace-nowrap overflow-hidden"}
        aria-label={displayTitleTooltip ? props.title : undefined}
        data-microtip-position="bottom"
        role="tooltip"
        onClick={() => setDisplayTitleTooltip(!displayTitleTooltip)}
      >
        {props.title}
      </div>

      {props.children &&
        <div className="w-1/6 pl-5 flex flex-row items-center">
          {props.children}
        </div>
      }

      {props.menuOptions && (
        <button className="w-1/6 flex justify-center" onClick={() => setMenuOpen(x => !x)}>
          <MenuIcon
            className={`h-4 w-4 fill-white ${menuOpen ? 'rotate-90' : ''}`}
          />
        </button>
      )}
      {menuOpen && props.menuOptions
          && (
          <Dropdown
            options={props.menuOptions}
            className="absolute z-100 right-[10px] top-[7%] min-w-[40%]"
            onSelect={() => setMenuOpen(false)}
          />
      )}
      <Loader />
    </div>
  );
};
