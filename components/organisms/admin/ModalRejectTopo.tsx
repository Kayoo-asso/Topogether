import React from 'react';
import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';

interface ModalRejectTopoProps {
    onReject: () => void,
    onClose: () => void,
}

export const ModalRejectTopo: React.FC<ModalRejectTopoProps> = (props: ModalRejectTopoProps) => {

    return (
        <Modal onClose={props.onClose} >
            <div className='p-6 pt-10'>
                <div className='w-full h-[100px] relative mb-5'>
                    <NextImage 
                        src={staticUrl.deleteWarning}
                        priority
                        alt="Rejeter le topo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className='mb-5'>
                    Le topo retournera en brouillon. Etes-vous sûr de vouloir continuer ?
                </div>
                <Button 
                    content='Rejeter'
                    fullWidth
                    onClick={() => {
                        props.onReject();
                        props.onClose();
                    }}
                />
            </div>
        </Modal> 
    )
}