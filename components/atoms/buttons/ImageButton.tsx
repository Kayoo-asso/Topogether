import React from "react";
// eslint-disable-next-line import/no-cycle
import useDimensions from "react-cool-dimensions";
import { DeleteButton } from ".";
import { CFImage } from "../CFImage";
import { Image } from "types";
import Spinner from "assets/icons/spinner.svg";

interface ImageButtonProps {
	text?: string;
	image?: Image;
	loading?: boolean;
	activated?: boolean;
	onClick: () => void;
	onDelete?: () => void;
}

export const ImageButton: React.FC<ImageButtonProps> = ({
	text = "+ Ajouter une image",
	loading = false,
	activated = true,
	...props
}) => {
	const {
		observe,
		unobserve,
		width: containerWidth,
		height: containerHeight,
		entry,
	} = useDimensions({
		onResize: ({ observe, unobserve, width, height, entry }) => {
			// Triggered whenever the size of the target is changed...
			unobserve(); // To stop observing the current target element
			observe(); // To re-start observing the current target element
		},
	});

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
		<div
			ref={observe}
			className={
				(activated
					? "border-main text-main"
					: "border-grey-medium text-grey-medium") +
				"ktext-subtext group relative flex w-full cursor-pointer flex-col items-center justify-center border-2 text-center shadow"
			}
			onClick={props.onClick}
			style={{
				height: containerWidth,
			}}
		>
			{loading && (
				<Spinner className="m-2 h-10 w-10 animate-spin stroke-main" />
			)}
			{!loading && props.image && (
				<>
					{props.onDelete && (
						<div
							className="absolute -top-[10px] -right-[8px] z-10 hidden md:group-hover:block"
							onClick={(e) => e.stopPropagation()}
						>
							<DeleteButton onClick={props.onDelete} />
						</div>
					)}
					<CFImage
						image={props.image}
						alt="user generated image"
						objectFit="contain"
						sizeHint={`${containerWidth}px`}
					/>
				</>
			)}
			{!loading && !props.image && (
				<span className="ktext-subtext m-1 text-main">{text}</span>
			)}
		</div>
	);
};
