import React, { useCallback, useState } from "react";
import { ParkingForm, WaypointForm } from "../form";
import { Quark } from "helpers/quarky";
import { Topo } from "types";
import { useBreakpoint } from "helpers/hooks";
import { BoulderBuilderContentMobile } from "./BoulderBuilderContent.mobile";
import { BoulderBuilderContentDesktop } from "./BoulderBuilderContent.desktop";
import { SlideoverMobile, SlideoverRightDesktop } from "components/atoms/overlays";
import { BuilderTrackSlideoverDesktop } from "./BuilderTrackSlideover.desktop";
import { Drawer } from "../Drawer";
import { useSelectStore } from "components/pages/selectStore";

type SlideoverRightBuilderProps = {
	topo: Quark<Topo>;
};

export const SlideoverRightBuilder: React.FC<SlideoverRightBuilderProps> = (
	props: SlideoverRightBuilderProps
) => {
	const breakpoint = useBreakpoint();
	const [full, setFull] = useState(false);
	const flush = useSelectStore(s => s.flush);
	const item = useSelectStore(s => s.item);

	const onClose = () => {
		if (breakpoint === 'mobile') flush.all();
		else flush.item();
	};

	const getContent = useCallback(() => {
		switch (item.type) {
			case 'sector': return undefined;
			case 'boulder': {
				if (breakpoint === "mobile")	
				return (
					<BoulderBuilderContentMobile
						topo={props.topo}
						full={full}
					/>
				);
				return (
					<BoulderBuilderContentDesktop
						topo={props.topo}
					/>
				);
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
	}, [full, props.topo, breakpoint, item.type]);

	return (
		<>
			{breakpoint === "mobile" && (
				<SlideoverMobile
					open={item.type !== 'none' && item.type !== 'sector'}
					persistent={item.type === 'boulder'}
					onSizeChange={setFull}
					onClose={onClose}
				>
					<div className={"h-full " + (item.type !== 'boulder' ? 'px-4 py-14' : '')}>
						{getContent()}
					</div>
				</SlideoverMobile>
			)}
			{breakpoint !== "mobile" && (
				<>
					<SlideoverRightDesktop
						item={item.type === 'boulder' ? item.value() : undefined}
						open={item.type !== 'none' && item.type !== 'sector'}
						onClose={onClose}
					>
						<div className="h-full">{getContent()}</div>
					</SlideoverRightDesktop>

					{item.type === 'boulder' && item.selectedTrack && item.selectedImage &&
						<>
							<BuilderTrackSlideoverDesktop />
							<Drawer />
						</>
					}
				</>
			)}
		</>
	);
};

SlideoverRightBuilder.displayName = "SlideoverRightBuilder";
