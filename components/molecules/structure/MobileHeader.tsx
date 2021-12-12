import { Icon } from 'components';
import React, { useState } from 'react';

interface MobileHeaderProps {
  title: string,
  menu: any,
}

export const MobileHeader: React.FC<MobileHeaderProps> = (props: MobileHeaderProps) => {
  const [displayFullTitle, setDisplayFullTitle] = useState(false);

  return (
    <>
      <div className="bg-dark flex items-center" style={{ height: '5vh' }}>
        <div className="w-1/6">
          <Icon
            name="arrow-simple"
            className="stroke-white stroke-1 w-4 h-4"
            center
            onClick={() => {}}
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

        <div className={props.menu ? 'w-1/6' : ''}>
          {props.menu}
        </div>
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
