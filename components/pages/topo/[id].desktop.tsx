import { HeaderDesktop, LeftbarDesktop } from 'components';
import React from 'react';
import { Topo } from 'types';

interface TopoDesktopProps {
    topo: Topo,
}

export const TopoDesktop:React.FC<TopoDesktopProps> = (props: TopoDesktopProps) => {
    return (
        <>
            <HeaderDesktop
                backLink="#"
                title={props.topo.name}
            />

            <div className="flex flex-row h-full">
                <LeftbarDesktop
                    currentMenuItem="MAP"
                />

                {/* CONTENT GOES HERE */}

            </div>
        </>
    )
}