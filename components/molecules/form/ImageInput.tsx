import { ImageButton } from 'components'
import React from 'react'
import Compressor from 'compressorjs';

interface ImageInputProps {
    label: string,
}

export const ImageInput: React.FC<ImageInputProps> = props => {

    const handleFileInput = async (file) => {
        if (!file) return
        if (file.type !== "image/jpeg" && file.type !== "image/png") {
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
            async success(res) {          
                const fileData = {};
                fileData.name = res.name;
                fileData.type = res.type;
                fileData.size = res.size;
                fileData.content = await readFileAsync(res);
                props.getFileData(fileData);
                setErrorMessage(null);
                setLoading(false);
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
                onClick={() => {

                }}
            />
        </>        
    )
}