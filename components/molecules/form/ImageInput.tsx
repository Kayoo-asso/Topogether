import React, { useRef, useState } from 'react';
import Compressor from 'compressorjs';
import {
  isBetween, isImageType, Image
} from 'types';
// eslint-disable-next-line import/no-cycle
import { ImageButton } from '../../atoms';

interface ImageInputProps {
  label: string,
  display?: Image,
  multiple?: boolean,
  onUpload: (files: File[]) => void,
}

enum FileUploadError {
  NotImageType,
  TooLarge
}

export const ImageInput: React.FC<ImageInputProps> = ({
  multiple = false,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<[string, FileUploadError][]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileInput = async (files: FileList) => {
    const errors: [string, FileUploadError][] = [];
    const uploaded: File[] = [];
    setLoading(true);

    for (const file of files) {
      if (!isImageType(file.type)) {
        errors.push([file.name, FileUploadError.NotImageType]);
      } else if (!isBetween(file.size, 0, 10e6)) {
        errors.push([file.name, FileUploadError.TooLarge]);
      } else {
        new Compressor(file, {
          quality: 0.6,
          strict: true,
          success(compressed: File) {
            uploaded.push(compressed);
          },
          error(err) {
            console.log(err.message);
            // upload uncompressed version
            uploaded.push(file);
          }
        })
      }
    }
    
    props.onUpload(uploaded);
    setLoading(false);
    setErrors(errors);
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
        image={props.display}
        loading={loading}
        onClick={() => {
          if (!loading) fileInputRef.current?.click();
        }}
      />
      <div className={`ktext-error text-error pt-1 w-22 h-22 ${errors ? '' : 'hidden'}`}>
        {errors}
      </div>
    </>
  );
};
