import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import { api } from 'helpers/services';
import NextImage from 'next/image';
import React from 'react';
import { LightTopo, TopoStatus } from 'types';

interface ModalValidateTopoProps {
    topo: LightTopo,
    onClose: () => void,
}

export const ModalValidateTopo: React.FC<ModalValidateTopoProps> = (props: ModalValidateTopoProps) => {
    const validateTopo = async () => {
        await api.setTopoStatus(props.topo.id, TopoStatus.Validated);
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
}