import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';
import React from 'react';

interface ModalUnsaveTopoProps {
    onUnsave: () => void,
    onClose: () => void,
}

export const ModalUnsaveTopo: React.FC<ModalUnsaveTopoProps> = (props: ModalUnsaveTopoProps) => {

    return (
        <Modal onClose={props.onClose} >
            <div className='p-6 pt-10'>
                <div className='w-full h-[100px] relative mb-5'>
                    <NextImage 
                        src={staticUrl.defaultProfilePicture}
                        priority
                        alt="Valider le topo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className='mb-5'>
                    Le topo ne sera plus accessible hors ligne. Voulez-vous continuer ?
                </div>
                <Button 
                    content='valider'
                    fullWidth
                    onClick={() => {
                        props.onUnsave();
                        props.onClose();
                    }}
                />
            </div>
        </Modal> 
    )
}