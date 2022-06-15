import React from 'react';
import { Image, Track, UUID } from 'types';
// eslint-disable-next-line import/no-cycle
import { DeleteButton, TracksImage } from 'components';
import useDimensions from 'react-cool-dimensions';
import { Quark, QuarkIter, watchDependencies } from 'helpers/quarky';

interface ImageThumbProps {
  image: Image,
  tracks?: QuarkIter<Quark<Track>>
  selected?: boolean,
  onDelete?: (id: UUID) => void,
  onClick?: (id: UUID) => void,
}

export const ImageThumb: React.FC<ImageThumbProps> = watchDependencies(({
  selected = false,
  ...props
}: ImageThumbProps) => {
  const { observe, unobserve, width: containerWidth, height: containerHeight, entry } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
      // Triggered whenever the size of the target is changed...
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      ref={observe}
      className={`${selected ? 'border-main' : 'border-dark'}${props.onClick ? ' cursor-pointer' : ''} \
      group border-2 w-full flex flex-col justify-center relative`}
      onClick={() => props.onClick && props.onClick(props.image.id)}
      style={{
        height: containerWidth
      }}
    >
      {props.onDelete &&
        <div 
          className="absolute z-10 -top-[15px] -right-[8px] hidden md:group-hover:block" 
          onClick={(e) => e.stopPropagation()}
        >
          <DeleteButton
            onClick={() => props.onDelete && props.onDelete(props.image.id)}
          />
        </div>
      }
      {props.tracks && 
        <TracksImage 
          image={props.image}
          tracks={props.tracks}
          displayTracks
          displayTrackOrderIndexes={true}
          objectFit='contain'
          tracksWeight={60}
          zoomable={false}
        />
      }
      {/* {(!props.tracks || props.tracks.toArray().length < 1) && 
        <CFImage
          image={props.image}
          alt="user generated image"
          className='flex'
          objectFit='contain'
          sizeHint={`${containerWidth}px`}
          zoomable={false}
        />
      } */}
    </div>
  );
});
