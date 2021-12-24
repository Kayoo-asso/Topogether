import { HeaderDesktop } from 'components';
import React from 'react';

export const LoginDesktop:React.FC = () => {
    return (
        <>
            <HeaderDesktop
                backLink="#"
                title="Topogether"
                displayLogin
            />

            <div className="flex flex-row h-full">

                {/* CONTENT GOES HERE */}

            </div>
        </>
    )
}