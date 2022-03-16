import React from 'react';
import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';

interface ModalDeleteProps {
    children: React.ReactNode,
    className?: string,
    onClose: () => void,
    onDelete: () => void,
}

export const ModalDelete: React.FC<ModalDeleteProps> = (props: ModalDeleteProps) => {

    return (
        <Modal
            className={props.className}
            onClose={props.onClose}
        >
            <div className='p-6 pt-10'>
                <div className='w-full h-[100px] relative mb-5'>
                    <NextImage
                        src={staticUrl.deleteWarning}
                        priority
                        alt="Supprimer"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className='mb-5'>
                    {props.children}
                </div>
                <Button
                    content='Supprimer'
                    fullWidth
                    onClick={() => {
                        props.onDelete();
                        props.onClose();
                    }}
                />
            </div>
        </Modal>
    )
}