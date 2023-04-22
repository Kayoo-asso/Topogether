import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import ArrowSimple from "assets/icons/arrow-simple.svg";
import MenuIcon from "assets/icons/menu.svg";
import { useRouter } from "next/router";
import { useSelectStore } from "components/store/selectStore";
import { Dropdown, DropdownOption } from "components/molecules/form/Dropdown";

type HeaderMobileProps = React.PropsWithChildren<{
	title: string;
	menuOptions?: DropdownOption[];
	backLink: string;
	onBackClick?: () => void;
}>;

export const HeaderMobile: React.FC<HeaderMobileProps> = (
	props: HeaderMobileProps
) => {
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);
	const [displayTitleTooltip, setDisplayTitleTooltip] = useState(false);

	const itemType = useSelectStore((s) => s.item.type);
	useEffect(() => {
		if (itemType !== "none") setMenuOpen(false);
	}, [itemType]);

	const wrapLink = (elts: ReactElement<any, any>) => {
		if (props.onBackClick)
			return (
				<button
					onClick={() => {
						props.onBackClick!();
						router.push(props.backLink);
					}}
				>
					{elts}
				</button>
			);
		else return <Link href={props.backLink}>{elts}</Link>;
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

			<div
				className={
					(props.children ? "w-2/6" : "w-1/6") +
					" mr-2 flex flex-row items-center justify-center gap-5"
				}
			>
				{props.children && <>{props.children}</>}

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
