import React, { Dispatch, SetStateAction } from 'react';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track } from 'types';
import { MultipleImageInput, TracksImage } from '.';

interface BoulderPreviewDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    displayAddButton?: boolean,
    currentImage: Image,
    setCurrentImage: Dispatch<SetStateAction<Image>>, 
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
                    test={true}
                />
            </div>
            
            <div className='flex flex-row w-full mt-3'>
                <MultipleImageInput 
                    images={boulder.images}
                    selected={props.currentImage?.id}
                    rows={1}
                    onImageClick={(id) => props.setCurrentImage(boulder.images.find(img => img.id === id)!)}
                    allowUpload={displayAddButton}
                    onImageDelete={(id) => console.log('delete '+id)} // TODO
                    onChange={(files) => {
                        // TODO
                    }}
                />
            </div>
        </div>
    )
});

BoulderPreviewDesktop.displayName = "BoulderPreviewDesktop";