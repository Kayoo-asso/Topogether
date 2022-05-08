import React, { Dispatch, SetStateAction, useCallback, useRef } from 'react';
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
    const multipleImageInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="px-5 mb-3">
            <div className='bg-dark'>
                <TracksImage
                    sizeHint='300px'
                    image={props.currentImage}
                    tracks={boulder.tracks.quarks()}
                    selectedTrack={props.selectedTrack}
                    modalable={!!props.currentImage}
                    onImageClick={useCallback(() => {
                        if (!props.currentImage && multipleImageInputRef.current) {
                            multipleImageInputRef.current.click();
                        }
                    }, [multipleImageInputRef.current])}
                />
            </div>

            <div className='flex flex-col w-full mt-3 min-h-max'>
                <MultipleImageInput
                    ref={multipleImageInputRef}
                    images={boulder.images}
                    boulder={boulder}
                    selected={props.currentImage?.id}
                    rows={1}
                    onImageClick={(id) => {
                        props.setCurrentImage(boulder.images.find(img => img.id === id)!)
                    }}
                    allowUpload={displayAddButton}
                    onChange={(images) => {
                        props.boulder.set(b => ({
                            ...b,
                            images: [...b.images, ...images],
                        }));
                        props.setCurrentImage(images[images.length - 1]);
                    }}
                    onImageDelete={(id) => {
                        const newImages = props.boulder().images.filter((img) => img.id !== id);
                        props.boulder.set(b => ({
                            ...b,
                            images: newImages,
                        }));
                        if (props.currentImage?.id === id) props.setCurrentImage(undefined);
                    }}
                />
            </div>
        </div>
    )
});

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";