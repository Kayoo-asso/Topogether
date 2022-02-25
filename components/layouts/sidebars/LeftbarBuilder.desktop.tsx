import React from 'react';
import { Button, SectorListBuilder } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Topo, Track, UUID } from 'types';

interface LeftbarBuilderDesktopProps {
    topoQuark: Quark<Topo>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
    onValidate: () => void,
}

export const LeftbarBuilderDesktop: React.FC<LeftbarBuilderDesktopProps> = watchDependencies((props: LeftbarBuilderDesktopProps) => {

    return (
        <div className='bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full hidden md:flex flex-col px-2 py-10 z-500'>
            
            <SectorListBuilder 
                topoQuark={props.topoQuark}
                boulderOrder={props.boulderOrder}
                selectedBoulder={props.selectedBoulder}
                onBoulderSelect={props.onBoulderSelect}
                onTrackSelect={props.onTrackSelect}
            />

            <div className='px-6'>
                <Button
                    content='Valider le topo'
                    onClick={props.onValidate}
                />
            </div>
        </div>
    )
});

LeftbarBuilderDesktop.displayName = "Leftbar Builder Desktop";