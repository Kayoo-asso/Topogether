import React, { useContext } from 'react';
import { Button, Icon, ProfilePicture } from 'components';
import Link from 'next/link';
import { UserContext } from 'helpers';

interface LeftbarDesktopProps {
    currentMenuItem?: string,
}

export const LeftbarDesktop: React.FC<LeftbarDesktopProps> = ({
    currentMenuItem = 'map'
}: LeftbarDesktopProps) => {
    const { session } = useContext(UserContext);
    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium w-[300px] h-full flex flex-col px-8 py-10'>
            <div className="grid grid-cols-3 items-center pb-[50%]">
                <div>
                   <ProfilePicture 
                        src={session.profilePicture?.url || '/assets/img/Default_profile_picture.png'}
                   /> 
                </div>
                <div className=''>
                    <div className='ktext-subtitle text-dark'>{session?.pseudo}</div>
                    <div className='ktext-label text-main col-span-2'>{session?.role === 'ADMIN' ? 'Administrateur' : 'Grimpeur cartographe'}</div>
                </div>
            </div>

            <div className='flex-1 flex flex-col gap-10'>
                <Link href='/builder/dashboard' passHref>
                    <div className='cursor-pointer flex flex-row'>
                        <Icon 
                            name='topo'
                            SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'builder' ? 'stroke-main' : 'stroke-dark'}`}
                        />
                        <span className={`ktext-title ${currentMenuItem === 'builder' ? 'text-main' : 'text-dark'}`}>Mes topos</span>
                    </div>
                </Link>
                <Link href='/' passHref>
                    <div className='cursor-pointer flex flex-row'>
                        <Icon 
                            name='waypoint'
                            SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'map' ? 'fill-main' : 'fill-dark'}`}
                        />
                        <span className={`ktext-title ${currentMenuItem === 'map' ? 'text-main' : 'text-dark'}`}>Carte</span>
                    </div>
                </Link>
                <Link href='/user/profile' passHref>
                    <div className='cursor-pointer flex flex-row'>
                        <Icon 
                            name='user'
                            SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'user' ? 'fill-main' : 'fill-dark'}`}
                        />
                        <span className={`ktext-title ${currentMenuItem === 'user' ? 'text-main' : 'text-dark'}`}>Profile</span>
                    </div>
                </Link>
                {session?.role === 'ADMIN' &&
                    <Link href='/admin' passHref>
                        <div className='cursor-pointer flex flex-row'>
                            <Icon 
                                name='key'
                                SVGClassName={`h-6 w-6 mr-4 ${currentMenuItem === 'admin' ? 'stroke-main' : 'stroke-dark'}`}
                            />
                            <span className={`ktext-title ${currentMenuItem === 'admin' ? 'text-main' : 'text-dark'}`}>Admin</span>
                        </div>
                    </Link>
                }
            </div>

            <Button 
                content='Nouveau topo'
                href='/'
                className=''
            />
        </div>
    )
}