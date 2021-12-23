import { MobileShell } from 'components';
import { ReactElement } from 'react';

interface MobileLayoutProps {
  children: ReactElement,
}

export const MobileLayout: React.FC<MobileLayoutProps> = (props: MobileLayoutProps) => (
  <div className="w-screen h-screen flex items-end flex-col">
    <div id="content" className="flex-1 w-screen absolute bg-white h-contentPlusHeader flex flex-col ">
      {props.children}
    </div>

    <div id="footer" className="bg-dark z-100 absolute bottom-0 h-shell">
      <MobileShell
        initialActiveTab={1}
      />
    </div>
  </div>
);
