import { Quark, watchDependencies } from "helpers/quarky";
import { sync } from "helpers/services";
import React, { useCallback } from "react";
import Heart from "/assets/icons/heart.svg";

interface LikeButtonProps {
	liked: Quark<boolean>;
	className?: string;
}

export const LikeButton: React.FC<LikeButtonProps> = watchDependencies(
	({ liked, ...props }: LikeButtonProps) => {
		const toggle = useCallback(async () => {
			liked.set((l) => !l);
			await sync.attemptSync();
		}, [liked]);
		const color = liked() ? "fill-main" : "stroke-dark";

		return (
			<Heart className={`h-5 w-5 cursor-pointer ${color} ${props.className}`} onClick={toggle} />
		);
	}
);
