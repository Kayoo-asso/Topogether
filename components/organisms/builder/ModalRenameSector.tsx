import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, TextInput } from 'components';
import { Quark } from 'helpers/quarky';
import { Name, Sector } from 'types';
import { Portal } from 'helpers';
import Clear from 'assets/icons/clear.svg';

interface ModalRenameSectorProps {
    sector: Quark<Sector>,
    onClose: () => void,
}

export const ModalRenameSector: React.FC<ModalRenameSectorProps> = (props: ModalRenameSectorProps) => {
    const sector = props.sector();

    const [sectorNameError, setSectorNameError] = useState<string>();

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.addEventListener("keydown", handleUserKeyPress);
            return () => {
                if (inputRef.current) inputRef.current.removeEventListener("keydown", handleUserKeyPress);
            };
        }
    }, [inputRef.current]);

    const handleUserKeyPress = useCallback((e) => {
        if (e.key === 'Enter') props.onClose();
    }, []);
    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    return (
        <Portal id="modal" open>
            <div 
                className={`absolute bg-black bg-opacity-80 top-0 left-0 w-screen h-screen`}
                style={{ zIndex: 9999 }} //No tailwind for this - bug with zIndex
                onClick={close} 
                tabIndex={-1}
            >
                <div
                    className='bg-white rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
                    // Avoid closing the modal when we click here (otherwise propagates to the backdrop)
                    onClick={(event) => event.stopPropagation()}
                >

                    <div className='flex flex-col gap-6 p-6 pt-10'>
                        <div>Renommer le secteur</div>
                        <TextInput 
                            ref={inputRef}
                            id='sector-name'
                            error={sectorNameError}
                            value={sector.name}
                            onChange={(e) => {
                                props.sector.set(s => ({
                                    ...s,
                                    name: e.target.value as Name
                                }))
                                if (e.target.value.length > 2) setSectorNameError(undefined);
                                else setSectorNameError("Le nom doit avoir plus de 2 caractères")
                            }}
                        />
                        <Button 
                            content='valider'
                            fullWidth
                            activated={sector.name.length > 2}
                            onClick={() => props.onClose()}
                        />
                    </div>

                    <div
                        className='absolute top-3 right-3 cursor-pointer'
                        onClick={close}
                    >
                        <Clear className='stroke-dark h-8 w-8' />
                    </div>

                </div>
            </div>
        </Portal> 
    )
}