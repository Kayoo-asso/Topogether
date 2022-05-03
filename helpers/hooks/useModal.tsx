import React, { useCallback, useRef, useState } from "react";
import Clear from 'assets/icons/clear.svg';
import ReactDOM from "react-dom";
import NextImage from 'next/image';
import { Button } from "components";
import usePortal from "react-cool-portal";

export type ModalProps = {
  children: React.ReactNode,
  buttonText: string,
  imgUrl?: string,
  onConfirm: () => void,
  onClose?: () => void,
}

type Toggles = {
  setOpen: (open: boolean) => void,
  onClose?: () => void,
}

export type PortalProps = React.PropsWithChildren<{
  id: string,
  open: boolean,
  key?: string
}>

export const Portal: React.FC<PortalProps> = ({ id, open, key, children }: PortalProps) => {
  if (typeof window === 'undefined') return null;
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id
    document.body.append(container);
  }
  // TODO: remove container after last child is removed?

  return open ? ReactDOM.createPortal(children, container, key) : null;
};


// Returns the Modal and show / hide in an array, to make renaming easier, in case of multiple Modals in the same component
export const useModal = (): [React.FC<ModalProps>, () => void, () => void] => {
  const toggles = useRef<Toggles>();

  const Modal = useCallback(({ onConfirm, onClose, children, buttonText, imgUrl }: ModalProps) => {
    const [open, setOpen] = useState(false);

    toggles.current = { setOpen, onClose };
  
    const close = () => {
      if (onClose) onClose();
      setOpen(false);
    }

    // TODO: window event listeners for ESCAPE and ENTER

    return (
      <Portal id='modal' open={open}>
        <div className={`absolute top-0 left-0 w-screen h-screen z-[9998]`} onClick={close} tabIndex={-1}>
          <div
            className='bg-white z-[9999] rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
          >

        {/* <div className={`${open ? 'bg-black bg-opacity-80 ' : 'hidden '}absolute top-0 left-0 w-screen h-screen z-[9998]`} onClick={close} tabIndex={-1}>
          <div className='bg-white z-[9999] rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'> */}
            
            <div className='p-6 pt-10'>
              {imgUrl &&
                <div className='w-full h-[100px] relative mb-5'>
                    <NextImage
                        src={imgUrl}
                        priority
                        alt={buttonText}
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
              }

              <div className='mb-5'>
                  {children}
              </div>

              <Button
                  content={buttonText}
                  fullWidth
                  onClick={() => {
                      onConfirm();
                      setOpen(false);
                  }}
              />
            </div>

            <div
              className='absolute top-3 right-3 cursor-pointer'
              onClick={close}
            >
              <Clear className='stroke-dark h-8 w-8' />
            </div>

          </div>
        </div>

      </Portal>
    )
  }, []);

  return [
    Modal,
    useCallback(() => toggles.current?.setOpen(true), []),
    useCallback(() => {
      if (toggles.current?.onClose) toggles.current.onClose();
      toggles.current?.setOpen(false)
    }, [])
  ];
}

  // const Modal = useCallback(
  //   ({ isShow, children, buttonContent, imgUrl, className, onClick }) => {

  //     useEffect(() => {
  //       const handleKeydown = (e: KeyboardEvent) => {
  //         if (e.key === 'Enter') {
  //           onClick();
  //           hide();
  //         }
  //       }
  //       window.addEventListener('keydown', handleKeydown);
  //       return () => window.removeEventListener('keydown', handleKeydown);
  //     }, []);

  //     return (
  //       <Portal>
  //         <div
  //           id="modal"
  //           className={'h-screen w-full top-0 left-0 z-1000 absolute' + (className ? className : '')}
  //           onClick={handleClickBackdrop}
  //           tabIndex={-1}
  //         >
  //           <div 
  //             className='bg-white z-3000 rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
  //             onClick={(e) => e.stopPropagation()} 
  //           >

  //             <div className='p-6 pt-10'>
  //                 <div className='w-full h-[100px] relative mb-5'>
  //                     <NextImage
  //                         src={imgUrl}
  //                         priority
  //                         alt={buttonContent}
  //                         layout="fill"
  //                         objectFit="contain"
  //                     />
  //                 </div>
  //                 <div className='mb-5'>
  //                     {children}
  //                 </div>
  //                 <Button
  //                     content={buttonContent}
  //                     fullWidth
  //                     onClick={() => {
  //                         onClick();
  //                         hide();
  //                     }}
  //                 />
  //             </div>

  //             <div 
  //               className='absolute top-3 right-3 cursor-pointer'
  //               onClick={handleClickBackdrop}
  //             >
  //               <Clear 
  //                 className='stroke-dark h-8 w-8'
  //               />
  //             </div>
  //           </div>
  //         </div>
  //       </Portal>
  //     )},
  //   [handleClickBackdrop]
  // );