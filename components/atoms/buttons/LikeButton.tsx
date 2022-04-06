import { Quark, watchDependencies } from 'helpers/quarky';
import React, { useCallback } from 'react';
import Heart from '/assets/icons/heart.svg';

interface LikeButtonProps {
  liked: Quark<boolean>,
  className?: string,
}

export const LikeButton: React.FC<LikeButtonProps> = watchDependencies(({
  liked,
  ...props
}: LikeButtonProps) => {
  const toggle = useCallback(() => liked.set(l => !l), [liked]);
  const color = liked()
    ? 'fill-main'
    : 'stroke-dark'
  
  return <Heart
    className={`h-6 w-6 cursor-pointer ${color} ${props.className}`}
    onClick={toggle}
  />
});