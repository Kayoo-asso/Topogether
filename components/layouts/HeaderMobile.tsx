import React, { ReactElement, ReactNode, useState } from "react";
import { Dropdown, DropdownOption } from "components";
import Link from "next/link";
import ArrowSimple from "assets/icons/arrow-simple.svg";
import MenuIcon from "assets/icons/menu.svg";
import { useRouter } from "next/router";

interface HeaderMobileProps {
	title: string;
	menuOptions?: DropdownOption[];
	backLink: string;
	onBackClick?: () => void;
	children?: ReactNode;
}

export const HeaderMobile: React.FC<HeaderMobileProps> = (
	props: HeaderMobileProps
) => {
	const router = useRouter();

	const [menuOpen, setMenuOpen] = useState(false);
	const [displayTitleTooltip, setDisplayTitleTooltip] = useState(false);

	const wrapLink = (elts: ReactElement<any, any>) => {
		if (props.onBackClick) return <a onClick={() => {
			props.onBackClick!();
			router.push(props.backLink);
		}}>{elts}</a>;
		else
			return (
				<Link href={props.backLink}>
					<a>{elts}</a>
				</Link>
			);
	};

	return (
		<div className="flex h-header items-center bg-dark">
			<div className="flex w-1/6 justify-center">
				{wrapLink(<ArrowSimple className="h-4 w-4 stroke-white stroke-1" />)}
			</div>

			<div
				className={
					(props.children ? "w-3/6" : "w-4/6") +
					" ktext-title overflow-hidden whitespace-nowrap text-white"
				}
				aria-label={displayTitleTooltip ? props.title : undefined}
				data-microtip-position="bottom"
				role="tooltip"
				onClick={() => setDisplayTitleTooltip(!displayTitleTooltip)}
			>
				{props.title}
			</div>
			
			<div className={
				(props.children ? "w-2/6" : "w-1/6") +
				" flex flex-row justify-center items-center gap-5 mr-2"
			}>
				{props.children && (
					<>{props.children}</>
				)}

				{props.menuOptions && (
					<button
						className="flex justify-center"
						onClick={() => setMenuOpen((x) => !x)}
					>
						<MenuIcon
							className={`h-4 w-4 fill-white ${menuOpen ? "rotate-90" : ""}`}
						/>
					</button>
				)}
			</div>
			
			{menuOpen && props.menuOptions && (
				<Dropdown
					options={props.menuOptions}
					className="absolute right-[10px] top-[7%] z-1000 min-w-[40%]"
					onSelect={() => setMenuOpen(false)}
				/>
			)}
		</div>
	);
};
