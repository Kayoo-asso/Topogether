import { Quark, QuarkIter, SelectQuarkNullable } from 'helpers/quarky';
import React from 'react';
import { Image, Track } from 'types';
import { TracksImage } from './TracksImage';
import ArrowFull from 'assets/icons/arrow-full.svg';

interface ImageSliderProps {
    displayLeftArrow: boolean,
    displayRightArrow: boolean,
    image?: Image,
    tracks: QuarkIter<Quark<Track>>,
    selectedTrack?: SelectQuarkNullable<Track>;
    displayPhantomTracks?: boolean,
    onLeftArrowClick: () => void,
    onRightArrowClick: () => void,
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
    displayPhantomTracks = false,
    ...props
}: ImageSliderProps) => {

    return (
        <>
            {props.displayLeftArrow &&
                <button
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 z-100 cursor-pointer'
                    onClick={props.onLeftArrowClick}
                >
                    <ArrowFull className="w-3 h-3 stroke-main fill-main rotate-180" />
                </button>
            }

            <TracksImage
                sizeHint='100vw'
                image={props.image}
                tracks={props.tracks}
                selectedTrack={props.selectedTrack}
                displayPhantomTracks
                displayTracksDetails={props.selectedTrack && !!props.selectedTrack()?.id}
                modalable
            />

            {props.displayRightArrow &&
                <button
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 z-100 cursor-pointer'
                    onClick={props.onRightArrowClick}
                >
                    <ArrowFull className="w-3 h-3 stroke-main fill-main" />
                </button>
            }
        </>
    )
}