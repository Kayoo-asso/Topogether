import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, TextInput } from 'components';
import { Quark } from 'helpers/quarky';
import { Name, Sector } from 'types';

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
        }
    }, [inputRef.current]);

    return (
        <Modal onClose={props.onClose} >
            <div className='p-6 pt-10'>
                <TextInput 
                    ref={inputRef}
                    id='sector-name'
                    error={sectorNameError}
                    value={sector.name}
                    onChange={(e) => {
                        if (e.target.value.length > 2) props.sector.set(s => ({
                            ...s,
                            name: e.target.value as Name
                        }))
                        else setSectorNameError("Le nom doit avoir plus de deux caractères")
                    }}
                />
                <Button 
                    content='valider'
                    fullWidth
                    onClick={() => props.onClose()}
                />
            </div>
        </Modal> 
    )
}