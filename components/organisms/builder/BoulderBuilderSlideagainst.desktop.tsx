import React, { Dispatch, SetStateAction } from 'react';
import { BoulderPreviewDesktop, SlideagainstRightDesktop, BoulderForm } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Track, UUID } from 'types';
import { TracksListBuilder } from '.';

interface BoulderBuilderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    selectedTrack: SelectQuarkNullable<Track>,
    topoCreatorId?: UUID,
    currentImage: Image | undefined,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
    onClose: () => void,
}

export const BoulderBuilderSlideagainstDesktop: React.FC<BoulderBuilderSlideagainstDesktopProps> = watchDependencies((props: BoulderBuilderSlideagainstDesktopProps) => {
    return (
        <SlideagainstRightDesktop 
            open
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
                            setCurrentImage={props.setCurrentImage}
                        />
                    </div>
                </div>             

                <div className='overflow-auto'>
                    <TracksListBuilder 
                        boulder={props.boulder}
                        selectedTrack={props.selectedTrack}
                    />
                </div>
            </>
        </SlideagainstRightDesktop>
    )
});

BoulderBuilderSlideagainstDesktop.displayName = "BoulderBuilderSlideagainstDesktop";