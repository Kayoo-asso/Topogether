import React from 'react';
import { Image } from 'types';
import { CFImage } from './CFImage';

interface ProfilePictureProps {
  image?: Image,
  onClick?: () => void,
}

export const ProfilePicture: React.FC<ProfilePictureProps> = (props: ProfilePictureProps) => {
  return (
    <div
      className={`shadow relative rounded-full border border-main z-20 h-full w-full${props.onClick ? ' cursor-pointer' : ''}`}
      onClick={() => {
        props.onClick && props.onClick();
      }}
    >
      <CFImage
        image={props.image}
        className="rounded-full"
        priority
        alt="Photo de profile"
        layout="fill"
        objectFit="cover"
      />
    </div>
  )
};
