import React, { Dispatch, SetStateAction } from 'react';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track } from 'types';
import { MultipleImageInput, TracksImage } from '.';

interface BoulderPreviewDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    displayAddButton?: boolean,
    currentImage?: Image,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
}

export const BoulderPreviewDesktop: React.FC<BoulderPreviewDesktopProps> = watchDependencies(({
    displayAddButton = false,
    ...props
}: BoulderPreviewDesktopProps) => {
    const boulder = props.boulder();
    return (
        <div className='flex flex-col w-full items-center'>
            <TracksImage
            // TODO: add proper max-h- constraint for images that are higher than large
                className='bg-dark w-full max-h-[30vh]'
                sizeHint='300px'
                image={props.currentImage}
                tracks={boulder.tracks.quarks()}
                selectedTrack={props.selectedTrack}
            />

            <div className='flex flex-row w-full mt-3'>
                <MultipleImageInput
                    images={boulder.images}
                    boulder={boulder}
                    selected={props.currentImage?.id}
                    rows={1}
                    onImageClick={(id) => props.setCurrentImage(boulder.images.find(img => img.id === id)!)}
                    allowUpload={displayAddButton}
                    onChange={(images) => {
                        props.boulder.set({
                            ...boulder,
                            images: images,
                        })
                    }}
                    onImageDelete={(id) => {
                        const newImages = props.boulder().images.filter((img) => img.id !== id);
                        props.boulder.set(prev => ({
                            ...prev,
                            images: [...prev.images, ...newImages],
                        }))
                    }}
                />
            </div>
        </div>
    )
});

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";