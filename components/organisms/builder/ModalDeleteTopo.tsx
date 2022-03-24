import React from 'react';
import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import { Quark } from 'helpers/quarky';
import NextImage from 'next/image';
import { Topo } from 'types';

interface ModalDeleteTopoProps {
    topo: Quark<Topo>,
    onClose: () => void,
}

export const ModalDeleteTopo: React.FC<ModalDeleteTopoProps> = (props: ModalDeleteTopoProps) => {

    const deleteTopo = () => {
        //TODO : endpoint
        console.log("supprimer le topo");
        props.onClose();
      }

    return (
        <Modal onClose={props.onClose}>
            <div className='p-6 pt-10'>
                <div className='w-full h-[100px] relative mb-5'>
                    <NextImage 
                        src={staticUrl.deleteWarning}
                        priority
                        alt="Supprimer le topo"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className='mb-5'>
                    Le topo sera entièrement supprimé. Etes-vous sûr de vouloir continuer ?
                </div>
                <Button 
                    content='Supprimer'
                    fullWidth
                    onClick={deleteTopo}
                />
            </div>
        </Modal> 
    )
}