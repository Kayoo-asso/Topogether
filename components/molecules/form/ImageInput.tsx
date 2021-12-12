import React, { useEffect, useRef, useState } from 'react';
import Compressor from 'compressorjs';
import {
  ImageAfterServer,
  ImageBeforeServer, isImageType,
  NumberBetween, isBetween, ImageType,
} from 'types';
// eslint-disable-next-line import/no-cycle
import { ImageButton } from '../../atoms';
import { readFileAsync } from '../../../helpers';

interface ImageInputProps {
  label: string,
  value: ImageAfterServer,
  onChange: (file: ImageBeforeServer) => void,
}


export const ImageInput: React.FC<ImageInputProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(false);
  }, [props.value]);

  const handleFileInput = async (file: File) => {
    if (!isImageType(file.type)) {
      setErrorMessage('Fichier jpeg ou png uniquement');
      return;
    }

    if (!isBetween(file.size, 0, 10e6)) {
      setErrorMessage('Image trop lourde. Max: 10MB.');
      return;
    }

    setLoading(true);
    const compressor = new Compressor(file, {
      quality: 0.6,
      strict: true,
      async success(res: File) {
        // Here we already know the file has the correct type and size, but TypeScript can't verify it
        const content = await readFileAsync(res);
        if (content) {
          const fileData: ImageBeforeServer = {
            name: res.name,
            type: res.type as ImageType,
            size: res.size as NumberBetween<0, 10e6>,
            content,
          };
          props.onChange(fileData);
          setErrorMessage('');
          setLoading(false);
        }
      },
      error(err) {
        console.log(err.message);
        setLoading(false);
      },
    });
  };

  return (
    <>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          if (e?.target?.files) { handleFileInput(e.target.files[0]); }
        }}
      />
      <ImageButton
        text={props.label}
        image={props.value}
        loading={loading}
        onClick={() => {
          if (!loading) fileInputRef?.current?.click();
        }}
      />
      <div className={`ktext-error text-error pt-1 w-22 h-22 ${!errorMessage ? 'hidden' : ''}`}>{errorMessage}</div>
    </>
  );
};
