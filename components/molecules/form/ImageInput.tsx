import React, { useRef, useState, forwardRef } from 'react';
// eslint-disable-next-line import/no-cycle
import { ImageButton, ProfilePicture } from '../../atoms';
import { api, ImageUploadErrorReason } from 'helpers/services';
import { Image } from 'types';

interface ImageInputProps {
  label?: string,
  multiple?: boolean,
  value?: Image,
  profileImageButton?: boolean,
  onChange: (images: Image[]) => void,
  onDelete?: () => void,
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(({
  multiple = false,
  ...props
}: ImageInputProps, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
console.log(props.value);

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
    if (errorcount[ImageUploadErrorReason.NonImage] > 0) error += errorcount[ImageUploadErrorReason.NonImage] + " fichiers ne sont pas des images valides.\n";
    if (errorcount[ImageUploadErrorReason.CompressionError] > 0) error += errorcount[ImageUploadErrorReason.CompressionError] + " fichiers sont trop lourds.\n";
    if (errorcount[ImageUploadErrorReason.UploadError] > 0) error += errorcount[ImageUploadErrorReason.UploadError] + " n'ont pas pu être uploadés.";
    setError(error);
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
      <div className={`ktext-error text-error pt-1 w-22 h-22 ${(error && error.length > 0) ? '' : 'hidden'}`}>
        {error}
      </div>
    </>
  );
});
