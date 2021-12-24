import React from 'react';
import { User } from 'types';

interface ProfileMobileProps {
    user: User,
}

export const ProfileMobile: React.FC<ProfileMobileProps> = (props: ProfileMobileProps) => {
    return (
        <div className='h-full w-full flex flex-col'>
            {/* CONTENT GOES HERE */}
        </div>
    )
}