import { Quark, watchDependencies } from 'helpers/quarky';
import React, { useCallback } from 'react';
import { Icon } from '../Icon';

interface LikeButtonProps {
  liked: Quark<boolean>,
  className?: string,
}

export const LikeButton: React.FC<LikeButtonProps> = watchDependencies(({
  liked,
  ...props
}: LikeButtonProps) => {
  const toggle = useCallback(() => liked.set(l => !l), [liked]);
    return (
        <Icon
          name='heart'
          wrapperClassName={props.className}
          SVGClassName={`${liked() ? 'fill-main h-6 w-6' : 'stroke-dark h-6 w-6'}`}
          onClick={toggle}
        />
    )
});