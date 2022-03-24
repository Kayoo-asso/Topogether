import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import { Quark, watchDependencies } from 'helpers/quarky';
import NextImage from 'next/image';
import React from 'react';
import { Topo, TopoStatus } from 'types';

interface ModalValidateTopoProps {
    topo: Quark<Topo>,
    onClose: () => void,
}

export const ModalValidateTopo: React.FC<ModalValidateTopoProps> = watchDependencies((props: ModalValidateTopoProps) => {
    const validateTopo = () => {
        //TODO : add security (backend)
        props.topo.set({
            ...props.topo(),
            status: TopoStatus.Validated
        });
        props.onClose();
      }

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
                    onClick={validateTopo}
                />
            </div>
        </Modal> 
    )
});