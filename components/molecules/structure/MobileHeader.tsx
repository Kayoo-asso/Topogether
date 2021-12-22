import { Icon } from 'components';
import Link from 'next/link';
import React, { useState } from 'react';
import { Dropdown, DropdownOption } from '..';

interface MobileHeaderProps {
  title: string,
  menuOptions: DropdownOption[],
  backLink: string,
}

export const MobileHeader: React.FC<MobileHeaderProps> = (props: MobileHeaderProps) => {
  const [displayFullTitle, setDisplayFullTitle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-dark flex items-center h-header">
        <Link href={props.backLink} passHref>
          <div className="w-1/6">
            <Icon
              name="arrow-simple"
              SVGClassName="stroke-white stroke-1 w-4 h-4"
              center
            />
          </div>
        </Link>

        <div
          className="flex-1 text-white ktext-title whitespace-nowrap"
          onClick={() => {
            setDisplayFullTitle(!displayFullTitle);
          }}
          role="button"
          tabIndex={0}
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
        {menuOpen &&
          <Dropdown 
            choices={props.menuOptions}
            className='absolute z-50 right-[10px] top-[8%] min-w-[40%]'
          />
        }
      </div>

      {displayFullTitle && (
        <div
          className="full-header-title-popup"
          onClick={() => {
            setDisplayFullTitle(false);
          }}
          role="button"
          tabIndex={0}
        >
            {props.title}
        </div>
      )}
    </>
  );
};
