import { HeaderDesktop, LeftbarDesktop } from 'components';
import React from 'react';
import { LightTopo } from 'types';

interface AdminDesktopProps {
    lightTopos?: LightTopo[]
}

export const AdminDesktop: React.FC<AdminDesktopProps> = (props: AdminDesktopProps) => {
    return (
        <>
            <HeaderDesktop
                backLink="#"
                title="Administration"
            />

            <div className="flex flex-row h-full">
                <LeftbarDesktop
                    currentMenuItem="ADMIN"
                />

                {/* CONTENT GOES HERE */}

            </div>
        </>
    )
}