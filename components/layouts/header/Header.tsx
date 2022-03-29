import type { DropdownOption } from "components";
import { ReactNode } from "react";
import { MapToolEnum } from "types";
import { HeaderDesktop, HeaderMobile } from "components/layouts/header";

interface HeaderProps {
    backLink: string,
    title: string,
    menuOptions?: DropdownOption[],
    displayMapTools?: boolean,
    MapToolsActivated?: boolean,
    onRockClick?: () => void,
    onSectorClick?: () => void,
    onParkingClick?: () => void,
    onWaypointClick?: () => void,
    currentTool?: MapToolEnum,
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