import React, { useState } from 'react';
import { LikeButton, MobileSlideover } from 'components';
import Image from 'next/image';
import { Boulder } from 'types';
import { topogetherUrl } from 'const';
import { TracksList } from '.';

interface boulderSlideoverProps {
    boulder: Boulder
}

export const BoulderSlideover: React.FC<boulderSlideoverProps> = (props: boulderSlideoverProps) => {
    // To change
    const [boulderLiked, setBoulderLiked] = useState(false);
    
    return (
        <MobileSlideover
            open
            initialFull
        >
            <div 
                className='w-full relative h-[275px] bg-dark rounded-t-lg'
            >
                <Image 
                    src={props.boulder.images ? topogetherUrl + props.boulder.images[0].url : '/assets/img/Kayoo_defaut_image.png'}
                    className='rounded-t-lg'
                    alt="Boulder"
                    priority={true}
                    layout="fill"
                    objectFit="contain"
                />
            </div>

            <div className='grid grid-cols-8 p-5'>
                <div className='col-span-7'>
                    <div className='ktext-section-title'>{props.boulder.name}</div>
                    {props.boulder.isHighBall && <div className='ktext-base'>High Ball</div>}
                    {props.boulder.hasDangerousDescent && <div className='ktext-base'>Descente dangereuse !</div>}
                </div>
                <div className='flex justify-center'>
                    <LikeButton 
                        liked={boulderLiked}
                        onClick={() => {
                            setBoulderLiked(!boulderLiked);
                        }}
                    />
                </div>
            </div>
            
            <div className='pr-[20px] h-[100px] overflow-scroll'>
                <TracksList 
                    tracks={props.boulder.tracks || []}
                    displayAddButton
                />
            </div>
        </MobileSlideover>
    )
}