import { MobileShell } from 'components';
import { ReactElement } from 'react';

interface MobileLayoutProps {
  children: ReactElement,
}

export const MobileLayout: React.FC<MobileLayoutProps> = (props: MobileLayoutProps) => {
  return (
    <div className="w-screen h-screen flex items-end flex-col">
      <div id="content" className="flex-1 w-screen bg-grey-light">
        {props.children}
      </div>

      <div id="footer" className="bg-dark z-100" style={{ height: '10vh' }}>
        <MobileShell
          initialActiveTab={1}
        />
      </div>
    </div>
  )
};
