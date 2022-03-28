import React from 'react';
import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';

interface ModalValidateTopoProps {
    onValidate: () => void,
    onClose: () => void,
}

export const ModalValidateTopo: React.FC<ModalValidateTopoProps> = (props: ModalValidateTopoProps) => {

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
                    Une fois validé, le topo sera accessible par tous les utilisateurs. Etes-vous sûr de vouloir continuer ?
                </div>
                <Button 
                    content='Valider'
                    fullWidth
                    onClick={props.onValidate}
                />
            </div>
        </Modal> 
    )
}