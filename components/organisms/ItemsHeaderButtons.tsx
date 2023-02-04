import { Boulder, LightTopo, Parking, Track, Waypoint } from "types";
import { ShareButton } from "components/atoms/buttons/ShareButton";
import { CloseButton } from "components/atoms/buttons/CloseButton";
import { LikeButton } from "components/atoms/buttons/LikeButton";
import { DownloadButton } from "components/atoms/buttons/DownloadButton";

type itemType = LightTopo | Boulder | Parking | Waypoint;

interface ItemsHeaderButtonsProps {
    item: itemType;
    onClose?: () => void;
}

export const isTopo = (item: itemType): item is LightTopo => (item as LightTopo).rockTypes !== undefined;
export const isBoulder = (item: itemType): item is Boulder => (item as Boulder).isHighball !== undefined;

export const ItemsHeaderButtons: React.FC<ItemsHeaderButtonsProps> = (props: ItemsHeaderButtonsProps) => {

    return (
        <div className="absolute flex flex-row w-full px-2 mt-2 justify-between z-10">

            <div className={`${(isTopo(props.item) || isBoulder(props.item)) ? "px-6" : "px-4"} relative flex flex-row gap-5 justify-evenly items-center bg-white rounded-full md:cursor-pointer`}>
                {(isTopo(props.item) || isBoulder(props.item)) && <LikeButton liked={props.item.liked} />}
                <ShareButton location={props.item.location} />
                {isTopo(props.item) && <DownloadButton topo={props.item} />}
            </div>

            {props.onClose && 
                <div 
                    className="relative bg-white rounded-full px-6 py-6 md:cursor-pointer"
                    onClick={props.onClose}
                >
                    <CloseButton 
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
            }  

        </div>
    )
}

ItemsHeaderButtons.displayName = "ItemsHeaderButtons";