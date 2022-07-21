import React, { useEffect, useRef, useState } from "react";

type SlideoverMobileProps = React.PropsWithChildren<{
	persistent?: boolean;
	onSizeChange?: (full: boolean) => void;
	onClose?: () => void;
}>;

const OPEN = 3; // 100% - x of the screen
const MINIMIZED = 80;
const CLOSED = 100;

export const SlideoverMobile: React.FC<SlideoverMobileProps> = ({
	persistent = false,
	...props
}: SlideoverMobileProps) => {
	// Starts closed
	const [translateY, setTranslateY] = useState(CLOSED);
	// No transition during dragging, to ensure the movement is smooth
	const [dragging, setDragging] = useState(false);

	const open = translateY === OPEN;

	// Kept in a ref, since it only affects event handling, not rendering
	const touchInfo = useRef({
		start: 0,
		last: 0,
		up: false,
	});
	const prevTranslate = useRef(translateY);

	// Hack for now, because the Slideover component is not permanent on the page
	useEffect(() => {
		if (persistent) setTranslateY(MINIMIZED);
		else setTranslateY(OPEN);
	}, []);

	const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
		setDragging(true);
		const y = e.touches[0].clientY;
		touchInfo.current = {
			start: y,
			last: y,
			up: false,
		};
		prevTranslate.current = translateY;
	};
	function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
		const y = e.touches[0].clientY;
		touchInfo.current = {
			last: y,
			start: touchInfo.current.start,
			// Keep track of the current direction of the swipe, in case the user changes their mind
			up: touchInfo.current.last > y,
		};
		// setTouchEnd(e.touches[0].clientY);
		const swipePercent = (e.touches[0].clientY / window.screen.height) * 100;
		const adjustedNewSlideoverSize = Math.min(
			Math.max(swipePercent, OPEN),
			100
		);
		setTranslateY(adjustedNewSlideoverSize);
	}
	function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
		// In ca
		const end: number = e.changedTouches[0].clientY;
		const { start, up } = touchInfo.current;
		setDragging(false);

		if (Math.abs(start - end) > 50) {
			if (up) {
				// FULL
				setTranslateY(OPEN);
				if (props.onSizeChange) props.onSizeChange(true);
			} else if (!persistent || translateY > MINIMIZED) {
				// CLOSE
				setTranslateY(CLOSED);
				// HACK (for now):
				// wait before invoking onClose, to make sure the animation was completed
				if (props.onClose) setTimeout(props.onClose, 500);
			} else {
				// LITTLE
				setTranslateY(MINIMIZED);
				if (props.onSizeChange) props.onSizeChange(false);
			}
		} else {
			setTranslateY(prevTranslate.current);
		}
	}

	function handleTouchCancel() {
		setDragging(false);
	}

	return (
		<div
			className={`flex flex-col absolute z-500 mb-[5%] h-[100%] w-full rounded-t-lg bg-white pb-[7%] shadow ${
				dragging ? "" : "transition ease-in-out duration-1000"
			} `}
			style={{ transform: `translateY(${translateY}%)` }}
		>
			<div
				className="absolute z-100 flex h-[40px] w-full justify-center"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchCancel}
			>
				<div className="mt-[8px] h-[6px] w-3/12 rounded-full bg-grey-light shadow" />
			</div>
			<div
				className="flex h-full flex-col"
				onTouchStart={(e) => !open && handleTouchStart(e)}
				onTouchMove={(e) => !open && handleTouchMove(e)}
				onTouchEnd={(e) => !open && handleTouchEnd(e)}
				onTouchCancel={handleTouchCancel}
			>
				{props.children}
			</div>
		</div>
	);
};
