import React, { useRef, useState, forwardRef, useEffect } from 'react';
// eslint-disable-next-line import/no-cycle
import { ImageButton, ProfilePicture } from '../../atoms';
import { api, ImageUploadErrorReason } from 'helpers/services';
import { Image } from 'types';
import { setReactRef } from 'helpers';

interface ImageInputProps {
  label?: string,
  multiple?: boolean,
  value?: Image,
  profileImageButton?: boolean,
  onChange: (images: Image[]) => void,
  onDelete?: () => void,
  onError?: (err: string) => void,
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(({
  multiple = false,
  ...props
}: ImageInputProps, parentRef) => {
  const fileInputRef = useRef<HTMLInputElement>();

  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileInput = async (files: FileList) => {
    const errorcount = {
      [ImageUploadErrorReason.NonImage]: 0,
      [ImageUploadErrorReason.CompressionError]: 0,
      [ImageUploadErrorReason.UploadError]: 0,
    };
    setLoading(true);

    const { images, errors } = await api.images.uploadMany(files);
    for (const err of errors) {
      errorcount[err.reason]++;
    }

    setLoading(false);
    props.onChange(images);
    let error = ''
    if (errorcount[ImageUploadErrorReason.NonImage] === 1) 
      error += "Un des fichiers n'est pas une image valide.\n";
    else if (errorcount[ImageUploadErrorReason.NonImage] > 1)
      error += errorcount[ImageUploadErrorReason.NonImage] + " fichers ne sont pas des images valides.\n";
    if (errorcount[ImageUploadErrorReason.CompressionError] === 1) 
      error += "Un des fichiers est trop lourds.\n";
    else if (errorcount[ImageUploadErrorReason.CompressionError] > 1) 
      error += errorcount[ImageUploadErrorReason.CompressionError] + " fichiers sont trop lourds.\n";
    if (errorcount[ImageUploadErrorReason.UploadError] === 1) 
      error += "Un des fichiers n'a pas pu être uploadé.";
    else if (errorcount[ImageUploadErrorReason.UploadError] > 1) 
      error += errorcount[ImageUploadErrorReason.UploadError] + " fichiers n'ont pas pu être uploadés.";
    setError(error);
  };
  useEffect(() => {
     if (props.onError && error && error.length > 0) props.onError(error);
  }, [error, props.onError]);

  return (
    <>
      <input
        type="file"
        className="hidden"
        multiple={multiple}
        ref={ref => {
          setReactRef(fileInputRef, ref);
          setReactRef(parentRef, ref);
        }}
        onChange={(e) => {
          if (e?.target?.files) { handleFileInput(e.target.files); }
        }}
      />
      {props.profileImageButton &&
        <ProfilePicture 
          image={props.value}
          loading={loading}
          onClick={() => {
            if (fileInputRef.current) fileInputRef.current.click();
          }}
        />
      }
      {!props.profileImageButton &&
        <ImageButton
          text={props.label}
          image={props.value}
          loading={loading}
          onClick={() => {
            if (!loading) fileInputRef.current?.click();
          }}
          onDelete={props.onDelete}
        />
      }
      {!props.onError &&
        <div className={`ktext-error text-error pt-1 w-22 h-22 ${(error && error.length > 0) ? '' : 'hidden'}`}>
          {error}
        </div>
      }
    </>
  );
});
