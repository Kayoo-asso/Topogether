import React, { Dispatch, SetStateAction, useState } from "react";
import { ParkingForm, WaypointForm } from "../form";
import { Quark, SelectQuarkNullable } from "helpers/quarky";
import { Boulder, Img, Parking, Topo, Track, Waypoint } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverMobile } from "components/atoms";
import { SlideagainstRightDesktop } from "components/atoms/overlays";
import { BoulderBuilderContentDesktop } from "components/builder/BoulderBuilderContent.desktop";
import { BoulderBuilderContentMobile } from "components/builder/BoulderBuilderContent.mobile";

export type ItemType = Quark<Boulder> | Quark<Parking> | Quark<Waypoint>;
export const isBoulder = (item: ItemType): item is Quark<Boulder> => {
	return (item() as Boulder).tracks !== undefined;
};
export const isParking = (item: ItemType): item is Quark<Parking> =>
	(item() as Parking).spaces !== undefined;

type SelectedItem = {
	type: 'none'
} | {
	type: 'boulder',
	value: Quark<Boulder>,
	selectedTrack?: Quark<Track>
} | {
	type: 'parking',
	value: Quark<Parking>
};

function test(selected: SelectedItem) {
	if(selected.type === "boulder") {
		selected.value
	}
}

type SlideoverRightBuilderProps = {
	topo: Quark<Topo>;
	selected?: ItemType;
	selectedTrack: SelectQuarkNullable<Track>;
	currentImage?: Img;
	setCurrentImage: Dispatch<SetStateAction<Img | undefined>>;
	setDisplayDrawer: Dispatch<SetStateAction<boolean>>;
	className?: string;
	onClose: () => void;
};

export const SlideoverRightBuilder: React.FC<SlideoverRightBuilderProps> = (
	props: SlideoverRightBuilderProps
) => {
	const breakpoint = useBreakpoint();
	const [full, setFull] = useState(false);

	const getContent = () => {
		if (props.selected) {
			if (isBoulder(props.selected)) {
				if (breakpoint === "mobile")
					return (
						<BoulderBuilderContentDesktop
							topo={props.topo}
							boulder={props.selected}
							currentImage={props.currentImage}
							setCurrentImage={props.setCurrentImage}
							selectedTrack={props.selectedTrack}
							onDeleteBoulder={props.onClose}
						/>
					);
				return (
					<BoulderBuilderContentMobile
						topo={props.topo}
						boulder={props.selected}
						currentImage={props.currentImage}
						setCurrentImage={props.setCurrentImage}
						selectedTrack={props.selectedTrack}
						setDisplayDrawer={props.setDisplayDrawer}
						full={full}
						onDeleteBoulder={props.onClose}
					/>
				);
			}
			if (isParking(props.selected))
				return (
					<ParkingForm
						topo={props.topo}
						parking={props.selected}
						onDeleteParking={props.onClose}
					/>
				);
			else
				return (
					<WaypointForm
						topo={props.topo}
						waypoint={props.selected}
						onDeleteWaypoint={props.onClose}
					/>
				);
		} else return undefined;
	};

	return (
		<div className="z-100">
			{breakpoint === "mobile" && (
				<SlideoverMobile
					persistent={props.selected && isBoulder(props.selected)}
					onSizeChange={setFull}
					onClose={props.onClose}
				>
					<div className={"h-full px-6 py-14 " + (props.className || "")}>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<SlideagainstRightDesktop
					className="overflow-scroll"
					item={
						props.selected && isBoulder(props.selected)
							? props.selected()
							: undefined
					}
					open={!!props.selected}
					onClose={props.onClose}
				>
					<div className="h-full px-5 py-3">{getContent()}</div>
				</SlideagainstRightDesktop>
			)}
		</div>
	);
};

SlideoverRightBuilder.displayName = "SlideoverRightBuilder";
