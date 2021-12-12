import React from 'react';
import Image from 'next/image';
import { ImageAfterServer } from 'types';
// eslint-disable-next-line import/no-cycle
import { DeleteButton } from 'components';

interface ImageThumbProps {
  image: ImageAfterServer,
  selectable?: boolean,
  selected?: boolean,
  deletable?: boolean,
  onDeleteImage?: (imageId: number) => void,
  onClick?: () => void,
}

export const ImageThumb: React.FC<ImageThumbProps> = ({
  selectable = false,
  selected = false,
  deletable = true,
  ...props
}: ImageThumbProps) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div
    className={`${selected ? ' border-main' : ' border-dark'} 
      ${selectable ? 'cursor-pointer' : ''} 
      group border-2 w-22 h-22 flex flex-col justify-center relative`}
    onClick={props.onClick}
    role="button"
    tabIndex={0}
  >
    {deletable
        && (
        <div className="absolute z-10 -top---3 -right---3 lg:hidden group-hover:block">
          <DeleteButton
            onClick={() => {
              console.log('delete image');
              if (props.onDeleteImage) props.onDeleteImage(props.image.id);
            }}
          />
        </div>
        )}
    <Image
      src={props.image.url}
      alt="user generated image"
      layout="fill"
      objectFit="contain"
    />
  </div>
)