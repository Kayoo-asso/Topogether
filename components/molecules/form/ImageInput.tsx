import React, { useRef, useState, forwardRef } from 'react';
import Compressor from 'compressorjs';
import {
  isBetween, BoulderImage 
} from 'types';
// eslint-disable-next-line import/no-cycle
import { ImageButton } from '../../atoms';
import { v4 } from 'uuid';

interface ImageInputProps {
  label?: string,
  multiple?: boolean,
  value?: string,
  onChange: (images: BoulderImage[]) => void,
  onDelete?: () => void,
}

enum FileUploadError {
  NotImageType,
  TooLarge
}

export const ImageInput = forwardRef<HTMLInputElement, ImageInputProps>(({
  multiple = false,
  ...props
}: ImageInputProps, ref) => {
  //TODO : find a way to get back the ref to parent components
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<[string, FileUploadError][]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileInput = async (files: FileList) => {
    const errors: [string, FileUploadError][] = [];
    const uploaded: BoulderImage[] = [];
    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== "image/png" && file.type !== "image/jpg" && file.type !== "image/jpeg") {
        errors.push([file.name, FileUploadError.NotImageType]);
      } else if (!isBetween(file.size, 0, 10e6)) {
        errors.push([file.name, FileUploadError.TooLarge]);
      } else {
        const img = new Image;
        new Compressor(file, {
          quality: 0.6,
          strict: true,
          success(compressed: File) {
            const objectUrl = URL.createObjectURL(compressed)
            img.src = objectUrl;
            img.onload = () => {
              const imgData: BoulderImage = {
                id: v4(),
                index: i,
                imagePath: objectUrl,
                width: img.width,
                height: img.height,
              }
              uploaded.push(imgData);
              if (uploaded.length === files.length) {
                props.onChange(uploaded);
                setLoading(false);
              }
            };
          },
          error(err) {
            // upload uncompressed version
            const objectUrl = URL.createObjectURL(file)
            img.src = objectUrl;
            img.onload = () => {
              const imgData: BoulderImage = {
                id: v4(),
                index: i,
                imagePath: objectUrl,
                width: img.width,
                height: img.height,
              }
              uploaded.push(imgData);
              if (uploaded.length === files.length) {
                props.onChange(uploaded);
                setLoading(false);
              }
            };
          }
        })
      }
    }
    
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
        imageUrl={props.value}
        loading={loading}
        onClick={() => {
          if (!loading) fileInputRef.current?.click();
        }}
        onDelete={props.onDelete}
      />
      <div className={`ktext-error text-error pt-1 w-22 h-22 ${errors.length > 0 ? '' : 'hidden'}`}>
        {errors}
      </div>
    </>
  );
});
