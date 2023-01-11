import React from "react";
import { DeleteButton } from ".";
import { Image } from "../Image";
import { Img } from "types";
import Spinner from "assets/icons/spinner.svg";

interface ImageButtonProps {
	text?: string;
	image?: Img;
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

	return (
		<div
			className={`${activated ? "border-main text-main" : "border-grey-medium text-grey-medium"} 
				"ktext-subtext group relative border-2 shadow w-[72px] h-[72px] flex justify-center items-center md:cursor-pointer`
			}
			onClick={props.onClick}
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
					<Image
						image={props.image}
						alt="user generated image"
						objectFit="contain"
						sizeHint='300px'
					/>
				</>
			)}
			{!loading && !props.image && (<span className="text-center">{text}</span>)}
		</div>
	);
};
