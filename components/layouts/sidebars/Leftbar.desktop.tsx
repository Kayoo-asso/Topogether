import React from 'react';
import { Button } from 'components';
import Link from 'next/link';
import { watchDependencies } from 'helpers/quarky';
import { useSession } from 'helpers/services';
import TopoIcon from 'assets/icons/topo.svg';
import WaypointIcon from 'assets/icons/waypoint.svg';
import UserIcon from 'assets/icons/user.svg';
import KeyIcon from 'assets/icons/key.svg';

interface LeftbarDesktopProps {
  currentMenuItem?: 'BUILDER' | 'MAP' | 'USER' | 'ADMIN',
}

export const LeftbarDesktop: React.FC<LeftbarDesktopProps> = watchDependencies(({
  currentMenuItem = 'MAP',
}: LeftbarDesktopProps) => {
  const user = useSession();

  return (
    <div className="hidden md:flex flex-col bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full px-8 py-10 z-200">
      <div className="mb-20 mt-2">
        <div>
          Bonjour <span className="ktext-subtitle text-main">{user?.userName}</span> !
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-10">
        <Link href="/builder/dashboard" passHref>
          <div className="cursor-pointer flex flex-row">
            <TopoIcon
              className={`h-6 w-6 mr-4 ${currentMenuItem === 'BUILDER' ? 'stroke-main' : 'stroke-dark'}`}
            />
            <span className={`ktext-title ${currentMenuItem === 'BUILDER' ? 'text-main' : 'text-dark'}`}>Mes topos</span>
          </div>
        </Link>
        <Link href="/" passHref>
          <div className="cursor-pointer flex flex-row">
            <WaypointIcon
              className={`h-6 w-6 mr-4 ${currentMenuItem === 'MAP' ? 'fill-main' : 'fill-dark'}`}
            />
            <span className={`ktext-title ${currentMenuItem === 'MAP' ? 'text-main' : 'text-dark'}`}>Carte</span>
          </div>
        </Link>
        <Link href="/user/profile" passHref>
          <div className="cursor-pointer flex flex-row">
            <UserIcon
              className={`h-6 w-6 mr-4 ${currentMenuItem === 'USER' ? 'fill-main' : 'fill-dark'}`}
            />
            <span className={`ktext-title ${currentMenuItem === 'USER' ? 'text-main' : 'text-dark'}`}>Profile</span>
          </div>
        </Link>
        {user?.role === 'ADMIN' && (
          <Link href="/admin" passHref>
            <div className="cursor-pointer flex flex-row">
              <KeyIcon
                className={`h-6 w-6 mr-4 ${currentMenuItem === 'ADMIN' ? 'stroke-main' : 'stroke-dark'}`}
              />
              <span className={`ktext-title ${currentMenuItem === 'ADMIN' ? 'text-main' : 'text-dark'}`}>Admin</span>
            </div>
          </Link>
        )}
      </div>

      <Button
        content="Nouveau topo"
        href="/builder/new"
        className=""
      />
    </div>
  );
});

LeftbarDesktop.displayName = "Leftbar Desktop";