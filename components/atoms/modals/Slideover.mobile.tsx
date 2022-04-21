import React, { useEffect, useState } from 'react';

interface SlideoverMobileProps {
  open?: boolean,
  onlyFull?: boolean,
  initialFull?: boolean,
  onSizeChange?: (full: boolean) => void,
  onClose?: () => void,
  children: any,
}

export const SlideoverMobile: React.FC<SlideoverMobileProps> = ({
  open = false,
  onlyFull = false,
  initialFull = false,
  ...props
}: SlideoverMobileProps) => {
  const fullTranslate = 3; // 100% - x of the screen
  const littleTranslate = 80;
  const [full, setFull] = useState(initialFull);
  const [translateY, setTranslateY] = useState<number>(100);
  const [transition, setTransition] = useState(true);
  const [swipeUp, setSwipeUp] = useState(false);

  useEffect(() => {
    window.setTimeout(() => setTranslateY(open ? initialFull ? fullTranslate : littleTranslate : 100), 1);
  }, [open]);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTransition(false);
    setTouchStart(e.touches[0].clientY);
  };
  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    setSwipeUp(touchEnd > e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
    const swipePercent = (e.touches[0].clientY / window.screen.height) * 100;
    const adjustedNewSlideoverSize = Math.min(Math.max(swipePercent, fullTranslate), 100);
    setTranslateY(adjustedNewSlideoverSize);
  }
  function handleTouchEnd() {
    setTransition(true);
    if (touchEnd && Math.abs(touchStart - touchEnd) > 50) {
      if (swipeUp) { // FULL
        setTranslateY(fullTranslate);
        setFull(true);
        if (props.onSizeChange) props.onSizeChange(true);
      } else if (onlyFull || translateY > littleTranslate) { // CLOSE
        setTranslateY(100);
        if (props.onClose) setTimeout(props.onClose, 500);
      } else { // LITTLE
        setTranslateY(littleTranslate);
        setFull(false);
        if (props.onSizeChange) props.onSizeChange(false);
      }
    } else full ? setTranslateY(fullTranslate) : setTranslateY(littleTranslate);
  }

  return (
    <div
      className={`flex flex-col ${transition ? 'transition ease-in-out' : ''} absolute w-full bg-white rounded-t-lg h-[100%] pb-[7%] mb-[5%] z-500 shadow`}
      style={{ transform: `translateY(${translateY}%)` }}
    >
      <div
        className="absolute flex w-full h-[40px] justify-center z-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-grey-light rounded-full h-[6px] w-3/12 shadow mt-[8px]" />
      </div>
      <div 
        className="h-full flex flex-col"
        onTouchStart={(e) => { if (!full) handleTouchStart(e) }}
        onTouchMove={(e) => { if (!full) handleTouchMove(e) }}
        onTouchEnd={(e) => { if (!full) handleTouchEnd() }}
      >
        {props.children}
      </div>
    </div>
  );
};
