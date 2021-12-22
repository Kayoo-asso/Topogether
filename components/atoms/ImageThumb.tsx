import React from 'react';
import { default as NextImage } from 'next/image';
import { Image, UUID } from 'types';
// eslint-disable-next-line import/no-cycle
import { DeleteButton } from 'components';

interface ImageThumbProps {
  image: Image,
  selected?: boolean,
  onDelete?: (id: UUID) => void,
  onClick?: (id: UUID) => void,
}

export const ImageThumb: React.FC<ImageThumbProps> = ({
  selected = false,
  ...props
}: ImageThumbProps) => {
  // TypeScript is not able to know that props.onClick or props.onDelete
  // are not undefined within the new closures
  const onClick = props.onClick
    ? () => props.onClick!(props.image.id)
    : undefined;

  const onDelete = props.onDelete
    ? () => props.onDelete!(props.image.id)
    : undefined;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      className={`
      ${selected ? 'border-main' : 'border-dark'}
      ${onClick ? 'cursor-pointer' : ''}
      group border-2 w-22 h-22 flex flex-col justify-center relative`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {onDelete &&
        <div className="absolute z-10 -top---3 -right---3 lg:hidden group-hover:block">
          <DeleteButton
            onClick={() => {
              console.log('delete image');
              onDelete();
            }}
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
}

