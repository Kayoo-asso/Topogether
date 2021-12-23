import React from 'react';
import { HeaderDesktop } from 'components';
import { Topo } from 'types';

interface BuilderMapDesktopProps {
    topo: Topo,
}

export const BuilderMapDesktop:React.FC<BuilderMapDesktopProps> = (props: BuilderMapDesktopProps) => {
    return (
        <>
            <HeaderDesktop
                backLink='/builder/dashboard'
                title={props.topo.name}
                menuOptions={[
                    { value: 'Infos du topo', action: () => {} },
                    { value: 'Marche d\'approche', action: () => {} },
                    { value: 'Gestionnaires du site', action: () => {} },
                    { value: 'Valider le topo', action: () => {} },
                    { value: 'Supprimer le topo', action: () => {} }
                ]}
                displayDrawer
                onRockClick={() => console.log("rock")}
                onParkingClick={() => console.log("rock")}
                onWaypointClick={() => console.log("rock")}
            />
        </>
    )
}