import { HeaderDesktop } from 'components';
import React from 'react';

export const NewTopoDesktop:React.FC = () => {
    return (
        <>
            <HeaderDesktop
                backLink="/builder/dashboard"
                title="Nouveau topo"
            />

            <div className="flex flex-row h-full bg-main">

                {/* CONTENT GOES HERE */}

            </div>
        </>
    )
}