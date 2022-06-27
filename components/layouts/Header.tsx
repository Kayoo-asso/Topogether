import type { DropdownOption } from "components";
import { ReactNode } from "react";
import { HeaderDesktop } from "./HeaderDesktop";
import { HeaderMobile } from "./HeaderMobile";

interface HeaderProps {
    backLink: string,
    onBackClick?: () => void, //Overwrite backLink on mobile
    title: string,
    menuOptions?: DropdownOption[],
    displayLogin?: boolean,
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
    )
}

Header.displayName = "Header";