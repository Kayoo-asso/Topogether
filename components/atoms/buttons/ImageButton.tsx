import React from 'react';
import Image from 'next/image';
import { ImageAfterServer } from 'types';
// eslint-disable-next-line import/no-cycle
import { Icon } from 'components';

interface ImageButtonProps {
  text: string,
  image?: ImageAfterServer,
  loading?: boolean,
  onClick: () => void,
}

export const ImageButton: React.FC<ImageButtonProps> = (props) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div
    className="ktext-label relative text-center shadow text-main p-2 border-main border-2 w-22 h-22 flex flex-col justify-center cursor-pointer"
    onClick={props.onClick}
    role="button"
    tabIndex={0}
  >
    {props.loading
                    && (
                    <Icon
                      name="spinner"
                      className="stroke-main w-10 h-10 animate-spin"
                      center
                    />
                    )}
    {!props.loading && props.image
                    && (
                    <Image
                      src={props.image.url}
                      alt="user generated image"
                      layout="fill"
                      objectFit="contain"
                    />
                    )}
    {!props.loading && !props.image
                    && <span>{props.text}</span>}
  </div>
);

ImageButton.defaultProps = {
  loading: false,
};
