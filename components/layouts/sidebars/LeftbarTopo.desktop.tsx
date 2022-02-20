import React, { useCallback, useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { BoulderItemLeftbar, Button, createTrack, Icon } from 'components';
import { splitArray, UserContext } from 'helpers';
import { Quark, QuarkArray, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Sector, Track, UUID } from 'types';

interface LeftbarTopoDesktopProps {
    sectors: QuarkArray<Sector>,
    boulders: QuarkArray<Boulder>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
    onValidate: () => void,
}

export const LeftbarTopoDesktop: React.FC<LeftbarTopoDesktopProps> = watchDependencies((props: LeftbarTopoDesktopProps) => {
    const { session } = useContext(UserContext);
    const selectedBoulder = props.selectedBoulder();
    const [bouldersIn, bouldersOut] = splitArray(props.boulders.quarks().toArray(), b => props.sectors.toArray().map(s => s.boulders).flat().includes(b().id))

    const [displayedSectors, setDisplayedSectors] = useState<Array<UUID>>(props.sectors.map(sector => sector.id).toArray());
    const [displayedBoulders, setDisplayedBoulders] = useState<Array<UUID>>([]);

    const handleDragEnd = useCallback((res: DropResult) => {
        console.log(res);
    }, []);

    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full hidden md:flex flex-col px-2 py-10 z-500'>
            <div className='h-[95%] overflow-y-auto mb-6 px-4'>

                {props.sectors.quarks().map((sectorQuark, sectorIndex) => {
                    const sector = sectorQuark();
                    const boulderQuarks = sector.boulders.map(id => bouldersIn.find(b => b().id === id)!);
                    return (
                        <DragDropContext onDragEnd={handleDragEnd} key={sector.id}>  
                            <Droppable droppableId={sector.id} key={sector.id}>
                                {(provided) => (
                                    <div className='flex flex-col mb-10' {...provided.droppableProps} ref={provided.innerRef}>
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
                                                    const orderIndex = props.boulderOrder.get(boulder.id)!;
                                                    return (
                                                        <Draggable key={boulder.id} draggableId={boulder.id} index={orderIndex}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                    <BoulderItemLeftbar 
                                                                        boulder={boulderQuark}
                                                                        orderIndex={orderIndex}
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
                                                            )}
                                                        </Draggable>
                                                    )
                                                })}
                                            </div>
                                        }
                                        {provided.placeholder}
                                    </div>
                                    
                                )}
                            </Droppable>
                        </DragDropContext>
                    )
                })}
  
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='no-sector'>
                        {(provided) => (
                            <div className='flex flex-col mb-10' {...provided.droppableProps} ref={provided.innerRef}>
                                <div className="ktext-label text-grey-medium">Sans secteur</div>
                                {bouldersOut.map(boulderQuark => {
                                    const boulder = boulderQuark();
                                    const orderIndex = props.boulderOrder.get(boulder.id)!;
                                    return (
                                        <Draggable key={boulder.id} draggableId={boulder.id} index={orderIndex}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <BoulderItemLeftbar 
                                                        boulder={boulderQuark}
                                                        orderIndex={orderIndex}
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
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

            </div>


            <div className='px-6'>
                <Button
                    content='Valider le topo'
                    onClick={props.onValidate}
                />
            </div>
        </div>
    )
});