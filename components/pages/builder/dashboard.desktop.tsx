import { HeaderDesktop, LeftbarDesktop } from 'components';
import React from 'react';
import { LightTopo } from 'types';

interface DashboardDesktopProps {
    topos: LightTopo[],
}

export const DashboardDesktop:React.FC<DashboardDesktopProps> = (props: DashboardDesktopProps) => {
    return (
        <>
            <HeaderDesktop
                backLink='#'
                title='Mes topos'
            />

            <div className='flex flex-row h-full'>
                <LeftbarDesktop 
                    currentMenuItem='builder'
                />

                {/* CODE GOES HERE */}

            </div>
        </>
    )
}