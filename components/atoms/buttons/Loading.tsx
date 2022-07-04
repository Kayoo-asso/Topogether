import React from "react";
import Spinner from "assets/icons/spinner.svg";

interface LoadingProps {
	SVGClassName?: string;
	bgWhite?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
	SVGClassName = "w-24 h-24",
	bgWhite = true,
}) => {
	return (
		<div
			className={
				"flex h-full w-full items-center justify-center" +
				(bgWhite ? " bg-white" : "")
			}
		>
			<Spinner className={"m-2 animate-spin stroke-main " + SVGClassName} />
		</div>
	);
};
