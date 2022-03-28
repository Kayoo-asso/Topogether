import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';
import React from 'react';

interface ModalSubmitTopoProps {
    onSubmit: () => void,
    onClose: () => void,
}

export const ModalSubmitTopo: React.FC<ModalSubmitTopoProps> = (props: ModalSubmitTopoProps) => {

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
                    Le topo sera envoyé en validation. Etes-vous sûr de vouloir continuer ?
                </div>
                <Button 
                    content='valider'
                    fullWidth
                    onClick={() => {
                        props.onSubmit();
                        props.onClose();
                    }}
                />
            </div>
        </Modal> 
    )
}