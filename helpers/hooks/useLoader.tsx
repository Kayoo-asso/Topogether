import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Spinner from 'assets/icons/spinner.svg';

export type PortalProps = React.PropsWithChildren<{
  id?: string,
  open: boolean,
  key?: string
}>

type Toggles = {
  setOpen: (open: boolean) => void,
}

export const Portal: React.FC<PortalProps> = ({ id = "portal", open, key, children }: PortalProps) => {
  if (typeof window === 'undefined') return null;
  let container = document.getElementById(id);
  if (!container) {
    container = document.createElement('div');
    container.id = id;
    container.className = 'bg-dark bg-opacity-80';
    document.body.append(container);
  }

  return open ? ReactDOM.createPortal(children, container, key) : null;
};


export function useLoader(): [React.FC, () => void, () => void] {
  const toggles = useRef<Toggles>();
  
  const Loader = useCallback(() => {
    const [open, setOpen] = useState(false);
    toggles.current = { setOpen };

    return (
      <Portal id='loader' open={open}>
        <div className='bg-black bg-opacity-80 absolute w-screen h-screen top-0 left-0 flex justify-center items-center z-1000'>
            <Spinner
                className="stroke-main w-10 h-10 animate-spin m-2"
            />
        </div>
      </Portal>
    )
  }, []);

  return [
      Loader, 
      useCallback(() => {
        toggles.current?.setOpen(true);
      }, []),
      useCallback(() => {
        toggles.current?.setOpen(false);
      }, []),
  ];
}