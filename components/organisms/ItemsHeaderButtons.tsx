import { Boulder, LightTopoOld, Parking, Track, Waypoint } from "types";
import { ShareButton } from "components/atoms/buttons/ShareButton";
import { CloseButton } from "components/atoms/buttons/CloseButton";
import { LikeButton } from "components/atoms/buttons/LikeButton";
import { DownloadButton } from "components/atoms/buttons/DownloadButton";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";

type itemType = LightTopoOld | Boulder | Parking | Waypoint | Track;

interface ItemsHeaderButtonsProps {
	item: itemType;
	builder?: boolean;
	onClose?: () => void;
}

const isTopo = (item: itemType): item is LightTopoOld =>
	(item as LightTopoOld).rockTypes !== undefined;
const isBoulder = (item: itemType): item is Boulder =>
	(item as Boulder).isHighball !== undefined;
const isTrack = (item: itemType): item is Track =>
	(item as Track).isTraverse !== undefined;

export const ItemsHeaderButtons: React.FC<ItemsHeaderButtonsProps> = ({
	builder = false,
	...props
}: ItemsHeaderButtonsProps) => {
	const bp = useBreakpoint();

	return (
		<div
			className={`
            absolute z-10 mt-2 flex w-[90%] flex-row px-2 
            ${bp === "mobile" ? "hidden" : ""}
            ${
							builder || isTrack(props.item) ? "justify-end" : "justify-between"
						} 
        `}
		>
			<div
				className={`
                relative flex flex-row items-center justify-evenly gap-5 rounded-full bg-white md:cursor-pointer
                ${builder || isTrack(props.item) ? "hidden" : ""} 
                ${
									isTopo(props.item) || isBoulder(props.item) ? "px-6" : "px-4"
								} 
            `}
			>
				{(isTopo(props.item) || isBoulder(props.item)) && !builder && (
					<LikeButton liked={props.item.liked} />
				)}
				{!isTrack(props.item) && !builder && (
					<ShareButton location={props.item.location} />
				)}
				{isTopo(props.item) && <DownloadButton topo={props.item} />}
			</div>

			{props.onClose && (
				<div
					className="relative rounded-full bg-white px-6 py-6 md:cursor-pointer"
					onClick={props.onClose}
				>
					<CloseButton className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" />
				</div>
			)}
		</div>
	);
};

ItemsHeaderButtons.displayName = "ItemsHeaderButtons";
