import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import { Quark } from 'helpers/quarky';
import NextImage from 'next/image';
import React from 'react';
import { Topo } from 'types';

interface ModalValidateTopoProps {
    topo: Quark<Topo>,
    onClose: () => void,
}

export const ModalValidateTopo: React.FC<ModalValidateTopoProps> = (props: ModalValidateTopoProps) => {

    const validateTopo = () => {
        console.log("valider le topo");
        props.onClose();
      }

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
                    onClick={validateTopo}
                />
            </div>
        </Modal> 
    )
}