import React, { useRef, useState, forwardRef } from 'react';
// eslint-disable-next-line import/no-cycle
import { ImageButton } from '../../atoms';
import { api, BoulderImageUploadResult, BoulderImageUploadSuccess, ImageUploadErrorReason } from 'helpers/services';
import { BoulderImage } from 'types';

interface ImageInputProps {
  label?: string,
  multiple?: boolean,
  value?: string,
  onChange: (images: BoulderImage[]) => void,
  onDelete?: () => void,
}

const processImages = async (files: FileList): Promise<BoulderImageUploadResult[]> => {
  const promises = Array.from(files)
    .map(processImage);
  const results = await Promise.all(promises);
  return results;
}

const processImage = async (file: File): Promise<BoulderImageUploadResult> => {
  const res = await api.images.upload(file);
  if (res.type === 'error') {
    return res;
  }
  else { // SUCCESS FOR THIS IMAGE
    const img = new Image;
    const objectUrl = URL.createObjectURL(file)
    img.src = objectUrl;
    const promise = new Promise<BoulderImageUploadSuccess>((resolve, _reject) => {
      img.onload = () => resolve({
        type: 'success',
        id: res.id,
        path: res.path,
        width: img.width,
        height: img.height,
      });
    });
    return await promise;
  }
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(({
  multiple = false,
  ...props
}: ImageInputProps, ref) => {
  //TODO : find a way to get back the ref to parent components
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileInput = async (files: FileList) => {
    const errors = {
      'type': 0,
      'size': 0,
      'upload': 0,
    };
    setLoading(true);
    const images: BoulderImage[] = [];

    const results = await processImages(files);
    for (const res of results) {
      if (res.type === 'error') {
          if (res.reason === ImageUploadErrorReason.NonImage) errors.type++;
          else if (res.reason === ImageUploadErrorReason.CompressionError) errors.size++;
          else errors.upload++;
      }
      else { //SUCCESS
        images.push({
          id: res.id,
          path: res.path,
          width: res.width,
          height: res.height,
        });
      }
    }

    setLoading(false);
    props.onChange(images);
    let error = ''
    if (errors.type > 0) error += errors.type + " fichiers ne sont pas des images valides.\n";
    if (errors.size > 0) error += errors.size + " fichiers sont trop lourds.\n";
    if (errors.upload > 0) error += errors.upload + " n'ont pas pu être uploadés.";
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        multiple={multiple}
        ref={fileInputRef}
        onChange={(e) => {
          if (e?.target?.files) { handleFileInput(e.target.files); }
        }}
      />
      <ImageButton
        text={props.label}
        imageUrl={props.value}
        loading={loading}
        onClick={() => {
          if (!loading) fileInputRef.current?.click();
        }}
        onDelete={props.onDelete}
      />
      <div className={`ktext-error text-error pt-1 w-22 h-22 ${(error && error.length > 0) ? '' : 'hidden'}`}>
        {error}
      </div>
    </>
  );
});
