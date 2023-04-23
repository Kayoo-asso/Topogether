import React from "react";
import Link from "next/link";
import { Loading } from "./Loading";
import { classNames } from "~/utils";

interface ButtonProps {
	content: string;
	className?: string;
	white?: boolean;
	activated?: boolean;
	loading?: boolean;
	fullWidth?: boolean;
	href?: string;
	onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
	white = false,
	fullWidth = false,
	activated = true,
	loading = false,
	className = "",
	...props
}: ButtonProps) => {
	const getUIClasses = () => {
		if (activated && !loading) {
			if (white)
				return "text-main bg-white border-2 border-main hover:text-main-light hover:border-main-light";
			else return "text-white bg-main hover:bg-main-light";
		} else return "bg-grey-light text-white cursor-default";
	};
	const button = (
		<button
			className={`ktext-subtitle flex h-[45px] w-full flex-row items-center justify-center gap-5 rounded-full px-4 py-4 shadow lg:h-[50px] lg:px-8 ${getUIClasses()} ${className}`}
			onClick={() => {
				if (!loading && activated && props.onClick && !props.href)
					props.onClick();
			}}
		>
			<div>{props.content}</div>
			{loading && (
				<div>
					<Loading SVGClassName="h-6 w-6 stroke-white" bgWhite={false} />
				</div>
			)}
		</button>
	);

	if (props.href && activated) {
		return (
			<Link
				className={classNames(fullWidth && "w-full")}
				href={props.href || ""}
			>
				{button}
			</Link>
		);
	} else {
		return <>{button}</>;
	}
};
