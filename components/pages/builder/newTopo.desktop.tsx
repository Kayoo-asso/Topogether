import { HeaderDesktop } from 'components';
import React from 'react';

interface NewTopoDesktopProps {
    createTopo: () => void,
}

export const NewTopoDesktop: React.FC<NewTopoDesktopProps> = (props: NewTopoDesktopProps) => {
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