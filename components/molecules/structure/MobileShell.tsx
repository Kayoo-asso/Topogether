/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon } from 'components';
import { UserContext } from 'helpers';

interface MobileShellProps {
  initialActiveTab: 0 | 1 | 2,
}

export const MobileShell: React.FC<MobileShellProps> = ({
  initialActiveTab = 1,
  ...props
}: MobileShellProps) => {
  const { session } = useContext(UserContext);
  const router = useRouter();

  const [displayModalLogin, setDisplayModalLogin] = useState(false);
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [topoUrl, setTopoUrl] = useState<string>('');

  const changeTab = (id: 0 | 1 | 2) => {
    if (activeTab === 1) {
      setTopoUrl(router.pathname);
    }
    setActiveTab(id);
  };

  return (
    <>
      <div className="shell-container w-screen min-h-full bg-dark grid grid-cols-3 items-center">
        <Link href={session ? '/user/profile' : '/user/login'} passHref>
          <div
            className={`${activeTab === 0 ? 'border-t-main border-t-6' : ''} h-full cursor-pointer`}
            onClick={() => changeTab(0)}
            role="button"
            tabIndex={0}
          >
            <Icon
              name="user"
              SVGClassName={`h-5 w-5 ${activeTab === 0 ? 'fill-main' : 'fill-white'} `}
              center
            />
          </div>
        </Link>

        <Link href={topoUrl || '/'} passHref>
          <div
            className={`${activeTab === 1 ? 'border-t-main border-t-6' : ''} h-full  cursor-pointer`}
            onClick={() => changeTab(1)}
            role="button"
            tabIndex={0}
          >
            <Icon
              name="waypoint"
              SVGClassName={`h-5 w-5 stroke-1 ${activeTab === 1 ? 'fill-main' : 'fill-white'} `}
              center
            />
          </div>
        </Link>
        {/* <Link href={session ? '/builder/dashboard' : '#'} passHref> */}

        <Link href="/builder/dashboard" passHref>
          <div
            className={`${activeTab === 2 ? 'border-t-main border-t-6' : ''} h-full  cursor-pointer`}
            onClick={() => {
              if (session) changeTab(2);
              else setDisplayModalLogin(true);
            }}
            role="button"
            tabIndex={0}
          >
            <Icon
              name="topo"
              SVGClassName={`h-5 w-5 stroke-1 ${activeTab === 2 ? 'stroke-main' : 'stroke-white'} `}
              center
            />
          </div>
        </Link>
      </div>

      {/* {displayModalLogin
        && (
        <ModalLogin
          open
          onClose={() => setDisplayModalLogin(false)}
          onLoginSuccess={() => {
            router.push('/my');
          }}
        />
        )} */}

    </>
  );
};
