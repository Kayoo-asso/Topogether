import React, { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track, UUID } from 'types';
import { MultipleImageInput, TracksImage } from '.';
import { deleteTrack, setReactRef, staticUrl, useModal } from 'helpers';

interface BoulderPreviewDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    displayAddButton?: boolean,
    currentImage?: Image,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
}

export const BoulderPreviewDesktop = watchDependencies<HTMLInputElement, BoulderPreviewDesktopProps>(({
    displayAddButton = false,
    ...props
}: BoulderPreviewDesktopProps, parentRef) => {
    const boulder = props.boulder();
    const multipleImageInputRef = useRef<HTMLInputElement>(null);

    const [loading, setLoading] = useState(false);

    const [ModalDeleteImage, showModalDeleteImage] = useModal<[Quark<Track>[], UUID]>();
    const deleteImage = useCallback((id: UUID) => {
        const newImages = props.boulder().images.filter((img) => img.id !== id);
        props.boulder.set(b => ({
            ...b,
            images: newImages,
        }));
        if (props.currentImage?.id === id) props.setCurrentImage(undefined);
        if (newImages.length === 0) deleteTracks(boulder.tracks.quarks().toArray());
    }, [props.boulder(), props.currentImage]);
    const deleteTracks = useCallback((tracksQuark: Quark<Track>[]) => {
        tracksQuark.forEach(tQ => deleteTrack(boulder, tQ, props.selectedTrack));
    }, [boulder, props.selectedTrack]);

    const addImagesClick = useCallback(() => {
        if (!props.currentImage && multipleImageInputRef.current) {
            multipleImageInputRef.current.click();
        }
    }, [props.currentImage, loading]);

    return (
        <>
            <div className="px-5 mb-3">
                <div className='bg-dark max-w-[255px]'> {/* max-width is very important here to avoid a bug with scrolling and image resizing when creating a first track with sitting start */}
                    <TracksImage
                        sizeHint='300px'
                        image={props.currentImage}
                        tracks={boulder.tracks.quarks()}
                        selectedTrack={props.selectedTrack}
                        modalable={!!props.currentImage}
                        onImageClick={!loading ? addImagesClick : undefined}
                    />
                </div>

                <div className='flex flex-col w-full mt-3 min-h-max'>
                    <MultipleImageInput
                        ref={ref => {
                            setReactRef(multipleImageInputRef, ref);
                            setReactRef(parentRef, ref);
                        }}
                        images={boulder.images}
                        boulder={boulder}
                        selected={props.currentImage?.id}
                        rows={1}
                        onImageClick={useCallback((id) => {
                            props.setCurrentImage(boulder.images.find(img => img.id === id)!)
                        }, [boulder])}
                        allowUpload={displayAddButton}
                        onChange={useCallback((images) => {
                            props.boulder.set(b => ({
                                ...b,
                                images: [...b.images, ...images],
                            }));
                            props.setCurrentImage(images[0]);
                        }, [boulder])}
                        onImageDelete={useCallback((id) => {
                            const tracksOnTheImage = boulder.tracks.quarks().filter(t => !!t().lines?.find(l => l.imageId === id)).toArray();
                            if (tracksOnTheImage.length > 0) showModalDeleteImage([tracksOnTheImage, id]);
                            else deleteImage(id);                    
                        }, [boulder.tracks])}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                    />
                </div>
            </div>
            
            <ModalDeleteImage
                buttonText="Confirmer"
                imgUrl={staticUrl.deleteWarning}
                onConfirm={([trackQuarks, uuid]) => {
                    deleteTracks(trackQuarks);
                    deleteImage(uuid);
                }}
            >
                Tous les passages dessinés sur cette image seront supprimés. Etes-vous sûr de vouloir continuer ?
            </ModalDeleteImage>
        </>
    )
});

BoulderPreviewDesktop.displayName = "Boulder Preview Desktop";