import { Icon } from 'components';
import React, { useState } from 'react';

interface MobileHeaderProps {
  title: string,
  menu?: any,
  onBackClick: () => void,
}

export const MobileHeader: React.FC<MobileHeaderProps> = (props: MobileHeaderProps) => {
  const [displayFullTitle, setDisplayFullTitle] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="bg-dark flex items-center h-header">
        <div className="w-1/6">
          <Icon
            name="arrow-simple"
            SVGClassName="stroke-white stroke-1 w-4 h-4"
            center
            onClick={props.onBackClick}
          />
        </div>

        <div
          className="flex-1 text-white ktext-title whitespace-nowrap"
          onClick={() => {
            setDisplayFullTitle(true);
          }}
          role="button"
          tabIndex={0}
        >
          {props.title}
        </div>

        {props.menu && (
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
