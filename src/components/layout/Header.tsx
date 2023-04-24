import { ReactNode } from "react";
import { HeaderDesktop } from "./HeaderDesktop";
import { HeaderMobile } from "./HeaderMobile";
import type { DropdownOption } from "~/components/ui/Dropdown";

interface HeaderProps {
	backLink: string;
	onBackClick?: () => void; //Triggered before going to backLink;
	title: string;
	menuOptions?: DropdownOption[];
	displayLogin?: boolean;
	children?: ReactNode;
}

export const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
	return (
		<>
			<div className="md:hidden">
				<HeaderMobile {...props} />
			</div>
			<div className="hidden md:block">
				<HeaderDesktop {...props} />
			</div>
		</>
	);
};

Header.displayName = "Header";
