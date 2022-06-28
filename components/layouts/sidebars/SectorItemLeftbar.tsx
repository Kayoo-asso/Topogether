import React from 'react'
import { Quark } from "helpers/quarky";
import { Boulder, SectorData } from "types";
import ArrowSimple from 'assets/icons/arrow-simple.svg';
import Edit from 'assets/icons/edit.svg';

interface SectorItemLeftbarProps {
    sectorQuark: Quark<SectorData>,
    sectorIndex: number,
    bouldersIn: Quark<Boulder>[],
    dragging?: boolean,
    displayed: boolean,
    onArrowClick: () => void,
    onNameClick?: () => void,
    onRenameClick?: () => void,
}

export const sectorItemLeftbar: React.FC<SectorItemLeftbarProps> = ({
    dragging = false,
    ...props
}: SectorItemLeftbarProps) => {
    const sector = props.sectorQuark();
    const boulderQuarks = sector.boulders.map(id => props.bouldersIn.find(b => b().id === id)!);
    return (
        <div className='flex flex-col mb-10 pb-6'>
            <div className="ktext-label text-grey-medium">Secteur {props.sectorIndex + 1}</div>
            <div className="ktext-section-title text-main mb-1 flex flex-row items-center">
                <button className='pr-3 cursor-pointer' onClick={props.onArrowClick}>
                    <ArrowSimple
                        className={'w-3 h-3 stroke-main stroke-2 ' + (props.displayed ? '-rotate-90' : 'rotate-180')}
                    />
                </button>

                <div
                    className='flex-1'
                    onClick={props.onNameClick}
                >
                    <span className='cursor-pointer'>{sector.name}</span>
                </div>
                
                <div
                    className='pr-1 cursor-pointer'
                    onClick={props.onRenameClick}
                >
                    <Edit className={'w-5 h-5 stroke-main'} />
                </div>
            </div>
            
            {props.displayed &&
                // BOULDERS
                <div className={'flex flex-col gap-1 ml-1 p-2 rounded-sm ' + (dragging ? 'bg-grey-superlight' : '')}>
                    {boulderQuarks.length === 0 &&
                        <div className=''>
                            Aucun rocher référencé
                        </div>
                    }
                    {boulderQuarks.map((boulderQuark, index) => {
                        const boulder = boulderQuark();
                        // return (
                        //     <Draggable key={boulder.id} draggableId={boulder.id} index={index}>
                        //         {(provided) => (
                        //             <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        //                 <BoulderItemLeftbar 
                        //                     boulder={boulderQuark}
                        //                     orderIndex={props.boulderOrder.get(boulder.id)!}
                        //                     selected={selectedBoulder?.id === boulder.id}
                        //                     displayed={displayedBoulders.includes(boulder.id)}
                        //                     onArrowClick={() => {
                        //                         const newDB = [...displayedBoulders];
                        //                         if (newDB.includes(boulder.id)) newDB.splice(newDB.indexOf(boulder.id), 1)
                        //                         else newDB.push(boulder.id);
                        //                         setDisplayedBoulders(newDB);
                        //                     }}
                        //                     onNameClick={() => {
                        //                         props.onBoulderSelect(boulderQuark);
                        //                         const newDB = [...displayedBoulders];
                        //                         if (!newDB.includes(boulder.id)) {
                        //                             newDB.push(boulder.id);
                        //                             setDisplayedBoulders(newDB);
                        //                         }
                        //                     }}
                        //                     onDeleteClick={() => props.onDeleteBoulder(boulderQuark)}
                        //                     onTrackClick={(trackQuark) => props.onTrackSelect(trackQuark, boulderQuark)}
                        //                     displayCreateTrack
                        //                     onCreateTrack={() => createTrack(boulder, session.id)}
                        //                 />
                        //             </div>
                        //         )}
                        //     </Draggable>
                        // )
                    })}
                </div>
            }   
        </div>
    )
}