import React, { useState } from 'react';
import { Quark, SelectQuarkNullable } from 'helpers/quarky';
import { Boulder, Track, UUID } from 'types';
import { MultipleImageInput, TracksImage } from '.';

interface BoulderPreviewDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    displayAddButton?: boolean,
}

export const BoulderPreviewDesktop: React.FC<BoulderPreviewDesktopProps> = ({
    displayAddButton = false,
    ...props
}: BoulderPreviewDesktopProps) => {
    const boulder = props.boulder();
    const [selectedImageId, setSelectedImageId] = useState<UUID>(boulder.images[0].id);

    return (
        <div className='flex flex-col w-full items-center'>
            <div className='bg-dark w-full flex flex-col items-center'>
                <TracksImage 
                    image={boulder.images.find(i => i.id === selectedImageId) || boulder.images[0]}
                    tracks={boulder.tracks}
                    selectedTrack={props.selectedTrack}
                    containerClassName='max-h-[200px]'
                />
            </div>
            
            <div className='flex flex-row w-full mt-3'>
                <MultipleImageInput 
                    images={boulder.images}
                    selected={selectedImageId}
                    rows={1}
                    onImageClick={setSelectedImageId}
                    allowUpload={displayAddButton}
                    onUpload={(files) => {
                        // TODO
                    }}
                />
            </div>
        </div>
    )
}