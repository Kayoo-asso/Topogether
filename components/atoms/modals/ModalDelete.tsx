import React, { useEffect } from 'react';
import { Button, Modal } from 'components';
import { staticUrl } from 'helpers';
import NextImage from 'next/image';
import useModal from 'helpers/hooks/useModal';

interface ModalDeleteProps {
    children: React.ReactNode,
    open: boolean,
    className?: string,
    // onClose: () => void,
    onDelete: () => void,
}

export const ModalDelete: React.FC<ModalDeleteProps> = (props: ModalDeleteProps) => {
    const { Modal, show, hide, isShow } = useModal();
    
    useEffect(() => {
        console.log(props.open)
        if (props.open) show();
    }, [props.open]);

    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            props.onDelete();
            hide();
          }
        }
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
      }, []);

    return (
        <Modal isShow={isShow}>
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
                        hide();
                    }}
                />
            </div>
        </Modal>
    )

    

    // return (
    //     <Modal
    //         className={props.className}
    //         onClose={props.onClose}
    //     >
    //         <div className='p-6 pt-10'>
    //             <div className='w-full h-[100px] relative mb-5'>
    //                 <NextImage
    //                     src={staticUrl.deleteWarning}
    //                     priority
    //                     alt="Supprimer"
    //                     layout="fill"
    //                     objectFit="contain"
    //                 />
    //             </div>
    //             <div className='mb-5'>
    //                 {props.children}
    //             </div>
    //             <Button
    //                 content='Supprimer'
    //                 fullWidth
    //                 onClick={() => {
    //                     props.onDelete();
    //                     props.onClose();
    //                 }}
    //             />
    //         </div>
    //     </Modal>
    // )
}