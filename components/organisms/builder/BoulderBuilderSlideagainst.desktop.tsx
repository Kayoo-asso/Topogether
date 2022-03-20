import React, { Dispatch, SetStateAction } from 'react';
import { BoulderPreviewDesktop, SlideagainstRightDesktop, BoulderForm } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, BoulderImage, Track, UUID } from 'types';
import { TracksListBuilder } from '.';

interface BoulderBuilderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    topoCreatorId?: UUID,
    currentImage: BoulderImage,
    setCurrentImage: Dispatch<SetStateAction<BoulderImage>>,
    onClose: () => void,
}

export const BoulderBuilderSlideagainstDesktop: React.FC<BoulderBuilderSlideagainstDesktopProps> = watchDependencies((props: BoulderBuilderSlideagainstDesktopProps) => {
    const boulder = props.boulder();
    
    return (
        <SlideagainstRightDesktop 
            open
            item={props.boulder}
            displayLikeButton
            className='z-50'
            onClose={props.onClose}
        >
            <>
                <div className='px-5 mb-10 mt-3'>

                    <BoulderForm 
                        boulder={props.boulder}
                    />

                    <div className='mt-3'>
                        <BoulderPreviewDesktop
                            boulder={props.boulder}
                            selectedTrack={props.selectedTrack}
                            currentImage={props.currentImage}
                            displayAddButton
                            setCurrentImage={props.setCurrentImage}
                        />
                    </div>
                </div>             

                <div className='overflow-auto'>
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
            </>
        </SlideagainstRightDesktop>
    )
});

BoulderBuilderSlideagainstDesktop.displayName = "BoulderBuilderSlideagainstDesktop";