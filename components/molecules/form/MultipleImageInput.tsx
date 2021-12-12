import { Icon, ImageButton, ImageThumb } from 'components';
import React, { useEffect, useRef, useState } from 'react';
import Compressor from 'compressorjs';
import {
  ImageAfterServer,
  ImageBeforeServer, ImageType, isImageType, NumberBetween,
} from 'types';
import { readFileAsync } from '../../../helpers';

// TODO : GESTION DES TRACKSIMAGE

interface MultipleImageInputProps {
  label: string,
  values: ImageAfterServer[],
  numberOfVisibleRows?: number,
  thumbPerRow?: number,
  hasButton?: boolean,
  selectableThumb?: boolean,
  selectedThumbIndex?: number | null,
  getSelectedThumbIndex?: (index: number) => void,
  onChange: (file: ImageBeforeServer) => void,
}

export const MultipleImageInput: React.FC<MultipleImageInputProps> = ({
  numberOfVisibleRows = 2,
  thumbPerRow = 3,
  hasButton = true,
  selectableThumb = false,
  selectedThumbIndex = null,
  ...props
}: MultipleImageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [page, setPage] = useState<number>(0);
  numberOfVisibleRows = numberOfVisibleRows || (props.values.length / (thumbPerRow || 3));
  let numberOfVisibleThumbs = numberOfVisibleRows * (thumbPerRow || 3);
  if (hasButton) numberOfVisibleThumbs -= 1;
  const numberOfPages = Math.ceil(props.values.length / numberOfVisibleThumbs);

  const displayLeftArrow = (numberOfVisibleRows && numberOfPages > 0 && page > 0);
  const displayRightArrow = (numberOfVisibleRows && numberOfPages > 1 && page < numberOfPages - 1);

  const [thumbsToDisplay, setThumbsToDisplay] = useState(numberOfVisibleRows ? props.values.slice(numberOfVisibleThumbs * page, numberOfVisibleThumbs * (page + 1)) : props.values);
  useEffect(() => {
    setThumbsToDisplay(numberOfVisibleRows ? props.values.slice(numberOfVisibleThumbs * page, numberOfVisibleThumbs * (page + 1)) : props.values);
  }, [page]);

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    // if (!props.values.some((image) => image.content)) { // If all images have been saved into ddb
    setThumbsToDisplay(numberOfVisibleRows ? props.values.slice(numberOfVisibleThumbs * page, numberOfVisibleThumbs * (page + 1)) : props.values);
    setLoading(false);
    // }
  }, [props.values]);

  // TODO: Check on the flow of data between the new files and the existing images
  // (MultipleImageInput should only slightly differ from ImageInput)
  const handleFilesInput = async (files: FileList) => {
    if (!files || files.length < 1) return;
    setErrorMessage('');

    const maxImageSize = 10e6; // 10MB
    const newImageList = JSON.parse(JSON.stringify(props.values));
    const newImages: File[] = [];
    for (let i = 0; i < files.length; i += 1) {
      if (newImageList.some((image: ImageBeforeServer) => image.name === files[i].name)) {
        setErrorMessage(`${files[i].name}: deux images ne peuvent pas avoir le même nom`);
      } else if (!isImageType(files[i].type)) {
        setErrorMessage(`${files[i].name}: fichier jpeg ou png uniquement`);
      } else if (files[i].size > maxImageSize) {
        setErrorMessage(`${files[i].name}: image trop lourde. Max: 10MB.`);
      } else newImages.push(files[i]);
    }
    if (newImages.length === 0) return;

    setLoading(true);
    for (let i = 0; i < newImages.length; i += 1) {
      const compressor = new Compressor(files[i], {
        quality: 0.6,
        async success(res: File) {
          const content = await readFileAsync(res);
          if (content) {
            const fileData: ImageBeforeServer = {
              name: res.name,
              type: res.type as ImageType,
              size: res.size as NumberBetween<0, 10e6>,
              content,
            };
            newImageList.push(fileData);
            if (newImageList.length === (props.values.length + newImages.length)) {
              props.onChange(newImageList);
            }
          }
        },
        error(err) {
          console.log(err.message);
          setLoading(false);
        },
      });
    }
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        multiple
        ref={fileInputRef}
        onChange={(e) => {
          if (e?.target?.files) { handleFilesInput(e.target.files); }
        }}
      />

      {displayLeftArrow && (
        <Icon
          name="arrow-full"
          className="stroke-main fill-main"
          onClick={() => {
            const newPage = page - 1;
            setPage(newPage);
          }}
        />
      )}

      {thumbsToDisplay.map((image, index) => (
        <ImageThumb
          key={image.id}
          image={image}
          selectable
          selected={selectedThumbIndex === index}
          onDeleteImage={() => {
            console.log('do on delete image');
          }}
          onClick={() => {
            if (selectableThumb) {
              if (props.getSelectedThumbIndex) props.getSelectedThumbIndex(index);
            }
          }}
        />
      ))}

      {hasButton && (
        <ImageButton
          text={props.label}
          loading={loading}
          onClick={() => {
            if (!loading) fileInputRef?.current?.click();
          }}
        />
      )}

      {displayRightArrow && (
        <Icon
          name="arrow-full"
          className="stroke-main fill-main rotate-180"
          onClick={() => {
            const newPage = page + 1;
            setPage(newPage);
          }}
        />
      )}

      <div className={`ktext-error text-error pt-1 w-64 h-64${!errorMessage ? 'hidden' : ''}`}>{errorMessage}</div>
    </>
  );
};