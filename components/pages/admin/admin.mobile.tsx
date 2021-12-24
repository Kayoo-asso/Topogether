import { HeaderMobile } from 'components';
import React from 'react';
import { LightTopo } from 'types';

interface AdminMobileProps {
    lightTopos?: LightTopo[]
}

export const AdminMobile: React.FC<AdminMobileProps> = (props: AdminMobileProps) => {
    return (
        <div className='h-full w-full flex flex-col'>
            <HeaderMobile
                title='Administration'
                backLink='/user/profile'
            />

            {/* CONTENT GOES HERE */}
        </div>
    )
}