import { ImageButton } from 'components';
import React, { useRef, useState } from 'react';
import Compressor from 'compressorjs';
import {
  ImageBeforeServer, isImageType, NumberBetween,
} from 'types';
import { isBetween, readFileAsync } from '../../../helpers';

interface ImageInputProps {
  label: string,
  onChange: (file: ImageBeforeServer) => void,
}

export const ImageInput: React.FC<ImageInputProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileInput = async (file: File) => {
    if (!isImageType(file.type)) {
      setErrorMessage('Fichier jpeg ou png uniquement');
      return;
    }

    const maxImageSize = 10e6; // 10MB
    if (!isBetween(file.size, 0, maxImageSize)) {
      setErrorMessage('Image trop lourde. Max: 10MB.');
      return;
    }

    setLoading(true);
    const compressor = new Compressor(file, {
      quality: 0.6,
      async success(res: File) {
        // Here we already know the file has the correct type and size, but TypeScript can't verify it
        const content = await readFileAsync(res);
        if (content) {
          const fileData: ImageBeforeServer = {
            name: res.name,
            type: res.type as 'image/jpeg' | 'image/jpg' | 'image/png',
            size: res.size as NumberBetween<0, 1000>,
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
        loading={loading}
        onClick={() => {
          if (!loading) fileInputRef?.current?.click();
        }}
      />
      <div className={`ktext-error text-error w-22 h-22 ${!errorMessage ? 'hidden' : ''}`}>{errorMessage}</div>
    </>
  );
};
