import React, { useState } from 'react';
import { ImageThumb } from 'components';
import { Boulder, Image, UUID } from 'types';
import { ImageInput } from '.';
import ArrowFull from 'assets/icons/arrow-full.svg';

interface MultipleImageInputProps {
  images: Image[],
  boulder?: Boulder,
  label?: string,
  rows?: number,
  cols?: number,
  allowUpload?: boolean,
  selected?: UUID,
  onImageClick?: (id: UUID) => void,
  onImageDelete?: (id: UUID) => void,
  onChange: (images: Image[]) => void,
}

export const MultipleImageInput: React.FC<MultipleImageInputProps> = ({
  rows = 2,
  cols = 3,
  allowUpload = true,
  ...props
}: MultipleImageInputProps) => {
  const [page, setPage] = useState<number>(0);
  const [error, setError] = useState<string>();

  let nbVisible = rows * cols;
  if (allowUpload) {
    nbVisible -= 1;
  }
  const nbPages = Math.ceil(props.images.length / nbVisible);

  const displayLeftArrow = page > 0;
  const displayRightArrow = page < nbPages - 1;

  // index of first image to display
  const sliceStart = nbVisible * page;
  // index of last image to display
  const sliceEnd = sliceStart + nbVisible;
  const toDisplay = props.images.slice(sliceStart, sliceEnd);


  return (
    <>
    <div className='flex flex-row gap-1.5 w-full'>
      {displayLeftArrow && (
        <button
          onClick={() => setPage((p) => p - 1)}
        >
          <ArrowFull
            className="w-3 h-3 stroke-main fill-main rotate-180"
          />
        </button>
      )}

      {[...Array(nbVisible).keys()].map((i, index) => {
        if (toDisplay[index])
          return (
            <ImageThumb
              key={toDisplay[index].id}
              image={toDisplay[index]}
              tracks={props.boulder?.tracks.quarks().filter(track => track().lines.find(line => line.imageId === toDisplay[index].id) !== undefined)}
              selected={toDisplay[index].id === props.selected}
              onClick={props.onImageClick}
              onDelete={props.onImageDelete}
            />
          )
        else return <div className='w-full' key={index}></div>
      })}

      {allowUpload && (
        <ImageInput
          label={props.label}
          multiple
          onChange={props.onChange}
          onError={(err) => setError(err)}
        />
      )}

      {displayRightArrow && (
        <button
          onClick={() => setPage((p) => p + 1)}
        >
          <ArrowFull
            className="w-3 h-3 stroke-main fill-main"
          />
        </button>
      )}
    </div>
    <div className={`ktext-error text-error pt-1 w-full mt-2 text-center ${(error && error.length > 0) ? '' : 'hidden'}`}>
      {error}
    </div>
    </>
  );
};
