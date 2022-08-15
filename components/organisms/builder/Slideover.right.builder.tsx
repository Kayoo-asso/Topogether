import React, { Dispatch, SetStateAction, useState } from "react";
import { ParkingForm, WaypointForm } from "../form";
import { Quark } from "helpers/quarky";
import { Boulder, Img, Parking, Topo, Track, Waypoint } from "types";
import { useBreakpoint } from "helpers/hooks";
import { SlideoverMobile } from "components/atoms";
import { SlideagainstRightDesktop } from "components/atoms/overlays";
import { BoulderBuilderContentDesktop } from "components/builder/BoulderBuilderContent.desktop";
import { BoulderBuilderContentMobile } from "components/builder/BoulderBuilderContent.mobile";

export type SelectedBoulder = {
	type: 'boulder',
	value: Quark<Boulder>,
	selectedTrack?: Quark<Track>
}
export type SelectedParking = {
	type: 'parking',
	value: Quark<Parking>
}
export type SelectedWaypoint = {
	type: 'waypoint',
	value: Quark<Waypoint>
}
export type ItemType = {
	type: 'none'
} | SelectedBoulder | SelectedParking | SelectedWaypoint;

type SlideoverRightBuilderProps = {
	topo: Quark<Topo>;
	selectedItem: ItemType;
	setSelectedItem: Dispatch<SetStateAction<ItemType>>;
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
		if (props.selectedItem.type !== 'none') {
			if (props.selectedItem.type === 'boulder') {
				if (breakpoint === "mobile")	
					return (
						<BoulderBuilderContentMobile
							topo={props.topo}
							currentImage={props.currentImage}
							setCurrentImage={props.setCurrentImage}
							selectedBoulder={props.selectedItem}
							setSelectedItem={props.setSelectedItem}
							setDisplayDrawer={props.setDisplayDrawer}
							full={full}
							onDeleteBoulder={props.onClose}
						/>
					);
				return (
					<BoulderBuilderContentDesktop
						topo={props.topo}
						currentImage={props.currentImage}
						setCurrentImage={props.setCurrentImage}
						selectedBoulder={props.selectedItem}
						setSelectedItem={props.setSelectedItem}
						onDeleteBoulder={props.onClose}
					/>
				);
			}
			if (props.selectedItem.type === 'parking')
				return (
					<ParkingForm
						topo={props.topo}
						parking={props.selectedItem.value}
						setSelectedItem={props.setSelectedItem}
						onDeleteParking={props.onClose}
					/>
				);
			else
				return (
					<WaypointForm
						topo={props.topo}
						waypoint={props.selectedItem.value}
						setSelectedItem={props.setSelectedItem}
						onDeleteWaypoint={props.onClose}
					/>
				);
		} else return undefined;
	};

	return (
		<div className="z-100">
			{breakpoint === "mobile" && (
				<SlideoverMobile
					persistent={props.selectedItem.type === 'boulder'}
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
					// className="overflow-scroll"
					item={props.selectedItem.type === 'boulder' ? props.selectedItem.value() : undefined}
					open={props.selectedItem.type !== 'none'}
					onClose={props.onClose}
				>
					<div className="h-full">{getContent()}</div>
				</SlideagainstRightDesktop>
			)}
		</div>
	);
};

SlideoverRightBuilder.displayName = "SlideoverRightBuilder";
