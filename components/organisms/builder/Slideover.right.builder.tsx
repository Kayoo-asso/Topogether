import React, { useCallback, useState } from "react";
import { Quark } from "helpers/quarky";
import { Topo } from "types";
import { BoulderBuilderContentMobile } from "./BoulderBuilderContent.mobile";
import { BoulderBuilderContentDesktop } from "./BoulderBuilderContent.desktop";
import { Drawer } from "../Drawer";
import { useSelectStore } from "components/store/selectStore";
import { useBreakpoint } from "helpers/hooks/DeviceProvider";
import { ParkingForm } from "../form/ParkingForm";
import { WaypointForm } from "../form/WaypointForm";
import { SlideoverMobile } from "components/atoms/overlays/SlideoverMobile";
import { SlideoverRightDesktop } from "components/atoms/overlays/SlideoverRightDesktop";
import { TrackForm } from "../form/TrackForm";
import { useDrawerStore } from "components/store/drawerStore";

type SlideoverRightBuilderProps = {
	topo: Quark<Topo>;
};

export const SlideoverRightBuilder: React.FC<SlideoverRightBuilderProps> = (
	props: SlideoverRightBuilderProps
) => {
	const bp = useBreakpoint();
	const [full, setFull] = useState(false);
	const flush = useSelectStore(s => s.flush);
	const item = useSelectStore(s => s.item);
	const isTrackSelected = !!(item.type === 'boulder' && item.selectedTrack);
	const isDrawerOpen = useDrawerStore(d => d.isDrawerOpen);

	const onClose = () => {
		if (bp === 'mobile') flush.all();
		else if (isTrackSelected) flush.track();
		else flush.item();
	};

	const getContent = useCallback(() => {
		switch (item.type) {
			case 'sector': return undefined;
			case 'boulder': {
				if (bp === "mobile") return (
					<BoulderBuilderContentMobile
						topo={props.topo}
						full={full}
					/>);
				else {
					if (isTrackSelected) return (<TrackForm />);
					else return (
						<BoulderBuilderContentDesktop
							topo={props.topo}
						/>
					);
				}
			}
			case 'parking': return (
				<ParkingForm
					parkings={props.topo().parkings}
				/>
			);
			case 'waypoint': return (
				<WaypointForm
					waypoints={props.topo().waypoints}
				/>
			);
			default: return undefined;
		}
	}, [full, props.topo, bp, item.type, isTrackSelected]);

	return (
		<>
			{bp === "mobile" && item.type !== 'none' && (
				<SlideoverMobile
					open={item.type !== 'sector'}
					persistent={item.type === 'boulder'}
					onSizeChange={setFull}
					onClose={onClose}
				>
					<div className={"h-full " + (item.type !== 'boulder' ? 'px-4 py-14' : '')}>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{bp !== "mobile" && item.type !== 'none' && (
				<>
					<SlideoverRightDesktop
						open={item.type !== 'sector'}
						onClose={onClose}
					>
						{getContent()}
					</SlideoverRightDesktop>

					{isDrawerOpen && <Drawer /> }
				</>
			)}
		</>
	);
};

SlideoverRightBuilder.displayName = "SlideoverRightBuilder";
