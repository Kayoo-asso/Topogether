/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { watchDependencies } from 'helpers/quarky';
import { useAuth } from 'helpers/services';
import TopoIcon from 'assets/icons/topo.svg';
import UserIcon from 'assets/icons/user-mobile.svg';
import WaypointIcon from 'assets/icons/waypoint.svg';

export const ShellMobile: React.FC = watchDependencies(() => {
  const router = useRouter();
  const auth = useAuth();
  const session = auth.session();

  const initialActiveTab = useMemo(() => {
    if (router.pathname.includes('user')) {
      return 0;
    }
    if (router.pathname.includes('builder')) {
      return 2;
    }
    return 1;
  }, [router.pathname]);
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(initialActiveTab);
  const [topoUrl, setTopoUrl] = useState<string>('');

  const changeTab = (id: 0 | 1 | 2) => {
    if (activeTab === 1) {
      setTopoUrl(router.pathname);
    }
    setActiveTab(id);
  };
  useEffect(() => {
    if (router.pathname.includes('builder')) setActiveTab(2);
    else if (router.pathname.includes('user') || router.pathname.includes('admin')) setActiveTab(0);
    else setActiveTab(1);
  }, [router.pathname]);

  return (
    <>
      <div className="w-screen h-full bg-dark flex">
        <Link href={session ? '/user/profile' : '/user/login'}>
          <a
            className={`h-full flex-1 flex justify-center items-center ${activeTab === 0 ? 'border-t-main border-t-6' : ''}`}
            onClick={() => changeTab(0)}
          >
            <UserIcon
              className={`h-5 w-5 ${activeTab === 0 ? 'fill-main' : 'fill-white'} `}
            />
          </a>
        </Link>

        <Link href={topoUrl || '/'}>
          <a
            className={`h-full flex-1 flex justify-center items-center ${activeTab === 1 ? 'border-t-main border-t-6' : ''}`}
            onClick={() => changeTab(1)}
          >
            <WaypointIcon
              className={`h-5 w-5 stroke-1 ${activeTab === 1 ? 'fill-main' : 'fill-white'} `}
            />
          </a>
        </Link>

        <Link href={'/builder/dashboard'}>
          <a
            className={`h-full flex-1 flex justify-center items-center ${activeTab === 2 ? 'border-t-main border-t-6' : ''}`}
            onClick={() => {
              if (session) changeTab(2);
              else changeTab(0);
            }}
          >
            <TopoIcon
              className={`h-5 w-5 my-auto stroke-1 ${activeTab === 2 ? 'stroke-main' : 'stroke-white'} `}
            />
          </a>
        </Link>
      </div>
    </>
  );
});

ShellMobile.displayName = "ShellMobile";