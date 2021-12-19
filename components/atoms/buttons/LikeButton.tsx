import React from 'react';
import { Icon } from '../Icon';

interface LikeButtonProps {
  liked?: boolean,
  className?: string,
  onClick: () => void,
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  liked = false,
  ...props
}: LikeButtonProps) => {
    return (
        <Icon
          name='heart'
          wrapperClassName={props.className}
          SVGClassName={liked ? 'fill-main h-6 w-6' : 'stroke-dark h-6 w-6'}
          onClick={props.onClick}
        />
    )
};