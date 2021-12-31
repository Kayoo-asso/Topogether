import React from 'react';
import NextImage from 'next/image';

interface ProfilePictureProps {
  src: string,
  onClick?: () => void,
}

export const ProfilePicture: React.FC<ProfilePictureProps> = (props: ProfilePictureProps) => (
  <div
    className={`shadow relative rounded-full border border-main p-7 z-20 h-[60px] w-[60px]${props.onClick ? ' cursor-pointer' : ''}`}
    onClick={() => {
		  props.onClick && props.onClick();
    }}
  >
    <NextImage
      src={props.src}
      className="rounded-full"
      priority
      alt="Photo de profile"
      layout="fill"
      objectFit="cover"
    />
  </div>
);
