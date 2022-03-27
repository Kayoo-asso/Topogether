import React from 'react';
import { Image } from 'types';
import NextImage from 'next/image';
import { CFImage } from './CFImage';
import { staticUrl } from 'helpers';

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
      {props.image &&
        <CFImage
          image={props.image}
          className="rounded-full"
          priority
          alt="Photo de profile"
          layout="fill"
          objectFit="cover"
        />
      }
      {!props.image &&
        <NextImage 
          src={staticUrl.defaultProfilePicture}
          className="rounded-full"
          priority
          alt="Photo de profile"
          layout="fill"
          objectFit="cover"
        />
      } 
    </div>
  )
};
