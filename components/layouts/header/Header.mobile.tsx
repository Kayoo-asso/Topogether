import { Dropdown, DropdownOption, Icon } from 'components';
import Link from 'next/link';
import React, { useState } from 'react';

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

      <Link href={props.backLink} passHref>
        <div className="w-1/6 h-full">
          <Icon
            name="arrow-simple"
            SVGClassName="stroke-white stroke-1 w-4 h-4"
            center
          />
        </div>
      </Link>

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
      <div className="w-1/6">
        <Icon
          name="menu"
          SVGClassName={`h-4 w-4 fill-white ${menuOpen ? 'rotate-90' : ''}`}
          center
          onClick={() => {
                setMenuOpen(!menuOpen);
              }}
        />
      </div>
        )}
      {menuOpen && props.menuOptions
          && (
          <Dropdown
            choices={props.menuOptions}
            className="absolute z-50 right-[10px] top-[7%] min-w-[40%]"
          />
    )}
    </div>
  );
};