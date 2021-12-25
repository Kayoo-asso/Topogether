import { ShellMobile } from 'components';
import { ReactElement } from 'react';

interface LayoutMobileProps {
  children: ReactElement,
}

export const LayoutMobile: React.FC<LayoutMobileProps> = (props: LayoutMobileProps) => (
  <div className="w-screen h-screen flex items-end flex-col">
    <div 
      id="content" 
      className="flex-1 w-full absolute bg-grey-light h-contentPlusHeader flex flex-col"
    >
      {props.children}
    </div>

    <div id="footer" className="bg-dark z-100 absolute bottom-0 h-shell">
      <ShellMobile
        initialActiveTab={1}
      />
    </div>
  </div>
);
