import React from 'react';
import { Image } from 'types';
import { CFImage } from './CFImage';
import defaultProfilePicture from 'public/assets/img/Default_profile_picture.png';

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
        className="rounded-full object-fit"
        alt="Photo de profile"
        sizeHint='15vw'
        defaultImage={defaultProfilePicture}
      />
    </div>
  )
};
