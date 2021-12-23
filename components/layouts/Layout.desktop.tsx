import { ShellMobile } from 'components';
import { ReactElement } from 'react';

interface LayoutDesktopProps {
  children: ReactElement,
}

export const LayoutDesktop: React.FC<LayoutDesktopProps> = (props: LayoutDesktopProps) => {
  return (
    <div className="w-screen h-screen flex items-end flex-col">
      <div id="content" className="flex-1 w-screen absolute bg-grey-light h-screen flex flex-col ">
        {props.children}
      </div>
    </div>
  )
};
