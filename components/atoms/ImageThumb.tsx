import React from 'react';
import NextImage from 'next/image';
import { BoulderImage, UUID } from 'types';
// eslint-disable-next-line import/no-cycle
import { DeleteButton } from 'components';
import useDimensions from 'react-cool-dimensions';

interface ImageThumbProps {
  image: BoulderImage,
  selected?: boolean,
  onDelete?: (id: UUID) => void,
  onClick?: (id: UUID) => void,
}

export const ImageThumb: React.FC<ImageThumbProps> = ({
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
      <NextImage
        src={props.image.url}
        alt="user generated image"
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
};
