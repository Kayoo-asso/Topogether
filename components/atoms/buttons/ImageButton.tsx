import React from 'react';
// eslint-disable-next-line import/no-cycle
import useDimensions from 'react-cool-dimensions';
import { DeleteButton } from '.';
import { CFImage } from '../CFImage';
import { Image } from 'types';
import Spinner from 'assets/icons/spinner.svg';

interface ImageButtonProps {
  text?: string,
  image?: Image,
  loading?: boolean,
  onClick: () => void,
  onDelete?: () => void,
}

export const ImageButton: React.FC<ImageButtonProps> = ({
  text = '+ Ajouter une image',
  loading = false,
  ...props
}) => {
  const { observe, unobserve, width: containerWidth, height: containerHeight, entry } = useDimensions({
    onResize: ({ observe, unobserve, width, height, entry }) => {
      // Triggered whenever the size of the target is changed...
      unobserve(); // To stop observing the current target element
      observe(); // To re-start observing the current target element
    },
  });

  return (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div
    ref={observe}
    className="ktext-subtext relative text-center shadow text-main border-main border-2 w-full flex flex-col justify-center items-center group cursor-pointer"
    onClick={props.onClick}
    style={{
      height: containerWidth,
    }}
  >
    {loading
      && (
        <Spinner
          className="stroke-main w-10 h-10 animate-spin m-2"
        />
      )}
    {!loading && props.image &&
      <>
        {props.onDelete &&
          <div 
            className="absolute z-10 -top-[10px] -right-[8px] hidden md:group-hover:block" 
            onClick={(e) => e.stopPropagation()}
          >
            <DeleteButton
              onClick={props.onDelete}
            />
          </div>
        }
        <CFImage
          image={props.image}
          alt="user generated image"
          className='object-contain h-full'
          sizeHint={`${containerWidth}px`}
        />
      </>
    }
    {!loading && !props.image
      && <span className='m-2'>{text}</span>}
  </div>
)};
