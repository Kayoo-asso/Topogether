import React from "react";
import { SlideagainstRightDesktop, SlideoverMobile } from "components";
import { Quark, watchDependencies } from "helpers/quarky";
import { Waypoint } from "types";
import { WaypointForm } from "..";
import { staticUrl } from "helpers/constants";
import { useModal, useBreakpoint } from "helpers/hooks";

interface WaypointBuilderSlideProps {
	open: boolean;
	waypoint: Quark<Waypoint>;
	onDeleteWaypoint: () => void;
	onClose?: () => void;
}

export const WaypointBuilderSlide: React.FC<WaypointBuilderSlideProps> =
	watchDependencies(({ open = true, ...props }: WaypointBuilderSlideProps) => {
		const [ModalDelete, showModalDelete] = useModal();
		const breakpoint = useBreakpoint();

		return (
			<>
				{breakpoint === "mobile" && (
					<SlideoverMobile onClose={props.onClose}>
						<div className="h-full px-6 py-14">
							<WaypointForm
								waypoint={props.waypoint}
								onDeleteWaypoint={showModalDelete}
							/>
						</div>
					</SlideoverMobile>
				)}
				{breakpoint !== "mobile" && (
					<SlideagainstRightDesktop open onClose={props.onClose}>
						<div className="h-full px-5 py-3">
							<WaypointForm
								waypoint={props.waypoint}
								onDeleteWaypoint={showModalDelete}
							/>
						</div>
					</SlideagainstRightDesktop>
				)}

				<ModalDelete
					buttonText="Confirmer"
					imgUrl={staticUrl.deleteWarning}
					onConfirm={props.onDeleteWaypoint}
				>
					Etes-vous sûr de vouloir supprimer le point de repère ?
				</ModalDelete>
			</>
		);
	});

WaypointBuilderSlide.displayName = "WaypointBuilderSlide";
