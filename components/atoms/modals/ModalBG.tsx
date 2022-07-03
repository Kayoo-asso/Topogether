import React from "react";

interface ModalBGProps {
	children: React.ReactNode;
	onBgClick?: () => void;
}

export const ModalBG: React.FC<ModalBGProps> = (props: ModalBGProps) => {
	return (
		<div
			className={`absolute bg-black bg-opacity-80 top-0 left-0 w-screen h-screen`}
			style={{ zIndex: 9999 }} //No tailwind for this - bug with zIndex
			onClick={props.onBgClick}
			tabIndex={-1}
		>
			<div
				className="bg-white rounded-lg shadow min-h-[25%] w-11/12 md:w-5/12 absolute top-[45%] md:top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] overflow-hidden"
				// Avoid closing the modal when we click here (otherwise propagates to the backdrop)
				onClick={(event) => event.stopPropagation()}
			>
				{props.children}
			</div>
		</div>
	);
};
