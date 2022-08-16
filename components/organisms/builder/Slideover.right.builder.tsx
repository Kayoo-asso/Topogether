import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { ParkingForm, WaypointForm } from "../form";
import { Quark } from "helpers/quarky";
import { Img, Topo } from "types";
import { useBreakpoint } from "helpers/hooks";
import { BoulderBuilderContentMobile } from "./BoulderBuilderContent.mobile";
import { BoulderBuilderContentDesktop } from "./BoulderBuilderContent.desktop";
import { SelectedItem } from "types/SelectedItems";
import { SlideoverMobile, SlideoverRightDesktop } from "components/atoms/overlays";
import { BuilderSlideoverTrackDesktop } from "./BuilderSlideoverTrack.desktop";
import { Drawer } from "../Drawer";

type SlideoverRightBuilderProps = {
	topo: Quark<Topo>;
	selectedItem: SelectedItem;
	setSelectedItem: Dispatch<SetStateAction<SelectedItem>>;
};

export const SlideoverRightBuilder: React.FC<SlideoverRightBuilderProps> = (
	props: SlideoverRightBuilderProps
) => {
	const breakpoint = useBreakpoint();
	const [full, setFull] = useState(false);

	const onClose = useCallback(() => {
		props.setSelectedItem({ type: 'none' });
	}, [props.setSelectedItem]);

	const getContent = useCallback(() => {
		if (props.selectedItem.type !== 'none') {
			if (props.selectedItem.type === 'boulder') {
				if (breakpoint === "mobile")	
					return (
						<BoulderBuilderContentMobile
							topo={props.topo}
							selectedBoulder={props.selectedItem}
							setSelectedItem={props.setSelectedItem}
							full={full}
							onDeleteBoulder={onClose}
						/>
					);
				return (
					<BoulderBuilderContentDesktop
						topo={props.topo}
						selectedBoulder={props.selectedItem}
						setSelectedItem={props.setSelectedItem}
						onDeleteBoulder={onClose}
					/>
				);
			}
			if (props.selectedItem.type === 'parking')
				return (
					<ParkingForm
						topo={props.topo}
						parking={props.selectedItem.value}
						setSelectedItem={props.setSelectedItem}
						onDeleteParking={onClose}
					/>
				);
			else
				return (
					<WaypointForm
						topo={props.topo}
						waypoint={props.selectedItem.value}
						setSelectedItem={props.setSelectedItem}
						onDeleteWaypoint={onClose}
					/>
				);
		} else return undefined;
	}, [full, breakpoint, props.selectedItem]);

	return (
		<>
			{breakpoint === "mobile" && (
				<SlideoverMobile
					open={props.selectedItem.type !== 'none'}
					persistent={props.selectedItem.type === 'boulder'}
					onSizeChange={setFull}
					onClose={onClose}
				>
					<div className={"h-full " + (props.selectedItem.type !== 'boulder' ? 'px-4 py-14' : '')}>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<>
					<SlideoverRightDesktop
						item={props.selectedItem.type === 'boulder' ? props.selectedItem.value() : undefined}
						open={props.selectedItem.type !== 'none'}
						onClose={onClose}
					>
						<div className="h-full">{getContent()}</div>
					</SlideoverRightDesktop>

					{props.selectedItem.type === 'boulder' && props.selectedItem.selectedTrack &&
						<>
							<BuilderSlideoverTrackDesktop 
								selectedBoulder={props.selectedItem}
								setSelectedItem={props.setSelectedItem}
							/>
							<Drawer
								selectedBoulder={props.selectedItem}
								setSelectedItem={props.setSelectedItem}
							/>
						</>
					}
				</>
			)}
		</>
	);
};

SlideoverRightBuilder.displayName = "SlideoverRightBuilder";
