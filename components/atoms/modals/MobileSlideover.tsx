import React, { useEffect, useState } from 'react';

interface MobileSlideoverProps {
  open?: boolean,
  onlyFull?: boolean,
  initialFull?: boolean,
  onSizeChange?: (full: boolean) => void,
  onClose?: () => void,
  children: any,
}

export const MobileSlideover: React.FC<MobileSlideoverProps> = ({
  open = false,
  onlyFull = false,
  initialFull = false,
  ...props
}: MobileSlideoverProps) => {
  const fullTranslate = 20; // 100% - x of the screen
  const littleTranslate = 85;
  const [full, setFull] = useState(initialFull);
  const [translateY, setTranslateY] = useState<number>(0);
  const [transition, setTransition] = useState(true);
  const [swipeUp, setSwipeUp] = useState(false);

  useEffect(() => {
    setTranslateY(open ? initialFull ? fullTranslate : littleTranslate : 100);
  }, [open]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const handleToucheStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTransition(false);
    setTouchStart(e.touches[0].clientY);
  };
  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setSwipeUp(touchEnd > e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
    const swipePercent = (e.touches[0].clientY / window.screen.height) * 100;
    const adjustedNewSlideoverSize = Math.min(Math.max(swipePercent, 20), 100);
    setTranslateY(adjustedNewSlideoverSize);
  }
  function handleTouchEnd() {
    setTransition(true);
    if (Math.abs(touchStart - touchEnd) > 50) {
      if (swipeUp) { // FULL
        setTranslateY(fullTranslate);
        setFull(true);
        if (props.onSizeChange) props.onSizeChange(true);
      } else if (onlyFull || translateY > littleTranslate) { // CLOSE
        setTranslateY(100);
        if (props.onClose) props.onClose();
      } else { // LITTLE
        setTranslateY(littleTranslate);
        setFull(false);
        if (props.onSizeChange) props.onSizeChange(false);
      }
    } else full ? setTranslateY(fullTranslate) : setTranslateY(littleTranslate);
  }

  return (
    <div
      className={`flex flex-col ${transition ? 'transition ease-in-out' : ''} absolute w-full bottom-[10vh] bg-white rounded-t-lg h-full pb-[20vh] z-40 shadow`}
      style={{ transform: `translateY(${translateY}%)` }}
    >
      <div
        className="absolute flex w-full h-[40px] justify-center z-50"
        onTouchStart={handleToucheStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-grey-light rounded-full h-[6px] w-3/12 shadow mt-[8px]" />
      </div>
      <div className="h-full">
        {props.children}
      </div>
    </div>
  );
};
