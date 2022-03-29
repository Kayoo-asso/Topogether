import React, { Dispatch, SetStateAction } from 'react';
import { BoulderPreviewDesktop, SlideagainstRightDesktop, BoulderForm } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track, UUID } from 'types';
import { TracksListBuilder } from '.';

interface BoulderBuilderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    topoCreatorId?: UUID,
    currentImage?: Image,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
    onClose: () => void,
}

export const BoulderBuilderSlideagainstDesktop: React.FC<BoulderBuilderSlideagainstDesktopProps> = watchDependencies((props: BoulderBuilderSlideagainstDesktopProps) => {
    const boulder = props.boulder();

    return (
        <SlideagainstRightDesktop
            open
            item={props.boulder()}
            displayLikeButton
            className='z-50'
            onClose={props.onClose}
        >
            <div className="flex flex-col h-full w-full">
                <BoulderForm
                    className='mt-3 mb-6'
                    boulder={props.boulder}
                />
                <BoulderPreviewDesktop
                    boulder={props.boulder}
                    selectedTrack={props.selectedTrack}
                    currentImage={props.currentImage}
                    displayAddButton
                    setCurrentImage={props.setCurrentImage}
                />
                {/* <div className='px-5 mb-10 mt-3'>


                    <div className='mt-3'>
                    </div>
                </div> */}

                <TracksListBuilder
                    boulder={props.boulder}
                    selectedTrack={props.selectedTrack}
                    onTrackClick={(trackQuark) => {
                        if (props.selectedTrack()?.id === trackQuark().id) props.selectedTrack.select(undefined);
                        else {
                            const newImage = boulder.images.find(img => img.id === trackQuark().lines?.at(0)?.imageId);
                            if (newImage) {
                                props.setCurrentImage(newImage);
                            }
                            props.selectedTrack.select(trackQuark);
                        }
                    }}
                />
            </div>
        </SlideagainstRightDesktop>
    )
});

BoulderBuilderSlideagainstDesktop.displayName = "BoulderBuilderSlideagainstDesktop";