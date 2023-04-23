import React from "react";
import Heart from "/assets/icons/heart.svg";
import { classNames } from "~/utils";

interface LikeButtonProps {
	liked: boolean;
	onClick: (value: boolean) => void;
}

export function LikeButton(props: LikeButtonProps) {
	return (
		<Heart
			className={classNames(
				"h-5 w-5 md:cursor-pointer",
				props.liked ? "fill-main" : "stroke-main"
			)}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				props.onClick(!props.liked);
			}}
		/>
	);
}
