import React, { useCallback, useRef, useState } from "react";
import Spinner from 'assets/icons/spinner.svg';
import { Portal } from "./useModal";

type Toggles = {
  setOpen: (open: boolean) => void,
}

export function useLoader(): [React.FC, () => void, () => void] {
  const toggles = useRef<Toggles>();
  
  const Loader = useCallback(() => {
    const [open, setOpen] = useState(false);
    toggles.current = { setOpen };

    return (
      <Portal id='loader' open={open}>
        {/* Leave zIndex into "style" (tailwind bug) */}
        <div className='bg-black bg-opacity-80 absolute w-screen h-screen top-0 left-0 flex justify-center items-center' style={{ zIndex: 10000 }}>
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