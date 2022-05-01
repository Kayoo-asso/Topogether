import { useCallback, MouseEvent } from "react";
import usePortal from "react-cool-portal";
import Clear from 'assets/icons/clear.svg';

// Customize your hook based on react-cool-portal
const useModal = (options = {}) => {
  const { Portal, hide, ...rest } = usePortal({
    ...options,
    defaultShow: false,
    internalShowHide: false
  });

  const handleClickBackdrop = useCallback(
    (e: MouseEvent) => {
      const { id } = e.target as HTMLDivElement;
      console.log('hide');
      if (id === "modal") hide();
    },
    [hide]
  );

  const Modal = useCallback(
    ({ children, isShow, className}) => (
      <Portal>
        <div
          id="modal"
          className={'h-screen w-full top-0 left-0 z-1000 absolute' + (className ? className : '')}
          onClick={handleClickBackdrop}
          tabIndex={-1}
        >
          <div 
            className='bg-white z-3000 rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
            onClick={(e) => e.stopPropagation()} 
          >
            {children}
            <div 
              className='absolute top-3 right-3 cursor-pointer'
              onClick={handleClickBackdrop}
            >
              <Clear 
                className='stroke-dark h-8 w-8'
              />
            </div>
          </div>
        </div>
      </Portal>
    ),
    [handleClickBackdrop]
  );

  return { Modal, hide, ...rest };
};

export default useModal;
