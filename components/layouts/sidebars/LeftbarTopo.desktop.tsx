import React, { useState } from 'react';
import { BoulderItemLeftbar, createTrack, Icon } from 'components';
import { splitArray } from 'helpers';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Topo, Track, UUID } from 'types';
import { api } from 'helpers/services/ApiService';

interface LeftbarTopoDesktopProps {
    topoQuark: Quark<Topo>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
}

export const LeftbarTopoDesktop: React.FC<LeftbarTopoDesktopProps> = watchDependencies((props: LeftbarTopoDesktopProps) => {
    const session = api.user();

    const selectedBoulder = props.selectedBoulder();
    const topo = props.topoQuark();
    const sectors = topo.sectors;
    const [bouldersIn, bouldersOut] = splitArray(topo.boulders.quarks().toArray(), b => sectors.toArray().map(s => s.boulders).flat().includes(b().id));
    const bouldersOutSorted = topo.lonelyBoulders.map(id => bouldersOut.find(b => b().id === id)!);

    const [displayedSectors, setDisplayedSectors] = useState<Array<UUID>>(sectors.map(sector => sector.id).toArray());
    const [displayedBoulders, setDisplayedBoulders] = useState<Array<UUID>>([]);

    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full hidden md:flex flex-col px-2 py-10 z-500'>
            <div className='h-[98%] overflow-y-auto mb-6 px-4'>

                {sectors.quarks().map((sectorQuark, sectorIndex) => {
                    const sector = sectorQuark();
                    const boulderQuarks = sector.boulders.map(id => bouldersIn.find(b => b().id === id)!);
                    return (
                        <div className='flex flex-col mb-10'>
                            <div className="ktext-label text-grey-medium">Secteur {sectorIndex + 1}</div>
                            <div className="ktext-section-title text-main cursor-pointer mb-2 flex flex-row items-center">
                                <Icon
                                    name='arrow-simple'
                                    wrapperClassName='pr-3'
                                    SVGClassName={'w-3 h-3 stroke-main stroke-2 ' + (displayedSectors.includes(sector.id) ? '-rotate-90' : 'rotate-180')}
                                    onClick={() => {
                                        const newDS = [...displayedSectors];
                                        if (newDS.includes(sector.id)) newDS.splice(newDS.indexOf(sector.id), 1)
                                        else newDS.push(sector.id);
                                        setDisplayedSectors(newDS);
                                    }}
                                />
                                <div
                                    onClick={() => {
                                        const newDS = [...displayedSectors];
                                        if (!newDS.includes(sector.id)) {
                                            newDS.push(sector.id);
                                            setDisplayedSectors(newDS);
                                        }
                                    }}
                                >
                                    {sector.name}
                                </div>
                            </div>
                            
                            {displayedSectors.includes(sector.id) &&
                                // BOULDERS
                                <div className='flex flex-col gap-1 ml-3'>
                                    {boulderQuarks.length < 1 &&
                                        <div className=''>
                                            Aucun rocher référencé
                                        </div>
                                    }
                                    {boulderQuarks.map((boulderQuark) => {
                                        const boulder = boulderQuark();
                                        return (
                                            <div>
                                                <BoulderItemLeftbar 
                                                    boulder={boulderQuark}
                                                    orderIndex={props.boulderOrder.get(boulder.id)!}
                                                    selected={selectedBoulder?.id === boulder.id}
                                                    displayed={displayedBoulders.includes(boulder.id)}
                                                    onArrowClick={() => {
                                                        const newDB = [...displayedBoulders];
                                                        if (newDB.includes(boulder.id)) newDB.splice(newDB.indexOf(boulder.id), 1)
                                                        else newDB.push(boulder.id);
                                                        setDisplayedBoulders(newDB);
                                                    }}
                                                    onNameClick={() => {
                                                        props.onBoulderSelect(boulderQuark);
                                                        const newDB = [...displayedBoulders];
                                                        if (!newDB.includes(boulder.id)) {
                                                            newDB.push(boulder.id);
                                                            setDisplayedBoulders(newDB);
                                                        }
                                                    }}
                                                    onTrackClick={(trackQuark) => props.onTrackSelect(trackQuark, boulderQuark)}
                                                    displayCreateTrack
                                                    onCreateTrack={() => createTrack(boulder, session.id)}
                                                />
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                        </div>             
                    )
                })}
                            
                <div className='flex flex-col mb-10'>
                    <div className="ktext-label text-grey-medium mb-2">Sans secteur</div>
                    <div className='flex flex-col gap-1 ml-3'>
                        {bouldersOutSorted.map((boulderQuark) => {
                            const boulder = boulderQuark();
                            return (
                                <div>
                                    <BoulderItemLeftbar 
                                        boulder={boulderQuark}
                                        orderIndex={props.boulderOrder.get(boulder.id)!}
                                        selected={selectedBoulder?.id === boulder.id}
                                        displayed={displayedBoulders.includes(boulder.id)}
                                        onArrowClick={() => {
                                            const newDB = [...displayedBoulders];
                                            if (newDB.includes(boulder.id)) newDB.splice(newDB.indexOf(boulder.id), 1)
                                            else newDB.push(boulder.id);
                                            setDisplayedBoulders(newDB);
                                        }}
                                        onNameClick={() => {
                                            props.onBoulderSelect(boulderQuark);
                                            const newDB = [...displayedBoulders];
                                            if (!newDB.includes(boulder.id)) {
                                                newDB.push(boulder.id);
                                                setDisplayedBoulders(newDB);
                                            }
                                        }}
                                        onTrackClick={(trackQuark) => props.onTrackSelect(trackQuark, boulderQuark)}
                                        displayCreateTrack
                                        onCreateTrack={() => createTrack(boulder, session.id)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
});