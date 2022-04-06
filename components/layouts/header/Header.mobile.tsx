import { Dropdown, DropdownOption } from 'components';
import Link from 'next/link';
import React, { useState } from 'react';
import ArrowSimple from 'assets/icons/arrow-simple.svg';
import MenuIcon from 'assets/icons/menu.svg';

interface HeaderMobileProps {
  title: string,
  menuOptions?: DropdownOption[],
  backLink: string,
}

export const HeaderMobile: React.FC<HeaderMobileProps> = (props: HeaderMobileProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [displayTitleTooltip, setDisplayTitleTooltip] = useState(false);

  return (
    <div className="bg-dark flex items-center h-header">

      <div className='w-1/6 flex justify-center'>
        <Link href={props.backLink} passHref>
            <ArrowSimple
              className="stroke-white stroke-1 w-4 h-4"
            />
        </Link>
      </div>

      <div
        className="flex-1 text-white ktext-title whitespace-nowrap"
        aria-label={displayTitleTooltip ? props.title : undefined}
        data-microtip-position="bottom"
        role="tooltip"
        onClick={() => setDisplayTitleTooltip(!displayTitleTooltip)}
      >
        {props.title}
      </div>

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
    </div>
  );
};
