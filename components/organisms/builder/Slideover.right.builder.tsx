import React, { useCallback, useState } from "react";
import { ParkingForm, WaypointForm } from "../form";
import { Quark } from "helpers/quarky";
import { Topo } from "types";
import { useBreakpoint } from "helpers/hooks";
import { BoulderBuilderContentMobile } from "./BoulderBuilderContent.mobile";
import { BoulderBuilderContentDesktop } from "./BoulderBuilderContent.desktop";
import { SlideoverMobile, SlideoverRightDesktop } from "components/atoms/overlays";
import { BuilderSlideoverTrackDesktop } from "./BuilderSlideoverTrack.desktop";
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
		if (item.type !== 'none') {
			if (item.type === 'boulder') {
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
			if (item.type === 'parking')
				return (
					<ParkingForm
						topo={props.topo}
					/>
				);
			else
				return (
					<WaypointForm
						topo={props.topo}
					/>
				);
		} else return undefined;
	}, [full, breakpoint, item]);

	return (
		<>
			{breakpoint === "mobile" && (
				<SlideoverMobile
					open={item.type !== 'none'}
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
						open={item.type !== 'none'}
						onClose={onClose}
					>
						<div className="h-full">{getContent()}</div>
					</SlideoverRightDesktop>

					{item.type === 'boulder' && item.selectedTrack &&
						<>
							<BuilderSlideoverTrackDesktop />
							<Drawer />
						</>
					}
				</>
			)}
		</>
	);
};

SlideoverRightBuilder.displayName = "SlideoverRightBuilder";
