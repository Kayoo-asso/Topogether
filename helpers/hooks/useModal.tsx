import React, { useCallback, useEffect, useRef, useState } from "react";
import Clear from 'assets/icons/clear.svg';
import ReactDOM from "react-dom";
import NextImage from 'next/image';
import { Button } from "components";

export type ModalProps<T = undefined> = React.PropsWithChildren<{
  buttonText: string,
  imgUrl?: string,
  onConfirm: (item: T) => void,
  onClose?: (item: T) => void,
}>

type Toggles<T> = {
  setOpen: (open: boolean) => void,
  setItem: React.Dispatch<React.SetStateAction<T>>,
  close?: () => void,
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
    container.className = 'bg-dark bg-opacity-80';
    document.body.append(container);
  }
  // TODO: remove container after last child is removed?

  return open ? ReactDOM.createPortal(children, container, key) : null;
};


// Returns the Modal and show / hide in an array, to make renaming easier, in case of multiple Modals in the same component
export function useModal(): [React.FC<ModalProps<undefined>>, () => void, () => void];
export function useModal<T>(): [React.FC<ModalProps<T>>, (item: T) => void, () => void];
export function useModal<T>(): [React.FC<ModalProps<T>>, (item: T) => void, () => void] {
  const toggles = useRef<Toggles<T>>();

  const Modal = useCallback(({ onConfirm, onClose, children, buttonText, imgUrl }: ModalProps<T>) => {
    const [open, setOpen] = useState(false);
    const [item, setItem] = useState<T | undefined>();

    const close = () => {
      if (onClose) onClose(item!);
      setOpen(false);
    }
    const confirm = () => {
      onConfirm(item!);
      setOpen(false);
    }

    toggles.current = { setOpen, setItem: (setItem as any), close };

    useEffect(() => {
      const handleKeydown = (e: KeyboardEvent) => {
        if (open) {
          if (e.key === 'Escape') close();
          if (e.key === 'Enter') confirm();
        }
      }
      window.addEventListener('keydown', handleKeydown);
      return () => window.removeEventListener('keydown', handleKeydown);
    }, []);

    return (
      <Portal id='modal' open={open}>
        <div 
          className={`absolute bg-black bg-opacity-80 top-0 left-0 w-screen h-screen`}
          style={{ zIndex: 9999 }} //No tailwind for this - bug with zIndex
          onClick={close} 
          tabIndex={-1}
        >
          <div
            className='bg-white rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
            // Avoid closing the modal when we click here (otherwise propagates to the backdrop)
            onClick={(event) => event.stopPropagation()}
          >

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

              <div className='mb-5 text-center'>
                  {children}
              </div>

              <Button
                  content={buttonText}
                  fullWidth
                  onClick={confirm}
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
    useCallback((item: T) => {
      // need to wrap functions before putting them into React state
      toggles.current?.setItem(typeof item === "function" ? () => item : item);
      toggles.current?.setOpen(true);
    }, []),
    useCallback(() => {
      if (toggles.current?.close) toggles.current.close();
    }, [])
  ];
}