import { DropdownOption } from "components";
import { MapToolEnum } from "types";
import { HeaderDesktop, HeaderMobile } from ".";

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