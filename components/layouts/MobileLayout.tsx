import { MobileShell } from 'components';
import { ReactElement } from 'react';

interface MobileLayoutProps {
  children: ReactElement,
}

export const MobileLayout: React.FC<MobileLayoutProps> = (props: MobileLayoutProps) => (
  <div className="w-screen h-screen flex items-end flex-col">
    <div id="content" className="bg-third flex-1 w-screen">
      <main>{props.children}</main>
    </div>

    <div id="footer" className="bg-diff-5" style={{ height: '10%' }}>
      <MobileShell
        initialActiveTab={1}
      />
    </div>
  </div>
);
