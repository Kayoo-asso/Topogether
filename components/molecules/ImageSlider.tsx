import { Quark, QuarkIter, SelectQuarkNullable } from 'helpers/quarky';
import React from 'react';
import { Image, Track } from 'types';
import { TracksImage } from './TracksImage';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

interface ImageSliderProps {
    images?: Image[],
    tracks: QuarkIter<Quark<Track>>,
    selectedTrack?: SelectQuarkNullable<Track>;
    displayPhantomTracks?: boolean,
    onChange?: (idx: number, item: React.ReactNode) => void,
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
    displayPhantomTracks = false,
    ...props
}: ImageSliderProps) => {

    return (
        <>
            {/* Force to hardcode some css (in carouselStyle.css) */}
            <Carousel
                infiniteLoop
                showStatus={false}
                showThumbs={false}
                showIndicators={!!(props.images && props.images.length > 1)}
                onChange={props.onChange}
            >
                {props.images?.map(img => {
                    return (
                        <TracksImage
                            key={img.id}
                            sizeHint='100vw'
                            image={img}
                            tracks={props.tracks}
                            selectedTrack={props.selectedTrack}
                            displayPhantomTracks
                            displayTracksDetails={props.selectedTrack && !!props.selectedTrack()?.id}
                            modalable
                        />
                    )
                })}
                
            </Carousel>
        </>
    )
}