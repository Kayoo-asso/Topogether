import { Boulder, LightTopo, Parking, Track, Waypoint } from "types";
import { ShareButton } from "components/atoms/buttons/ShareButton";
import { CloseButton } from "components/atoms/buttons/CloseButton";
import { LikeButton } from "components/atoms/buttons/LikeButton";
import { DownloadButton } from "components/atoms/buttons/DownloadButton";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";

type itemType = LightTopo | Boulder | Parking | Waypoint | Track;

interface ItemsHeaderButtonsProps {
    item: itemType;
    builder?: boolean;
    onClose?: () => void;
}

const isTopo = (item: itemType): item is LightTopo => (item as LightTopo).rockTypes !== undefined;
const isBoulder = (item: itemType): item is Boulder => (item as Boulder).isHighball !== undefined;
const isTrack = (item: itemType): item is Track => (item as Track).isTraverse !== undefined;

export const ItemsHeaderButtons: React.FC<ItemsHeaderButtonsProps> = ({
    builder = false,
    ...props
}: ItemsHeaderButtonsProps) => {
    const bp = useBreakpoint();

    return (
        <div className={`
            absolute flex flex-row w-[90%] px-2 mt-2 z-10 
            ${bp === 'mobile' ? 'hidden' : ''}
            ${(builder || isTrack(props.item)) ? 'justify-end' : 'justify-between'} 
        `}>

            <div className={`
                relative flex flex-row gap-5 justify-evenly items-center bg-white rounded-full md:cursor-pointer
                ${(builder || isTrack(props.item)) ? 'hidden' : ''} 
                ${(isTopo(props.item) || isBoulder(props.item)) ? "px-6" : "px-4"} 
            `}>
                {(isTopo(props.item) || isBoulder(props.item)) && !builder && 
                    <LikeButton liked={props.item.liked} />
                }
                {!isTrack(props.item) && !builder && 
                    <ShareButton location={props.item.location} />
                }
                {isTopo(props.item) && 
                    <DownloadButton topo={props.item} />
                }
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