import React from 'react';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Topo, Track, UUID } from 'types';
import { api } from 'helpers/services/ApiService';
import { SectorList } from 'components';

interface LeftbarTopoDesktopProps {
    topoQuark: Quark<Topo>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
}

export const LeftbarTopoDesktop: React.FC<LeftbarTopoDesktopProps> = watchDependencies((props: LeftbarTopoDesktopProps) => {
    const session = api.user();

    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full hidden md:flex flex-col px-2 py-10 z-500'>
            <SectorList 
                topoQuark={props.topoQuark}
                boulderOrder={props.boulderOrder}
                selectedBoulder={props.selectedBoulder}
                onBoulderSelect={props.onBoulderSelect}
                onTrackSelect={props.onTrackSelect}
            />
        </div>
    )
});

LeftbarTopoDesktop.displayName = "Leftbar Topo Desktop";