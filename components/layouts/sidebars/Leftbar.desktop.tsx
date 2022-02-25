import React from 'react';
import { Button, Icon } from 'components';
import Link from 'next/link';
import { api } from 'helpers/services/ApiService';
import { watchDependencies } from 'helpers/quarky';

interface LeftbarDesktopProps {
    currentMenuItem?: 'BUILDER' | 'MAP' | 'USER' | 'ADMIN',
}

export const LeftbarDesktop: React.FC<LeftbarDesktopProps> = watchDependencies(({
    currentMenuItem = 'MAP',
}: LeftbarDesktopProps) => {
  const session = api.user();
  if (!session) return <></>;
 
  return (
    <div className="hidden md:flex flex-col bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full px-8 py-10 z-200">
        <div className="mb-20 mt-2">
          <div>
            Bonjour <span className="ktext-subtitle text-main">{session.userName}</span> !
          </div>
        </div>

      <div className="flex-1 flex flex-col gap-10">
        <Link href="/builder/dashboard" passHref>
          <div className="cursor-pointer flex flex-row">
            <Icon
              name="topo"
              SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'BUILDER' ? 'stroke-main' : 'stroke-dark'}`}
            />
            <span className={`ktext-title ${currentMenuItem === 'BUILDER' ? 'text-main' : 'text-dark'}`}>Mes topos</span>
          </div>
        </Link>
        <Link href="/" passHref>
          <div className="cursor-pointer flex flex-row">
            <Icon
              name="waypoint"
              SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'MAP' ? 'fill-main' : 'fill-dark'}`}
            />
            <span className={`ktext-title ${currentMenuItem === 'MAP' ? 'text-main' : 'text-dark'}`}>Carte</span>
          </div>
        </Link>
        <Link href="/user/profile" passHref>
          <div className="cursor-pointer flex flex-row">
            <Icon
              name="user"
              SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'USER' ? 'fill-main' : 'fill-dark'}`}
            />
            <span className={`ktext-title ${currentMenuItem === 'USER' ? 'text-main' : 'text-dark'}`}>Profile</span>
          </div>
        </Link>
        {session.role === 'ADMIN' && (
          <Link href="/admin" passHref>
            <div className="cursor-pointer flex flex-row">
              <Icon
                name="key"
                SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'ADMIN' ? 'stroke-main' : 'stroke-dark'}`}
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