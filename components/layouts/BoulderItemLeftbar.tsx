import React from "react";
import { Quark, watchDependencies } from "helpers/quarky";
import { Boulder, Grade } from "types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { useDeleteStore } from "components/store/deleteStore";
import { useModal } from "helpers/hooks/useModal";
import { staticUrl } from "helpers/constants";
import { useSelectStore } from "components/store/selectStore";
import { createTrack } from "helpers/builder";
import { useSession } from "helpers/services";

import ArrowSimple from "assets/icons/arrow-simple.svg";
import CrossDelete from "assets/icons/clear.svg";
import { useDrawerStore } from "components/store/drawerStore";


interface BoulderItemLeftbarProps {
	boulder: Quark<Boulder>;
	orderIndex: number;
	selected: boolean;
	displayed: boolean;
	deletable?: boolean;
	onArrowClick: () => void;
	onNameClick?: () => void;
	displayCreateTrack: boolean;
}

export const BoulderItemLeftbar: React.FC<BoulderItemLeftbarProps> = watchDependencies(({
	deletable = false,
	...props
}: BoulderItemLeftbarProps) => {
	const session = useSession();
	if (!session) return null;
	const del = useDeleteStore(d => d.delete);
	const select = useSelectStore(s => s.select);
	const selectedItem = useSelectStore(s => s.item);

	const openDrawer = useDrawerStore(d => d.openDrawer);
	const openGradeSelector = useDrawerStore(d => d.openGradeSelector);

	const boulder = props.boulder();
	const tracksIter = boulder.tracks.quarks();
	const trackQuarks = Array.from(tracksIter);

	const getGradeColorClass = (grade: Grade) => {
		const lightGrade = parseInt(grade[0]);
		switch (lightGrade) {
			case 3:
				return "text-grade-3";
			case 4:
				return "text-grade-4";
			case 5:
				return "text-grade-5";
			case 6:
				return "text-grade-6";
			case 7:
				return "text-grade-7";
			case 8:
				return "text-grade-8";
			case 9:
				return "text-grade-9";
		}
	};

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable({id: boulder.id});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const [ModalAddImage, showModalAddImage] = useModal();

	return (
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<div className={`flex flex-row items-center text-dark md:cursor-pointer`}>
				<div className="pr-3">
					<ArrowSimple
						className={
							"h-3 w-3 stroke-dark md:cursor-pointer " +
							(props.selected ? "stroke-2 " : "") +
							(props.displayed ? "-rotate-90" : "rotate-180")
						}
						onClick={props.onArrowClick}
					/>
				</div>
				<div onClick={props.onNameClick} className="flex-1">
					<span className={"mr-2" + (props.selected ? " font-semibold" : "")}>
						{props.orderIndex}.
					</span>
					<span
						className={"ktext-base text-base" + (props.selected ? " font-semibold" : "")}
					>
						{boulder.name} 
					</span>
				</div>
				<div className={`${deletable ? '' : 'hidden'} md:cursor-pointer`} onClick={() => del.item({ type: "boulder", value: props.boulder })}>
					<CrossDelete
						className={"h-4 w-4 stroke-grey-medium hover:stroke-dark"}
					/>
				</div>
			</div>

			{props.displayed && (
				// TRACKS
				<div className="ml-4 mb-4 flex flex-col">
					{trackQuarks.map((trackQuark) => {
						const track = trackQuark();
						return (
							<div
								key={track.id}
								className={`flex flex-row items-baseline md:cursor-pointer`}
								onClick={() => {
									select.track(trackQuark, props.boulder);
									openDrawer();
								}}
							>
								{track.grade && (
									<div
										className={
											"ktext-subtitle mr-2 " + getGradeColorClass(track.grade)
										}
									>
										{track.grade}
									</div>
								)}
								<div
									className={
										(track.name && track.name.length > 16
											? "ktext-base-little"
											: "ktext-base") + "text-grey-medium"
									}
								>
									{track.name}
								</div>
							</div>
						);
					})}
					{props.displayCreateTrack && (
						<div
							className={`mt-2 text-grey-medium ${boulder.images.length > 0 ? 'md:cursor-pointer' : 'md:cursor-default'}`}
							onClick={() => {
								if (boulder.images.length > 0) {
									select.track(createTrack(boulder, session.id), props.boulder);
									openGradeSelector();
									openDrawer();
								}
								else showModalAddImage();
							}}
						>
							+ Nouvelle voie
						</div>
					)}
				</div>
			)}

				<ModalAddImage
					buttonText={selectedItem.type === 'boulder' && selectedItem.value().id === boulder.id ? "" : "Ouvrir le bloc"}
					imgUrl={staticUrl.defaultProfilePicture}
					onConfirm={() => select.boulder(props.boulder)}
				>
					Vous devez ajouter une première image pour créer une voie.
				</ModalAddImage>
		</div>
	);
});

BoulderItemLeftbar.displayName = "BoulderItemLeftbar";
