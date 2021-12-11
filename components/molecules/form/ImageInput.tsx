import { ImageButton } from 'components'
import React, { useRef, useState } from 'react'
import Compressor from 'compressorjs';
import { imageBeforeServer } from 'types';
import { readFileAsync } from '../../../helpers';
import { NumberBetween } from 'types';

interface ImageInputProps {
    label: string,
    onChange: (file: imageBeforeServer) => void,
}

export const ImageInput: React.FC<ImageInputProps> = props => {
    const fileInputRef = useRef();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileInput = async (file: File) => {
        if (!file) return      
        if (file.type !== "image/jpeg" && file.type !== "image/jpg" && file.type !== "image/png") {
            setErrorMessage("Type de fichier non reconnu. N'accepte que jpeg ou png.");
            return;
        }
        const maxImageSize = 10000000; //10MB
        if (file.size > maxImageSize) {
            setErrorMessage("L'image est trop lourde. Max: 10MB.");
            return;
        }
        setLoading(true);
        new Compressor(file, {
            quality: 0.6,
            async success(res: File) { 
                // if (res.type === "image/jpeg") {
                const fileData: imageBeforeServer = {
                    name: res.name,
                    type: res.type as "image/jpeg" | "image/jpg" | 'image/png',
                    size: res.size as NumberBetween<0, 1000,
                    content: '',
                };
                fileData.content = await readFileAsync(res);
                props.onChange(fileData);
                setErrorMessage('');
                setLoading(false);
            // }
            },
            error(err) {
                console.log(err.message);
                setLoading(false);
            }
        });
    }

    return (
        <>
            <input 
                type='file' 
                className='hidden'
                onChange={e => {
                    if (e?.target?.files)
                        handleFileInput(e.target.files[0]);
                }}
            />
            <ImageButton 
                text={props.label}
                loading={loading}
                onClick={() => {

                }}
            />
        </>        
    )
}