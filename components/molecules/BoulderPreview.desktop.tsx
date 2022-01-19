import React, { Dispatch, SetStateAction, useState } from 'react';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track, UUID } from 'types';
import { MultipleImageInput, TracksImage } from '.';

interface BoulderPreviewDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    currentImage: Image | undefined,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
    displayAddButton?: boolean,
}

export const BoulderPreviewDesktop: React.FC<BoulderPreviewDesktopProps> = watchDependencies(({
    displayAddButton = false,
    ...props
}: BoulderPreviewDesktopProps) => {
    const boulder = props.boulder();

    return (
        <div className='flex flex-col w-full items-center'>
            <div className='bg-dark w-full flex flex-col items-center'>
                <TracksImage 
                    image={props.currentImage || boulder.images[0]}
                    tracks={boulder.tracks}
                    selectedTrack={props.selectedTrack}
                    containerClassName='max-h-[200px]'
                />
            </div>
            
            <div className='flex flex-row w-full mt-3'>
                <MultipleImageInput 
                    images={boulder.images}
                    selected={props.currentImage?.id}
                    rows={1}
                    onImageClick={(id) => props.setCurrentImage(boulder.images.find(img => img.id === id))}
                    allowUpload={displayAddButton}
                    onUpload={(files) => {
                        // TODO
                    }}
                />
            </div>
        </div>
    )
});