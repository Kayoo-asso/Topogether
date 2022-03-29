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
        <>
            <div className='flex-1 bg-dark'>
                <TracksImage
                    sizeHint='300px'
                    image={props.currentImage}
                    tracks={boulder.tracks.quarks()}
                    selectedTrack={props.selectedTrack}
                />
            </div>

            <div className='flex flex-row w-full mt-3 min-h-max'>
                <MultipleImageInput
                    images={boulder.images}
                    boulder={boulder}
                    selected={props.currentImage?.id}
                    rows={1}
                    onImageClick={(id) => props.setCurrentImage(boulder.images.find(img => img.id === id)!)}
                    allowUpload={displayAddButton}
                    onChange={(images) => {
                        props.boulder.set(b => ({
                            ...b,
                            images: [...b.images, ...images],
                        }))
                    }}
                    onImageDelete={(id) => {
                        const newImages = props.boulder().images.filter((img) => img.id !== id);
                        props.boulder.set(b => ({
                            ...b,
                            images: newImages,
                        }))
                    }}
                />
            </div>
        </>
    )
});

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";