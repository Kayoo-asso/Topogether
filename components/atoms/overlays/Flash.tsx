import { Portal } from "helpers/hooks/useModal";
import React, { ReactNode, useEffect, useState } from "react";

interface FlashProps {
	open: boolean;
	children?: ReactNode;
	onClose?: () => void;
}

export const Flash: React.FC<FlashProps> = (props: FlashProps) => {
	const [display, setDisplay] = useState(false);
	let closeTimeout: NodeJS.Timeout;

	useEffect(() => {
		if (props.open) {
			setTimeout(() => {
				setDisplay(true);
			}, 10);
			closeTimeout = setTimeout(() => {
				setDisplay(false);
			}, 2000);
		}
		return () => clearTimeout(closeTimeout);
	}, [props.open]);

	useEffect(() => {
		if (!display) {
			setTimeout(() => {
				props.onClose && props.onClose();
			}, 150);
		}
	}, [display]);

	return (
		<Portal open={props.open}>
			<div
				className={
					"z-full w-[90%] bg-white text-center transition-[bottom] ease-in-out md:w-auto md:cursor-pointer " +
					(display
						? "bottom-[5%] md:bottom-[8%]"
						: "-bottom-[20%] md:-bottom-[10%]") +
					" absolute left-[50%] translate-x-[-50%] rounded-lg px-6 py-4 shadow"
				}
				onClick={() => setDisplay(false)}
			>
				{props.children}
			</div>
		</Portal>
	);
};
