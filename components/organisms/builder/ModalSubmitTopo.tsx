import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import { Quark } from 'helpers/quarky';
import NextImage from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Topo, TopoStatus } from 'types';

interface ModalSubmitTopoProps {
    topo: Quark<Topo>,
    onClose: () => void,
}

export const ModalSubmitTopo: React.FC<ModalSubmitTopoProps> = (props: ModalSubmitTopoProps) => {
    const router = useRouter();

    const submitTopo = () => {
        //TODO : add security (backend)
        props.topo.set({
            ...props.topo(),
            status: TopoStatus.Submitted
        });
        props.onClose();
        router.push('/builder/dashboard');
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
                    onClick={submitTopo}
                />
            </div>
        </Modal> 
    )
}