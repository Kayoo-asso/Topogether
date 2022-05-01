import { useCallback, MouseEvent, useEffect } from "react";
import usePortal from "react-cool-portal";
import Clear from 'assets/icons/clear.svg';
import { Button } from "components";
import NextImage from 'next/image';

// Customize your hook based on react-cool-portal
const useModal = (options = {}) => {
  const { Portal, hide, ...rest } = usePortal({
    ...options,
    defaultShow: false,
    // internalShowHide: false,
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
    ({ isShow, children, buttonContent, imgUrl, className, onClick }) => {

      useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            onClick();
            hide();
          }
        }
        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
      }, []);

      return (
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

              <div className='p-6 pt-10'>
                  <div className='w-full h-[100px] relative mb-5'>
                      <NextImage
                          src={imgUrl}
                          priority
                          alt={buttonContent}
                          layout="fill"
                          objectFit="contain"
                      />
                  </div>
                  <div className='mb-5'>
                      {children}
                  </div>
                  <Button
                      content={buttonContent}
                      fullWidth
                      onClick={() => {
                          onClick();
                          hide();
                      }}
                  />
              </div>

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
      )},
    [handleClickBackdrop]
  );

  return { Modal, hide, ...rest };
};

export default useModal;
