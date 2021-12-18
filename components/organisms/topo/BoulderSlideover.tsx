import React, { useState } from 'react';
import { GradeScale, Icon, LikeButton, MobileSlideover } from 'components';
import Image from 'next/image';
import { Boulder } from 'types';
import { topogetherUrl } from 'const';
import { TracksList } from '.';
import { getGradesFromBoulder } from 'helpers';

interface boulderSlideoverProps {
    boulder: Boulder,
    topoCreatorId: number,
    forBuilder?: boolean,
}

export const BoulderSlideover: React.FC<boulderSlideoverProps> = ({
    forBuilder = false,
    ...props
}: boulderSlideoverProps) => {
    const [full, setFull] = useState(true);
    const [boulderLiked, setBoulderLiked] = useState(false); // To change
    const [displayOfficialTrack, setDisplayOfficialTrack] = useState(true);

    const officialTracks = props.boulder.tracks ? props.boulder.tracks.filter(track => track.creatorId === props.topoCreatorId) : [];
    const communityTracks = props.boulder.tracks ? props.boulder.tracks.filter(track => track.creatorId !== props.topoCreatorId) : [];


    return (
        <MobileSlideover
            open
            initialFull
            onSizeChange={(full) => setFull(full)}
        >
            {full &&
                <div className='w-full relative h-[275px] bg-dark rounded-t-lg'>
                    <Image 
                        src={props.boulder.images ? topogetherUrl + props.boulder.images[0].url : '/assets/img/Kayoo_defaut_image.png'}
                        className='rounded-t-lg'
                        alt="Boulder"
                        priority
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
            }

            <div className={`grid grid-cols-8 p-5 ${full ? '' : ' mt-3'}`}>
                <div className='col-span-6'>
                    <div className='ktext-section-title'>{props.boulder.name}</div>
                    {props.boulder.isHighBall && full && <div className='ktext-base'>High Ball</div>}
                    {props.boulder.hasDangerousDescent && full && <div className='ktext-base'>Descente dangereuse !</div>}
                    {!full &&
                        <div className='flex items-center mt-2'>
                            <GradeScale 
                                grades={getGradesFromBoulder(props.boulder)}
                                circleSize='little'
                            />
                        </div>
                    }
                </div>
                <div className='flex justify-end col-span-2'>
                    {!forBuilder && full &&                     
                        <LikeButton 
                            liked={boulderLiked}
                            onClick={() => {
                                setBoulderLiked(!boulderLiked);
                            }}
                        />
                    }
                    {!full &&
                        <div className='w-full relative h-[60px]'>
                            <Image 
                                src={props.boulder.images ? topogetherUrl + props.boulder.images[0].url : '/assets/img/Kayoo_defaut_image.png'}
                                className='rounded-sm'
                                alt="Boulder"
                                priority
                                layout="fill"
                                objectFit="contain"
                            />
                        </div>
                    }
                </div>
            </div>
            
            {!forBuilder && 
                <div className='grid grid-cols-8 pl-5 ktext-label font-bold my-2'>
                    <span className={`col-span-2 ${displayOfficialTrack ? 'text-main' : 'text-grey-medium'}`} onClick={() => setDisplayOfficialTrack(true)}>officielles</span>
                    <span className={`col-span-2 ${!displayOfficialTrack ? 'text-main' : 'text-grey-medium'}`} onClick={() => setDisplayOfficialTrack(false)}>communautés</span>
                    <span className='col-start-8'>
                        <Icon 
                            name='add'
                            SVGClassName='w-5 h-5 stroke-main'
                            onClick={() => console.log('create community track')}
                        />
                    </span>
                </div>
            }
            <div className='overflow-auto'>
                <TracksList 
                    tracks={displayOfficialTrack ? officialTracks : communityTracks}
                    builderAddButton={forBuilder}
                    onTrackClick={(id) => console.log('got to track ')}
                    onBuilderAddClick={() => console.log('create track')}
                />
            </div>
        </MobileSlideover>
    )
}