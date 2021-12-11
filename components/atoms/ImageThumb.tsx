import React from 'react';
import Image from 'next/image';
import { ImageAfterServer } from 'types';
// eslint-disable-next-line import/no-cycle
import { DeleteButton } from 'components';

interface ImageThumbProps {
  image: ImageAfterServer,
  deletable?: boolean,
}

export const ImageThumb: React.FC<ImageThumbProps> = (props) => (
  <div
    className="group border-dark border-2 w-22 h-22 flex flex-col justify-center relative"
  >
    {props.deletable
        && (
        <div className="absolute z-10 -top---3 -right---3 lg:hidden group-hover:block">
          <DeleteButton
            onClick={() => {
              console.log('delete image');
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
);

ImageThumb.defaultProps = {
  deletable: true,
};
