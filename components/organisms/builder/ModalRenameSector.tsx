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
        </Modal> 
    )
}