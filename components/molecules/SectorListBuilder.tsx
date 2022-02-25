import React, { useCallback, useState } from 'react';
import { BoulderItemLeftbar, Icon } from 'components';
import { arrayMove, createTrack, splitArray } from 'helpers';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Topo, Track, UUID } from 'types';
import { api } from 'helpers/services/ApiService';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

interface SectorListBuilderProps {
    topoQuark: Quark<Topo>,
    boulderOrder: Map<UUID, number>,
    selectedBoulder: SelectQuarkNullable<Boulder>,
    onBoulderSelect: (boulderQuark: Quark<Boulder>) => void,
    onTrackSelect: (trackQuark: Quark<Track>, boulderQuark: Quark<Boulder>) => void,
}

export const SectorListBuilder: React.FC<SectorListBuilderProps> = watchDependencies((props: SectorListBuilderProps) => {
    const session = api.user();

    const selectedBoulder = props.selectedBoulder();
    const topo = props.topoQuark();
    const sectors = topo.sectors;
    const [bouldersIn, bouldersOut] = splitArray(topo.boulders.quarks().toArray(), b => sectors.toArray().map(s => s.boulders).flat().includes(b().id))
    const bouldersOutSorted = topo.lonelyBoulders.map(id => bouldersOut.find(b => b().id === id)!);

    const [displayedSectors, setDisplayedSectors] = useState<Array<UUID>>(sectors.map(sector => sector.id).toArray());
    const [displayedBoulders, setDisplayedBoulders] = useState<Array<UUID>>([]);
    
    const [draggingSectorId, setDraggingSectorId] = useState();
    const handleDragStart = useCallback((res) => {
        setDraggingSectorId(res.source.droppableId);
    }, []);

    const handleDragEnd = useCallback((res: DropResult) => {
        setDraggingSectorId(undefined);
        if (res.destination) {
            if (res.source.droppableId === 'no-sector') {
                let newLonelyBoulders = [...topo.lonelyBoulders];
                newLonelyBoulders = arrayMove(newLonelyBoulders, res.source.index, res.destination.index);
                props.topoQuark.set(t => ({
                    ...t,
                    lonelyBoulders: newLonelyBoulders
                }))
            }
            else {
                const sector = sectors.findQuark(s => s.id === res.source.droppableId);
                if (sector) {
                    let newSectorBoulders = [...sector().boulders];
                    newSectorBoulders = arrayMove(newSectorBoulders, res.source.index, res.destination.index);
                    sector.set(s => ({
                        ...s,
                        boulders: newSectorBoulders
                    }))
                }
            }
        }
    }, [topo, sectors]);

    if (!session) return null;
    return (
        <div className='h-[95%] overflow-y-auto mb-6 px-4'>
            {sectors.quarks().map((sectorQuark, sectorIndex) => {
                const sector = sectorQuark();
                const boulderQuarks = sector.boulders.map(id => bouldersIn.find(b => b().id === id)!);
                return (
                    <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} key={sector.id}>  
                        <Droppable droppableId={sector.id} key={sector.id}>
                            {(provided) => (
                                <div className='flex flex-col mb-6' {...provided.droppableProps} ref={provided.innerRef}>
                                    <div className="ktext-label text-grey-medium">Secteur {sectorIndex + 1}</div>
                                    <div className="ktext-section-title text-main cursor-pointer mb-1 flex flex-row items-center">
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
                                        <div className={'flex flex-col gap-1 ml-1 p-2 rounded-sm ' + (draggingSectorId === sector.id ? 'bg-grey-superlight' : '')}>
                                            {boulderQuarks.length < 1 &&
                                                <div className=''>
                                                    Aucun rocher référencé
                                                </div>
                                            }
                                            {boulderQuarks.map((boulderQuark, index) => {
                                                const boulder = boulderQuark();
                                                return (
                                                    <Draggable key={boulder.id} draggableId={boulder.id} index={index}>
                                                        {(provided) => (
                                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                                                        )}
                                                    </Draggable>
                                                )
                                            })}
                                            {provided.placeholder}
                                        </div>
                                    }   
                                </div>    
                            )}
                        </Droppable>
                    </DragDropContext>
                )
            })}
  
            <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                <Droppable droppableId='no-sector'>
                    {(provided) => {
                        return (
                            <div className='flex flex-col' {...provided.droppableProps} ref={provided.innerRef}>
                                <div className="ktext-label text-grey-medium mb-1">Sans secteur</div>
                                <div className={'flex flex-col gap-1 ml-1 p-2 rounded-sm ' + (draggingSectorId === 'no-sector' ? 'bg-grey-superlight' : '')}>
                                    {bouldersOutSorted.map((boulderQuark, index) => {
                                        // console.log(index);
                                        const boulder = boulderQuark();
                                        return (
                                            <Draggable key={boulder.id} draggableId={boulder.id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
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
                                                )}
                                            </Draggable>
                                        )
                                    })}
                                    {provided.placeholder}
                                </div>   
                            </div>
                        )
                    }}
                </Droppable>
            </DragDropContext>
        </div>
    )
});