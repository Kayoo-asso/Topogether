import React from 'react';
import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';

interface ModalUnvalidateTopoProps {
    onValidate: () => void,
    onClose: () => void,
}

export const ModalUnvalidateTopo: React.FC<ModalUnvalidateTopoProps> = (props: ModalUnvalidateTopoProps) => {

    return (
        <Modal onClose={props.onClose} >
            <div className='p-6 pt-10'>
                <div className='w-full h-[100px] relative mb-5'>
                    <NextImage 
                        src={staticUrl.deleteWarning}
                        priority
                        alt="Valider le topo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className='mb-5'>
                    Le topo retournera en attente de validation. Etes-vous sûr de vouloir continuer ?
                </div>
                <Button 
                    content='Valider'
                    fullWidth
                    onClick={() => {
                        props.onValidate();
                        props.onClose();
                    }}
                />
            </div>
        </Modal> 
    )
}