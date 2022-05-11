import React, { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track, UUID } from 'types';
import { MultipleImageInput, TracksImage } from '.';
import { staticUrl, useModal } from 'helpers';

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
    const [ModalDeleteImage, showModalDeleteImage] = useModal<[Quark<Track>[], UUID]>();

    const deleteImage = useCallback((id: UUID) => {
        const newImages = props.boulder().images.filter((img) => img.id !== id);
        props.boulder.set(b => ({
            ...b,
            images: newImages,
        }));
        if (props.currentImage?.id === id) props.setCurrentImage(undefined);
    }, [props.boulder(), props.currentImage]);
    const deleteTracks = useCallback((tracksQuark: Quark<Track>[]) => {
        tracksQuark.forEach(tQ => {
            if (props.selectedTrack()?.id === tQ().id) props.selectedTrack.select(undefined);
            boulder.tracks.removeQuark(tQ);
    });
    }, [boulder]);

    return (
        <>
            <div className="px-5 mb-3">
                <div className='bg-dark'>
                    <TracksImage
                        sizeHint='300px'
                        image={props.currentImage}
                        tracks={boulder.tracks.quarks()}
                        selectedTrack={props.selectedTrack}
                        modalable={!!props.currentImage}
                        onImageClick={useCallback(() => {
                            console.log("ok")
                            if (!props.currentImage && multipleImageInputRef.current) {
                                multipleImageInputRef.current.click();
                            }
                        }, [props.currentImage])}
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
                        onImageDelete={useCallback((id) => {
                            const tracksOnTheImage = boulder.tracks.quarks().filter(t => !!t().lines?.find(l => l.imageId === id)).toArray();
                            if (tracksOnTheImage.length > 0) showModalDeleteImage([tracksOnTheImage, id]);
                            else deleteImage(id);                        
                        }, [boulder.tracks])}
                    />
                </div>
            </div>
            
            <ModalDeleteImage
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={(data) => {
                    deleteTracks(data[0]);
                    deleteImage(data[1]);
                }}
            >
                Tous les passages dessinés sur cette image seront supprimés. Etes-vous sûr de vouloir continuer ?
            </ModalDeleteImage>
        </>
    )
});

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";