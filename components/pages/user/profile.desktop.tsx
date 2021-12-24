import { HeaderDesktop, LeftbarDesktop } from 'components';
import React from 'react';
import { User } from 'types';

interface ProfileDesktopProps {
    user: User,
}

export const ProfileDesktop: React.FC<ProfileDesktopProps> = (props: ProfileDesktopProps) => {
    return (
        <>
            <HeaderDesktop
                backLink="/"
                title="Mon profile"
            />

            <div className="flex flex-row h-full">
            <LeftbarDesktop
                currentMenuItem="USER"
            />

            {/* CONTENT GOES HERE */}

            </div>
        </>
    )
}