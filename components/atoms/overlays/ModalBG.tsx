import React from "react";

interface ModalBGProps {
	children: React.ReactNode;
	onBgClick?: () => void;
}

export const ModalBG: React.FC<ModalBGProps> = (props: ModalBGProps) => {
	return (
		<div
			className={`absolute top-0 left-0 h-screen w-screen bg-black bg-opacity-80`}
			style={{ zIndex: 9999 }} //No tailwind for this - bug with zIndex
			onClick={props.onBgClick}
			tabIndex={-1}
		>
			<div
				className="absolute top-[45%] left-[50%] min-h-[25%] w-11/12 translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-lg bg-white shadow md:top-[50%] md:w-5/12"
				// Avoid closing the modal when we click here (otherwise propagates to the backdrop)
				onClick={(event) => event.stopPropagation()}
			>
				{props.children}
			</div>
		</div>
	);
};
