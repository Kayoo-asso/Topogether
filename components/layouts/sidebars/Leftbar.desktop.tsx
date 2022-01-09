import React, { useContext } from 'react';
import { Button, Icon, ProfilePicture } from 'components';
import Link from 'next/link';
import { staticUrl, UserContext } from 'helpers';

interface LeftbarDesktopProps {
    currentMenuItem?: 'BUILDER' | 'MAP' | 'USER' | 'ADMIN',
}

export const LeftbarDesktop: React.FC<LeftbarDesktopProps> = ({
    currentMenuItem = 'MAP',
}: LeftbarDesktopProps) => {
    const { session } = useContext(UserContext);

    if (!session) return null;
    return (
      <div className="bg-white border-r border-grey-medium w-[300px] h-full hidden md:flex flex-col px-8 py-10 z-100">
        <div className="grid grid-cols-3 items-center pb-[50%]">
          <div>
            <ProfilePicture
              src={session.profilePicture?.url || staticUrl.defaultProfilePicture}
            />
          </div>
          <div className="">
            <div className="ktext-subtitle text-dark">{session?.pseudo}</div>
            <div className="ktext-label text-main col-span-2">{session?.role === 'ADMIN' ? 'Administrateur' : 'Grimpeur cartographe'}</div>
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
          {session?.role === 'ADMIN'
                    && (
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
          href="/"
          className=""
        />
      </div>
    );
};
