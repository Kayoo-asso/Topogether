import React, { useContext, useState } from 'react';
import { DownloadButton, Flash, GradeHistogram, LikeButton, SlideoverLeftDesktop, SlideoverMobile } from 'components';
import { Signal } from 'helpers/quarky';
import { Amenities, Topo } from 'types';
import { BreakpointContext, hasFlag, listRockTypes, TopoTypeToColor } from 'helpers';
import WaypointIcon from 'assets/icons/waypoint.svg';
import Rock from 'assets/icons/rock.svg'
import ManyTracks from 'assets/icons/many-tracks.svg';
import Toilets from 'assets/icons/toilets.svg';
import Picnic from 'assets/icons/picnic.svg';
import WaterDrop from 'assets/icons/water-drop.svg';
import Bin from 'assets/icons/bin.svg';
import Umbrella from 'assets/icons/umbrella.svg';

interface InfoSlideoverProps {
    topo: Signal<Topo>,
    open?: boolean,
    className?: string,
    onClose?: () => void,
}

export const InfoSlideover: React.FC<InfoSlideoverProps> = ({
    open = true,
    ...props
}: InfoSlideoverProps) => {
    const device = useContext(BreakpointContext);
    const [flashMessage, setFlashMessage] = useState<string>();
    const topo = props.topo();

    let nbOfBoulders = 0;
    let nbOfTracks = 0;

    for (const sector of topo.sectors) {
        nbOfBoulders += sector.boulders.length
        for (const boulder of topo.boulders) {
            nbOfTracks += boulder.tracks.length
        }
    }

    const infosContent = () => (
        <div className='flex flex-col h-full pt-10 md:pt-0'>

            <div className="absolute z-100 left-1 md:left-2 top-1 md:top-2 flex flex-row gap-6 px-6 pt-4">
                <LikeButton
                    liked={topo.liked}
                />
                <DownloadButton
                    topo={topo}
                />
            </div>

            <div className='flex flex-col items-center md:items-start px-6 md:px-0 pt-5 md:pt-0'>
                {topo.creator?.userName &&
                    <div className='ktext-label text-center md:hidden'>
                        Topo créé par <span className="text-main cursor-pointer">{topo.creator.userName}</span>
                    </div>
                }

                {topo.forbidden && 
                    <div className='text-error ktext-section-title w-full text-center'>Site interdit !</div>
                }
                
                <div className='ktext-big-title text-center mt-4 flex flex-row items-center'>
                    <div className='hidden md:inline mr-2'>
                        <WaypointIcon 
                            className={'w-6 h-6 ' + TopoTypeToColor(topo.type)}
                        />
                    </div>
                    {topo.name}
                </div>

                <div className='ktext-label flex flex-col w-full text-center mt-1'>
                    <div className='text-grey-medium'>{topo.closestCity !== topo.name ? topo.closestCity : ''}</div>
                    <div className='flex flex-row justify-center md:justify-between w-full'>
                        <div
                            className='cursor-pointer text-grey-medium'
                            onClick={() => {
                                const data = [new ClipboardItem({ "text/plain": new Blob([topo.location[1] + ',' + topo.location[0]], { type: "text/plain" }) })];
                                navigator.clipboard.write(data).then(function() {
                                    setFlashMessage("Coordonnées copiées dans le presse papier.");
                                }, function() {
                                    setFlashMessage("Impossible de copier les coordonées.");
                                });
                            }}
                        >
                            {parseFloat(topo.location[1].toFixed(12)) + ',' + parseFloat(topo.location[0].toFixed(12))}
                        </div>
                        {topo.creator?.userName &&
                            <div className='hidden md:block'>
                                Topo créé par <span className="text-main cursor-pointer">{topo.creator.userName}</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
            
            <div className='flex flex-col gap-6 overflow-auto px-6 md:px-0 mt-4 pb-8'>
                <div className='flex flex-row justify-between items-end min-h-[150px] md:justify-evenly'>
                    <div className='flex flex-col items-center'>
                        {nbOfBoulders}
                        <Rock 
                            className='h-8 w-8 stroke-dark'
                        /> 
                    </div>
                    <div className='flex flex-col items-center pr-8'>
                        {nbOfTracks}
                        <ManyTracks 
                            className='h-8 w-8 stroke-dark'
                        />
                    </div>
                    <div className='h-full'>
                        <GradeHistogram
                            topo={topo} 
                        />
                    </div>
                </div>

                <div className='ktext-base-little'>
                    {topo.description} {topo.description}
                </div>
                
                <div className='flex flex-col gap-1'>
                    {topo.rockTypes && <div><span className='font-semibold'>Roche : </span>{listRockTypes(topo.rockTypes).join(', ')}</div>}
                    {topo.altitude && <div><span className='font-semibold'>Altitude au pieds des voies : </span>{topo.altitude}m</div>}
                    {hasFlag(topo.amenities, Amenities.AdaptedToChildren) && <div className='font-semibold'>Adapté aux enfants</div>}
                    {topo.danger &&
                        <div>
                            <div className='font-semibold'>Site dangereux !</div>
                            {topo.danger}
                        </div>
                    }
                    <div>
                        <div className='font-semibold'>Equipements présents : </div>
                        <div className='flex flex-row gap-6 mt-2'>
                            {hasFlag(topo.amenities, Amenities.Toilets) && <Toilets className='h-5 w-5 fill-main' />}
                            {hasFlag(topo.amenities, Amenities.PicnicArea) && <Picnic className='h-6 w-6 stroke-main' />}
                            {hasFlag(topo.amenities, Amenities.Waterspot) && <WaterDrop className='h-5 w-5 stroke-main' />}
                            {hasFlag(topo.amenities, Amenities.Bins) && <Bin className='h-5 w-5  stroke-main fill-main' />}
                            {hasFlag(topo.amenities, Amenities.Shelter) && <Umbrella name='umbrella' className='h-5 w-5 fill-main' />}  
                        </div>
                    </div>
                    {topo.otherAmenities && <div>{topo.otherAmenities}</div>}
                </div>
            </div>

        </div>
    )

    return (
        <>
            {device === 'mobile' &&
                <SlideoverMobile
                    onClose={props.onClose}
                >
                    {infosContent()}
                </SlideoverMobile>
            }
            {device !== 'mobile' && 
                <SlideoverLeftDesktop 
                    open={open}
                    onClose={props.onClose}
                    className={props.className}
                >
                    {infosContent()}
                </SlideoverLeftDesktop>
            }

            <Flash 
                open={!!flashMessage}
                onClose={() => setFlashMessage(undefined)}
                >
                {flashMessage}
            </Flash>
        </> 
    )
}