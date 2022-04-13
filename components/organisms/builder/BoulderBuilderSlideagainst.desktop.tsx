import React, { Dispatch, SetStateAction } from 'react';
import { BoulderPreviewDesktop, SlideagainstRightDesktop, BoulderForm } from 'components';
import { Quark, SelectQuarkNullable, watchDependencies } from 'helpers/quarky';
import { Boulder, Image, Topo, Track, UUID } from 'types';
import { TracksListBuilder } from '.';

interface BoulderBuilderSlideagainstDesktopProps {
    boulder: Quark<Boulder>,
    topo: Quark<Topo>,
    selectedTrack: SelectQuarkNullable<Track>,
    currentImage?: Image,
    setCurrentImage: Dispatch<SetStateAction<Image | undefined>>,
    onClose: () => void,
}

export const BoulderBuilderSlideagainstDesktop: React.FC<BoulderBuilderSlideagainstDesktopProps> = watchDependencies((props: BoulderBuilderSlideagainstDesktopProps) => {
    const boulder = props.boulder();

    return (
        <SlideagainstRightDesktop
            open
            className='overflow-scroll'
            displayLikeButton
            item={props.boulder()}
            onClose={props.onClose}
        >
            <div className="flex flex-col h-full w-full">
                <BoulderForm
                    className='mt-3 mb-6 px-5'
                    boulder={props.boulder}
                    topo={props.topo}
                />
                <BoulderPreviewDesktop
                    boulder={props.boulder}
                    selectedTrack={props.selectedTrack}
                    currentImage={props.currentImage}
                    displayAddButton
                    setCurrentImage={props.setCurrentImage}
                />

                <TracksListBuilder
                    boulder={props.boulder}
                    selectedTrack={props.selectedTrack}
                    onTrackClick={(trackQuark) => {
                        if (props.selectedTrack()?.id === trackQuark().id) props.selectedTrack.select(undefined);
                        else {
                            const track = trackQuark();
                            if (track.lines.length > 0) {
                                const newImage = boulder.images.find(img => img.id === trackQuark().lines.at(0).imageId);
                                if (!newImage) throw new Error("Could not find the first image for the selected track!");
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