import React, { Dispatch, SetStateAction } from 'react';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, BoulderImage, Track } from 'types';
import { MultipleImageInput, TracksImage } from '.';

interface BoulderPreviewDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    displayAddButton?: boolean,
    currentImage: BoulderImage,
    setCurrentImage: Dispatch<SetStateAction<BoulderImage>>, 
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
                    image={props.currentImage}
                    tracks={boulder.tracks}
                    selectedTrack={props.selectedTrack}
                    containerClassName='h-[180px]'
                />
            </div>
            
            <div className='flex flex-row w-full mt-3'>
                <MultipleImageInput 
                    images={boulder.images}
                    boulder={boulder}
                    selected={props.currentImage?.id}
                    rows={1}
                    onImageClick={(id) => props.setCurrentImage(boulder.images.find(img => img.id === id)!)}
                    allowUpload={displayAddButton}
                    onImageDelete={(id) => console.log('delete '+id)} // TODO
                    onChange={(images) => {
                        // TODO
                    }}
                />
            </div>
        </div>
    )
});

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";