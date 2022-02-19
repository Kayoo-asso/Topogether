import React, { useCallback, useContext, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Button, createTrack, Icon } from 'components';
import { BoulderOrder, polygonContains, UserContext } from 'helpers';
import { Quark, QuarkArray, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Grade, Name, Sector, Track, UUID } from 'types';
import { v4 } from 'uuid';

interface LeftbarBuilderDesktopProps {
    sectors: QuarkArray<Sector>,
    boulders: QuarkArray<Boulder>,
    boulderOrder: BoulderOrder[],
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
    onValidate: () => void,
}

export const LeftbarBuilderDesktop: React.FC<LeftbarBuilderDesktopProps> = watchDependencies((props: LeftbarBuilderDesktopProps) => {
    const { session } = useContext(UserContext);
    const selectedBoulder = props.selectedBoulder();

    const [displayedSectors, setDisplayedSectors] = useState<Array<UUID>>(props.sectors.map(sector => sector.id).toArray());
    const [displayedBoulders, setDisplayedBoulders] = useState<Array<UUID>>([]);

    const getGradeColorClass = (grade: Grade) => {
        const lightGrade = parseInt(grade[0]);
        switch (lightGrade) {
            case 3:
                return 'text-grade-3';
            case 4:
                return 'text-grade-4';
            case 5:
                return 'text-grade-5';
            case 6:
                return 'text-grade-6';
            case 7:
                return 'text-grade-7';
            case 8:
                return 'text-grade-8';
            case 9:
                return 'text-grade-9';
        }
    }

    const handleDragEnd = useCallback((res: DropResult) => {
        // const sourceSector = props.sectors.find(s => s.id === res.source.droppableId);
        // const destinationSector = props.sectors.find(s => s.id === res.destination?.droppableId);
        // if (res.destination && sourceSector && destinationSector) { 
        //     const oldIndex = res.source.index;
        //     const newIndex = res.destination.index;
        //     const draggedBoulder = sourceSector.boulders.findQuark(b => b.orderIndex === oldIndex)!;
        //     if (destinationSector.id !== sourceSector.id) {
        //         for (const bQ of sourceSector.boulders.quarks()) {
        //             if (bQ().orderIndex > oldIndex) {
        //                 bQ.set(prev => ({
        //                     ...prev,
        //                     orderIndex: prev.orderIndex - 1
        //                 }));
        //             }
        //         }
        //         for (const bQ of destinationSector.boulders.quarks()) {
        //             if (bQ().orderIndex >= newIndex) {
        //                 bQ.set(prev => ({
        //                     ...prev,
        //                     orderIndex: prev.orderIndex + 1
        //                 }))
        //             }
        //         }
        //     }
        //     else {
        //         if (oldIndex < newIndex)
        //             for (const bQ of sourceSector.boulders.quarks()) {  
        //                 if (bQ().orderIndex > oldIndex && bQ().orderIndex <= newIndex) {
        //                     // console.log('-1 on boulder '+ bQ().name)
        //                     bQ.set(prev => ({
        //                         ...prev,
        //                         orderIndex: prev.orderIndex - 1
        //                     }))
        //                 }
        //             }
        //         else
        //             for (const bQ of sourceSector.boulders.quarks()) {  
        //                 if (bQ().orderIndex < oldIndex && bQ().orderIndex >= newIndex) {
        //                     // console.log('+1 on boulder '+ bQ().name)
        //                     bQ.set(prev => ({
        //                         ...prev,
        //                         orderIndex: prev.orderIndex + 1
        //                     }))
        //                 }
        //             }
        //     }
        //     draggedBoulder.set({
        //         ...draggedBoulder(),
        //         orderIndex: newIndex
        //     });
        //     sourceSector.boulders.remove(draggedBoulder());
        //     destinationSector.boulders.push(draggedBoulder());
        // }
    }, []);

    if (!session) return null;
    return (
        <div className='bg-white border-r border-grey-medium min-w-[280px] w-[280px] h-full hidden md:flex flex-col px-2 py-10 z-500'>
                  
            <DragDropContext onDragEnd={handleDragEnd}>  
                <div className='h-[95%] overflow-y-auto mb-6 px-4'>

                    {props.sectors.quarks().map((sectorQuark, sectorIndex) => {
                        const sector = sectorQuark();
                        const boulderQuarks = sector.boulders.map(id => props.boulders.findQuark(b => b.id === id)!);
                        return (
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
                                                    const orderIndex = props.boulderOrder.find(bo => bo.id === boulder.id)!.index;
                                                    const tracksIter = boulder.tracks.quarks();
                                                    const trackQuarks = Array.from(tracksIter);
                                                    return (
                                                        <Draggable key={boulder.id} draggableId={boulder.id} index={orderIndex}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                    <div className='flex flex-row cursor-pointer text-dark items-center'>
                                                                        <Icon
                                                                            name='arrow-simple'
                                                                            wrapperClassName='pr-3'
                                                                            SVGClassName={'w-3 h-3 stroke-dark ' + (selectedBoulder?.id === boulder.id ? 'stroke-2 ' : '') + (displayedBoulders.includes(boulder.id) ? '-rotate-90' : 'rotate-180')}
                                                                            onClick={() => {
                                                                                const newDB = [...displayedBoulders];
                                                                                if (newDB.includes(boulder.id)) newDB.splice(newDB.indexOf(boulder.id), 1)
                                                                                else newDB.push(boulder.id);
                                                                                setDisplayedBoulders(newDB);
                                                                            }}
                                                                        />
                                                                        <div
                                                                            onClick={() => {
                                                                                props.onBoulderSelect(boulderQuark);
                                                                                const newDB = [...displayedBoulders];
                                                                                if (!newDB.includes(boulder.id)) {
                                                                                    newDB.push(boulder.id);
                                                                                    setDisplayedBoulders(newDB);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span className={'mr-2' + (selectedBoulder?.id === boulder.id ? ' font-semibold' : '')}>{orderIndex + 1}.</span>
                                                                            <span className={'ktext-base' + (selectedBoulder?.id === boulder.id ? ' font-semibold' : '')}>{boulder.name}</span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {displayedBoulders.includes(boulder.id) &&
                                                                        // TRACKS
                                                                        <div className='flex flex-col ml-4 mb-4'>
                                                                            {trackQuarks.map((trackQuark) => {
                                                                                const track = trackQuark();
                                                                                return (
                                                                                    <div 
                                                                                        key={track.id} 
                                                                                        className='flex flex-row cursor-pointer items-baseline'
                                                                                        onClick={() => props.onTrackSelect(trackQuark, boulderQuark)}
                                                                                    >
                                                                                        {track.grade &&
                                                                                            <div className={'mr-2 ktext-subtitle ' + getGradeColorClass(track.grade)}>{track.grade}</div>
                                                                                        }
                                                                                        <div className='text-grey-medium'>{track.name}</div>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                            <div
                                                                                className='text-grey-medium cursor-pointer mt-2'
                                                                                onClick={() => createTrack(boulder, session.id)}
                                                                            >
                                                                                + Nouveau passage
                                                                            </div>
                                                                        </div>
                                                                    }
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
                        )
                    })}
  
                </div>               
            </DragDropContext>

            {/* TODO: Add the boulders without sectors */}

            <div className='px-6'>
                <Button
                    content='Valider le topo'
                    onClick={props.onValidate}
                />
            </div>
        </div>
    )
});